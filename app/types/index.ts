/**
 * app/types/index.ts — كل أنواع TypeScript المشتركة للمشروع (نموذج البيانات + DTOs).
 * الأنواع دي بتمثل عقود البيانات بين الواجهة وطبقة الـ API (المحاكاة دلوقتي والباك إند لاحقًا).
 * ملاحظة: كل الـ timestamps بتتخزن UTC ISO strings.
 */

/* ============ الثوابت والاتجاهات ============ */
export type LocaleCode = 'en' | 'ar'
export type TextDirection = 'ltr' | 'rtl'
export type ThemeMode = 'light' | 'dark' | 'system'
export type PriceTier = 1 | 2 | 3

/* ============ الأنواع المرتبطة بالمستخدم ============ */
export interface UserPhone {
  value: string
  isPrimary: boolean
  userId: string
}

export interface UserEmail {
  value: string
  isPrimary: boolean
  userId: string
}

/** المرفقات — حاليًا الأفاتار الدائري بحرف B */
export interface UserAttachment {
  id: string
  userId: string
  kind: 'avatar'
  letter: string
  isPrimary: boolean
}

export interface User {
  id: string
  username: string
  level: number
  isSystem: boolean
  isActive: boolean
  tenantId: string
  phones: UserPhone[]
  emails: UserEmail[]
  attachments: UserAttachment[]
}

/** بيانات المستخدم اللي بتتنقل للواجهة بعد تسجيل الدخول (DTO) */
export interface SessionUser {
  id: string
  username: string
  displayName: string
  level: number
  isSystem: boolean
  tenantId: string
  avatarLetter: string
  phones: string[]
  emails: string[]
}

export interface AuthResponse {
  user: SessionUser
  accessToken: string
  /** فلاجللي واجهة تعرف توجّه المستخدم للشروط أو الإعداد الأولي */
  termsAccepted: boolean
  /** تاريخ قبول الشروط (UTC) — بيرجع من الباك إند مع حالة المستخدم */
  termsAcceptedAt?: string | null
  onboardingCompleted: boolean
  /** بيانات الملف الوظيفي المحفوظة من الإعداد الأولي (اختياري للتوافق الرجعي) */
  operatorProfile?: { jobTitle: string; avatarIcon: string }
}

/* ============ كيانات النظام التجارية ============ */
export interface Company {
  id: string
  name: string
  nameAr: string
  tenantId: string
}

export interface Branch {
  id: string
  name: string
  nameAr: string
  companyId: string
}

export interface Category {
  id: string
  name: string
  nameAr: string
}

export interface Manufacturer {
  id: string
  name: string
  nameAr: string
}

export interface ProductPrices {
  1: number
  2: number
  3: number
}

export interface Product {
  barcode: string
  name: string
  nameAr: string
  categoryId: string
  manufacturerId: string
  prices: ProductPrices
  imageUrl: string
}

/* ============ الفواتير ============ */
export type InvoiceType = 'SALE' | 'PURCHASE' | 'RETURN'
export type InvoiceStatus = 'OPEN' | 'POSTED' | 'HELD'

export interface InvoiceItem {
  id: string
  barcode: string
  name: string
  nameAr: string
  qty: number
  unitPrice: number
  total: number
  notes?: string
}

export interface Invoice {
  id: string
  type: InvoiceType
  status: InvoiceStatus
  branchId: string
  customerName: string
  /** الاسم العربي للعميل — بيُعرض في واجهة RTL */
  customerNameAr: string
  customerPhones: string[]
  customerAddresses: string[]
  priceTier: PriceTier
  items: InvoiceItem[]
  discount: number
  taxRate: number
  notes: string[]
  createdAt: string
  updatedAt: string
  postedAt?: string
  heldAt?: string
}

/** أسماء العملاء التجريبية (إنجليزي/عربي) للفواتير الافتتاحية */
export const MOCK_CUSTOMERS: Array<{ en: string; ar: string }> = [
  { en: 'Walk-in Customer', ar: 'عميل نقدي' },
  { en: 'Nour Trading Stores', ar: 'محلات نور التجارية' },
  { en: 'Delta Supplies Co.', ar: 'شركة الدلتا للتوريدات' },
  { en: 'Modern Office House', ar: 'بيت المكتب الحديث' },
  { en: 'Green Valley Markets', ar: 'أسواق الوادي الأخضر' },
  { en: 'Cairo Home Center', ar: 'مركز القاهرة للأدوات المنزلية' },
]

/** اسم العميل حسب لغة الواجهة */
export function invoiceCustomerName(invoice: Pick<Invoice, 'customerName' | 'customerNameAr'>, locale: 'en' | 'ar'): string {
  return locale === 'ar' ? (invoice.customerNameAr || invoice.customerName) : invoice.customerName
}

/** اسم كيان ثنائي اللغة (فئة / مصنع / فرع...) حسب اللغة */
export function localizedEntityName(entity: { name: string; nameAr: string }, locale: 'en' | 'ar'): string {
  return locale === 'ar' ? (entity.nameAr || entity.name) : entity.name
}

/* ============ شاشات البيانات المجمعة (DTOs) ============ */
export interface DashboardSummary {
  totalNet: number
  invoiceCount: number
  openCount: number
  postedCount: number
  heldCount: number
  itemUnits: number
  customerCount: number
  weekSeries: Array<{ date: string; label: string; sales: number; purchases: number }>
  typeDistribution: { SALE: number; PURCHASE: number; RETURN: number }
  recentInvoices: Invoice[]
}

export interface AccountTotals {
  salesTotal: number
  purchaseTotal: number
  returnTotal: number
  heldCount: number
  ledger: Invoice[]
}

export interface InventoryRow {
  barcode: string
  name: string
  nameAr: string
  categoryId: string
  manufacturerId: string
  stock: number
  unitsBilled: number
  invoicesCount: number
}

export interface ReportRow {
  type: InvoiceType
  invoices: number
  items: number
  netTotal: number
}

export interface ReportSummary {
  invoiceCount: number
  totalNet: number
  averageTicket: number
  totalUnits: number
  totalDiscounts: number
  postedCount: number
  heldCount: number
  rows: ReportRow[]
}

/* ============ نتيجة الـ API الموحدة ============ */
export interface ApiError {
  code: string
  message: string
  messageAr: string
}

export class ApiRequestError extends Error {
  public readonly code: string
  public readonly messageAr: string

  constructor(err: ApiError) {
    super(err.message)
    this.name = 'ApiRequestError'
    this.code = err.code
    this.messageAr = err.messageAr
  }
}
