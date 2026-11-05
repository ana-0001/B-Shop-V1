/**
 * app/services/mock/handlers.ts — تنفيذ كل الـ endpoints في وضع المحاكاة.
 * كل دالة هنا بتمثل استجابة باك إند حقيقي بنفس شكل الـ DTO
 * (موثقة بالكامل في docs/02-api-contract.md).
 */
import type {
  AccountTotals,
  AuthResponse,
  DashboardSummary,
  InventoryRow,
  Invoice,
  LocaleCode,
  ReportSummary,
  ReportRow,
  SessionUser,
  User,
} from '@/types'
import { invoiceCustomerName, ApiRequestError } from '@/types'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { addDaysIso, nowUtcIso, todayIsoDate, formatDayLabel } from '@/utils/dates'
import { DEFAULT_TAX_RATE, LOW_STOCK_THRESHOLD } from '@/utils/constants'
import { loadMockDatabase, mockLatency, saveMockDatabase } from '@/services/mock/db'
import { SEED_CREDENTIALS } from '@/services/mock/seed'

/** توحيد صيغة الهاتف المصري للمقارنة (بيشيل +20 والمسافات) */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('20') && digits.length > 10 ? `0${digits.slice(2)}` : digits
}

/** البحث عن المستخدم بالمعرّف الموحد (اسم مستخدم / بريد / هاتف) */
function findUserByIdentifier(identifier: string): User | undefined {
  const db = loadMockDatabase()
  const value = identifier.trim().toLowerCase()
  return db.users.find(user => {
    if (user.username.toLowerCase() === value) return true
    if (user.emails.some(email => email.value.toLowerCase() === value)) return true
    if (user.phones.some(phone => normalizePhone(phone.value) === normalizePhone(identifier))) return true
    return false
  })
}

/** تحويل كيان المستخدم الكامل لـ SessionUser المرسل للواجهة */
export function toSessionUser(user: User): SessionUser {
  const avatar = user.attachments.find(att => att.kind === 'avatar' && att.isPrimary) ?? user.attachments[0]
  return {
    id: user.id,
    username: user.username,
    displayName: user.username,
    level: user.level,
    isSystem: user.isSystem,
    tenantId: user.tenantId,
    avatarLetter: avatar?.letter ?? user.username.charAt(0).toUpperCase(),
    phones: [...user.phones].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)).map(phone => phone.value),
    emails: [...user.emails].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)).map(email => email.value),
  }
}

/* ============ المصادقة ============ */

/** POST /auth/login — تسجيل الدخول بالمعرّف الموحد */
export async function mockSignIn(identifier: string, password: string): Promise<AuthResponse> {
  await mockLatency(420)
  const user = findUserByIdentifier(identifier)
  // ملاحظة: المقارنة النصية هنا للـ Mock فقط — bcrypt في الباك إند
  if (!user || SEED_CREDENTIALS[user.id] !== password) {
    throw new ApiRequestError({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid identifier or password.',
      messageAr: 'المعرّف أو كلمة المرور غير صحيحة.',
    })
  }
  return {
    user: toSessionUser(user),
    accessToken: 'mock-token-bomba',
    termsAccepted: false,
    onboardingCompleted: false,
  }
}

/** POST /auth/logout — تسجيل الخروج (Mock) */
export async function mockSignOut(): Promise<void> {
  await mockLatency(120)
}

/* ============ الفواتير ============ */

/** POST /invoices/next-id — توليد رقم الفاتورة التالي بشكل متسلسل */
export async function mockNextInvoiceId(): Promise<string> {
  await mockLatency(80)
  const db = loadMockDatabase()
  const id = `INV-${db.meta.nextInvoiceNumber}`
  db.meta.nextInvoiceNumber += 1
  saveMockDatabase(db)
  return id
}

/** POST /invoices/hold — تعليق فاتورة مفتوحة */
export async function mockHoldInvoice(invoice: Invoice): Promise<Invoice> {
  await mockLatency(200)
  const db = loadMockDatabase()
  const held: Invoice = { ...structuredClone(toRawInvoice(invoice)), status: 'HELD', heldAt: nowUtcIso(), updatedAt: nowUtcIso() }
  const existingIndex = db.invoices.findIndex(entry => entry.id === held.id)
  if (existingIndex >= 0) db.invoices[existingIndex] = held
  else db.invoices.push(held)
  saveMockDatabase(db)
  return held
}

/** POST /invoices/post — ترحيل فاتورة (حفظ نهائي) */
export async function mockPostInvoice(invoice: Invoice): Promise<Invoice> {
  await mockLatency(240)
  const db = loadMockDatabase()
  const posted: Invoice = { ...structuredClone(toRawInvoice(invoice)), status: 'POSTED', postedAt: nowUtcIso(), updatedAt: nowUtcIso() }
  const existingIndex = db.invoices.findIndex(entry => entry.id === posted.id)
  if (existingIndex >= 0) db.invoices[existingIndex] = posted
  else db.invoices.unshift(posted)
  saveMockDatabase(db)
  return posted
}

/** GET /invoices/held — قائمة الفواتير المعلّقة */
export async function mockListHeld(): Promise<Invoice[]> {
  await mockLatency(180)
  const db = loadMockDatabase()
  return db.invoices.filter(invoice => invoice.status === 'HELD')
}

/** POST /invoices/held/:id/restore — استرجاع فاتورة معلّقة لمساحة العمل */
export async function mockRestoreHeld(id: string): Promise<Invoice | null> {
  await mockLatency(180)
  const db = loadMockDatabase()
  const index = db.invoices.findIndex(invoice => invoice.id === id && invoice.status === 'HELD')
  if (index < 0) return null
  const [restored] = db.invoices.splice(index, 1)
  saveMockDatabase(db)
  return restored
}

/** DELETE /invoices/held/:id — حذف فاتورة معلّقة نهائيًا */
export async function mockDeleteHeld(id: string): Promise<boolean> {
  await mockLatency(150)
  const db = loadMockDatabase()
  const before = db.invoices.length
  db.invoices = db.invoices.filter(invoice => !(invoice.id === id && invoice.status === 'HELD'))
  saveMockDatabase(db)
  return db.invoices.length < before
}

/** فصل حقول الواجهة المؤقتة عن الـ DTO الرسمي قبل الإرسال */
function toRawInvoice(draft: Invoice): Invoice {
  const { customerTab: _customerTab, sideTab: _sideTab, ...raw } = draft as Invoice & Record<string, unknown>
  return raw as Invoice
}

/* ============ الشاشات المجمعة ============ */

/**
 * GET /dashboard/summary — ملخص لوحة التحكم.
 * openDrafts: المسودات المفتوحة من متجر الفواتير (بتُمرر من الصفحة
 * عشان الأرقام تفضل متسقة بين كل الشاشات الأربعة).
 */
export async function mockDashboardSummary(openDrafts: Invoice[], locale: LocaleCode): Promise<DashboardSummary> {
  await mockLatency(220)
  const db = loadMockDatabase()
  const dbInvoices = db.invoices.filter(invoice => invoice.status === 'POSTED' || invoice.status === 'HELD')
  const all = [...openDrafts, ...dbInvoices]
  const posted = all.filter(invoice => invoice.status === 'POSTED')

  const totalNet = all.reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0)
  const itemUnits = all.reduce((sum, invoice) => sum + invoice.items.reduce((qtySum, item) => qtySum + item.qty, 0), 0)
  const customers = new Set(all.map(invoice => invoiceCustomerName(invoice, 'en')).filter(Boolean))

  // سلسلة آخر 7 أيام (مبيعات + مشتريات) من الفواتير المرحّلة
  const today = todayIsoDate()
  const weekSeries = Array.from({ length: 7 }, (_, index) => {
    const date = addDaysIso(today, index - 6)
    const dayInvoices = posted.filter(invoice => (invoice.postedAt ?? invoice.updatedAt).slice(0, 10) === date)
    return {
      date,
      label: formatDayLabel(date, locale),
      sales: dayInvoices.filter(invoice => invoice.type === 'SALE').reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0),
      purchases: dayInvoices.filter(invoice => invoice.type === 'PURCHASE').reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0),
    }
  })

  const typeDistribution = {
    SALE: all.filter(invoice => invoice.type === 'SALE').length,
    PURCHASE: all.filter(invoice => invoice.type === 'PURCHASE').length,
    RETURN: all.filter(invoice => invoice.type === 'RETURN').length,
  }

  const recentInvoices = [...all]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 8)

  return {
    totalNet,
    invoiceCount: all.length,
    openCount: openDrafts.length,
    postedCount: all.filter(invoice => invoice.status === 'POSTED').length,
    heldCount: all.filter(invoice => invoice.status === 'HELD').length,
    itemUnits,
    customerCount: customers.size,
    weekSeries,
    typeDistribution,
    recentInvoices,
  }
}

/** GET /accounts/totals — ملخص الحسابات ودفتر الفواتير */
export async function mockAccountTotals(openDrafts: Invoice[]): Promise<AccountTotals> {
  await mockLatency(220)
  const db = loadMockDatabase()
  const dbInvoices = db.invoices.filter(invoice => invoice.status === 'POSTED' || invoice.status === 'HELD')
  const all = [...openDrafts, ...dbInvoices]

  const sumByType = (type: Invoice['type']) =>
    all.filter(invoice => invoice.type === type).reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0)

  return {
    salesTotal: sumByType('SALE'),
    purchaseTotal: sumByType('PURCHASE'),
    returnTotal: sumByType('RETURN'),
    heldCount: all.filter(invoice => invoice.status === 'HELD').length,
    ledger: [...all].sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')),
  }
}

/** هاش حتمي لمخزون ثابت لكل صنف/فرع */
function stockHash(seed: string): number {
  let hash = 2166136261
  for (const ch of seed) {
    hash ^= ch.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) % 120
}

/** GET /inventory — صفوف المخزون حسب الفرع */
export async function mockInventoryList(openDrafts: Invoice[], branchId?: string): Promise<InventoryRow[]> {
  await mockLatency(220)
  const db = loadMockDatabase()
  const relevantInvoices = [...openDrafts, ...db.invoices].filter(
    invoice => invoice.status !== 'HELD' && (!branchId || branchId === 'ALL' || invoice.branchId === branchId),
  )

  return db.products.map(product => {
    const billed = relevantInvoices.flatMap(invoice => invoice.items.filter(item => item.barcode === product.barcode))
    const invoicesCount = relevantInvoices.filter(invoice => invoice.items.some(item => item.barcode === product.barcode)).length
    const stock = branchId && branchId !== 'ALL'
      ? stockHash(product.barcode + branchId)
      : db.branches.reduce((sum, branch) => sum + stockHash(product.barcode + branch.id), 0)
    return {
      barcode: product.barcode,
      name: product.name,
      nameAr: product.nameAr,
      categoryId: product.categoryId,
      manufacturerId: product.manufacturerId,
      stock,
      unitsBilled: billed.reduce((sum, item) => sum + item.qty, 0),
      invoicesCount,
    }
  })
}

/** GET /reports/summary — التقارير التحليلية حسب نوع الفاتورة */
export async function mockReportSummary(openDrafts: Invoice[]): Promise<ReportSummary> {
  await mockLatency(220)
  const db = loadMockDatabase()
  const dbInvoices = db.invoices.filter(invoice => invoice.status === 'POSTED' || invoice.status === 'HELD')
  const all = [...openDrafts, ...dbInvoices]

  const types: Invoice['type'][] = ['SALE', 'PURCHASE', 'RETURN']
  const rows: ReportRow[] = types.map(type => {
    const typeInvoices = all.filter(invoice => invoice.type === type)
    return {
      type,
      invoices: typeInvoices.length,
      items: typeInvoices.reduce((sum, invoice) => sum + invoice.items.length, 0),
      netTotal: typeInvoices.reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0),
    }
  })

  const totalNet = all.reduce((sum, invoice) => sum + computeInvoiceAmounts(invoice).net, 0)
  return {
    invoiceCount: all.length,
    totalNet,
    averageTicket: all.length ? totalNet / all.length : 0,
    totalUnits: all.reduce((sum, invoice) => sum + invoice.items.reduce((qtySum, item) => qtySum + item.qty, 0), 0),
    totalDiscounts: all.reduce((sum, invoice) => sum + (Number(invoice.discount) || 0), 0),
    postedCount: all.filter(invoice => invoice.status === 'POSTED').length,
    heldCount: all.filter(invoice => invoice.status === 'HELD').length,
    rows,
  }
}

/** GET /meta — بيانات النظام العامة (عملة/ضريبة/فروع...) */
export async function mockSystemMeta() {
  await mockLatency(100)
  const db = loadMockDatabase()
  return {
    currency: 'EGP' as const,
    defaultTaxRate: db.meta.defaultTaxRate ?? DEFAULT_TAX_RATE,
    operationDate: todayIsoDate(),
    branches: db.branches,
    categories: db.categories,
    manufacturers: db.manufacturers,
    products: db.products,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  }
}
