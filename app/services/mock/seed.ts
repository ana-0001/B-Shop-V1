/**
 * app/services/mock/seed.ts — البيانات التأسيسية (Seed) لمشروع B-Shop.
 * - حساب صانع النظام bomba (المستوى 900) حسب القسم 6 من الخطة بالظبط.
 * - منتجات عامة (إلكترونيات، مواد غذائية، أدوات منزلية، مستلزمات مكتبية)
 *   بأسعار واقعية بالجنيه المصري — بدون أي منتجات زراعية (القرار الافتراضي 3).
 * - مولّد فواتير افتتاحية حتمي (deterministic) لآخر 7 أيام لبيانات الشارت والتقارير.
 *
 * تنبيه أمني: كلمة المرور هنا نص تجريبي للـ Mock فقط —
 * التشفير الحقيقي bcrypt هيتطبق في الباك إند (راجع docs/06-backend-migration.md).
 */
import type {
  Branch,
  Category,
  Company,
  Invoice,
  InvoiceItem,
  InvoiceType,
  Manufacturer,
  PriceTier,
  Product,
  User,
} from '@/types'
import { MOCK_CUSTOMERS } from '@/types'
import { productImage } from '@/utils/product-image'
import { addDaysIso, nowUtcIso, todayIsoDate } from '@/utils/dates'
import { computeLineTotal } from '@/utils/invoice'
import { DEFAULT_TAX_RATE } from '@/utils/constants'

/* ================= حساب صانع النظام (bomba) ================= */

export const SEED_USER_ID = 'USR-BOMBA'

export const seedUser: User = {
  id: SEED_USER_ID,
  username: 'bomba',
  level: 900,
  isSystem: true,
  isActive: true,
  tenantId: 'tenant-bshop',
  phones: [
    { value: '01281130712', isPrimary: true, userId: SEED_USER_ID },
    { value: '01281130713', isPrimary: false, userId: SEED_USER_ID },
  ],
  emails: [
    { value: 'bomba000@bomba.com', isPrimary: true, userId: SEED_USER_ID },
    { value: 'bomba001@bomba.com', isPrimary: false, userId: SEED_USER_ID },
  ],
  attachments: [
    { id: 'ATT-BOMBA-AVATAR', userId: SEED_USER_ID, kind: 'avatar', letter: 'B', isPrimary: true },
  ],
}

/**
 * كلمات المرور التجريبية — نص صريح للـ Mock فقط.
 * في الباك إند: bcrypt.compare(input, hash) — ممنوع تُخزن هكذا.
 */
export const SEED_CREDENTIALS: Record<string, string> = {
  [SEED_USER_ID]: 'bomba000',
}

/* ================= بيانات الشركة والفروع ================= */

export const seedCompany: Company = {
  id: 'COMP-BSHOP',
  name: 'B-Shop Trading Co.',
  nameAr: 'شركة بي شوب للتجارة',
  tenantId: 'tenant-bshop',
}

export const seedBranches: Branch[] = [
  { id: 'BR-MAIN', name: 'Main Branch - Cairo', nameAr: 'الفرع الرئيسي - القاهرة', companyId: seedCompany.id },
  { id: 'BR-GIZA', name: 'Second Branch - Giza', nameAr: 'الفرع الثاني - الجيزة', companyId: seedCompany.id },
]

/* ================= الفئات والمصنعين ================= */

export const seedCategories: Category[] = [
  { id: 'CAT-ELEC', name: 'Electronics', nameAr: 'إلكترونيات' },
  { id: 'CAT-GROC', name: 'Grocery', nameAr: 'مواد غذائية' },
  { id: 'CAT-HOME', name: 'Home Tools', nameAr: 'أدوات منزلية' },
  { id: 'CAT-OFFC', name: 'Office Supplies', nameAr: 'مستلزمات مكتبية' },
]

export const seedManufacturers: Manufacturer[] = [
  { id: 'MFG-CAIROTECH', name: 'Cairo Tech', nameAr: 'كايرو تك' },
  { id: 'MFG-NILEFOODS', name: 'Nile Foods', nameAr: 'النيل للأغذية' },
  { id: 'MFG-HOMECRAFT', name: 'HomeCraft Egypt', nameAr: 'هوم كرافت مصر' },
  { id: 'MFG-OFFICEPRO', name: 'OfficePro', nameAr: 'أوفيس برو' },
]

/* ================= كتالوج المنتجات (أسعار EGP) ================= */

interface ProductSeedRow {
  barcode: string
  name: string
  nameAr: string
  categoryId: string
  manufacturerId: string
  t1: number
}

const PRODUCT_ROWS: ProductSeedRow[] = [
  { barcode: '6221000000017', name: 'Smartphone X20 128GB', nameAr: 'موبايل X20 سعة 128 جيجا', categoryId: 'CAT-ELEC', manufacturerId: 'MFG-CAIROTECH', t1: 8499 },
  { barcode: '6221000000024', name: 'Wireless Earbuds Pro', nameAr: 'سماعة بلوتوث Pro', categoryId: 'CAT-ELEC', manufacturerId: 'MFG-CAIROTECH', t1: 1299 },
  { barcode: '6221000000031', name: 'Smart LED TV 43"', nameAr: 'شاشة LED ذكية 43 بوصة', categoryId: 'CAT-ELEC', manufacturerId: 'MFG-CAIROTECH', t1: 10499 },
  { barcode: '6221000000048', name: 'Power Bank 20000mAh', nameAr: 'باور بانك 20000 مللي أمبير', categoryId: 'CAT-ELEC', manufacturerId: 'MFG-CAIROTECH', t1: 899 },
  { barcode: '6222000000012', name: 'Premium Rice 5kg', nameAr: 'أرز فاخر 5 كجم', categoryId: 'CAT-GROC', manufacturerId: 'MFG-NILEFOODS', t1: 385 },
  { barcode: '6222000000029', name: 'Sunflower Oil 1L', nameAr: 'زيت عباد الشمس 1 لتر', categoryId: 'CAT-GROC', manufacturerId: 'MFG-NILEFOODS', t1: 95 },
  { barcode: '6222000000036', name: 'Black Tea 250g', nameAr: 'شاي أسود 250 جم', categoryId: 'CAT-GROC', manufacturerId: 'MFG-NILEFOODS', t1: 78 },
  { barcode: '6222000000043', name: 'Pasta 400g', nameAr: 'مكرونة 400 جم', categoryId: 'CAT-GROC', manufacturerId: 'MFG-NILEFOODS', t1: 22 },
  { barcode: '6223000000019', name: 'Cookware Set 7 Pcs', nameAr: 'طقم حلل 7 قطع', categoryId: 'CAT-HOME', manufacturerId: 'MFG-HOMECRAFT', t1: 2350 },
  { barcode: '6223000000026', name: 'LED Bulb 12W', nameAr: 'لمبة LED 12 وات', categoryId: 'CAT-HOME', manufacturerId: 'MFG-HOMECRAFT', t1: 42 },
  { barcode: '6223000000033', name: 'Steel Thermos 1L', nameAr: 'ترمس ستانلس 1 لتر', categoryId: 'CAT-HOME', manufacturerId: 'MFG-HOMECRAFT', t1: 245 },
  { barcode: '6224000000016', name: 'A4 Paper Ream', nameAr: 'رزم ورق A4', categoryId: 'CAT-OFFC', manufacturerId: 'MFG-OFFICEPRO', t1: 165 },
  { barcode: '6224000000023', name: 'Ballpoint Pens (12)', nameAr: 'أقلام جاف (12 قلم)', categoryId: 'CAT-OFFC', manufacturerId: 'MFG-OFFICEPRO', t1: 63 },
  { barcode: '6224000000030', name: 'Stapler Medium', nameAr: 'دباسة وسط', categoryId: 'CAT-OFFC', manufacturerId: 'MFG-OFFICEPRO', t1: 110 },
]

/** تحويل صفوف السييد لمنتجات كاملة مع الشرائح الثلاثة (T2 ≈ -4% / T3 ≈ -8%) */
export const seedProducts: Product[] = PRODUCT_ROWS.map(row => ({
  barcode: row.barcode,
  name: row.name,
  nameAr: row.nameAr,
  categoryId: row.categoryId,
  manufacturerId: row.manufacturerId,
  prices: {
    1: row.t1,
    2: Math.round(row.t1 * 0.96),
    3: Math.round(row.t1 * 0.92),
  } as Product['prices'],
  imageUrl: productImage(row.categoryId),
}))

/* ================= مولّد الفواتير الافتتاحية ================= */

/** مولّد أرقام شبه عشوائي حتمي (mulberry32) — نفس السييد يطلع نفس البيانات */
function createRng(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickTier(rng: () => number): PriceTier {
  const roll = rng()
  return roll < 0.6 ? 1 : roll < 0.85 ? 2 : 3
}

/** توليد الفواتير الافتتاحية لآخر 7 أيام + فاتورتين معلّقتين */
export function generateSeedInvoices(): Invoice[] {
  const rng = createRng(20261105)
  const invoices: Invoice[] = []
  const today = todayIsoDate()
  let counter = 1000

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const dateIso = addDaysIso(today, -dayOffset)
    const plan: InvoiceType[] = ['SALE', 'SALE', 'SALE', 'PURCHASE']
    if (rng() > 0.45) plan.push('SALE')
    if (rng() > 0.6) plan.push('PURCHASE')
    if (rng() > 0.7) plan.push('RETURN')

    for (const type of plan) {
      counter += 1
      const customer = MOCK_CUSTOMERS[Math.floor(rng() * MOCK_CUSTOMERS.length)]
      const branch = seedBranches[Math.floor(rng() * seedBranches.length)]
      const tier = pickTier(rng)
      const itemsCount = 1 + Math.floor(rng() * 4)
      const items: InvoiceItem[] = []

      for (let i = 0; i < itemsCount; i++) {
        const product = seedProducts[Math.floor(rng() * seedProducts.length)]
        const qty = 1 + Math.floor(rng() * (type === 'PURCHASE' ? 12 : 6))
        const unitPrice = product.prices[tier]
        items.push({
          id: `ITM-SEED-${counter}-${i}`,
          barcode: product.barcode,
          name: product.name,
          nameAr: product.nameAr,
          qty,
          unitPrice,
          total: computeLineTotal(qty, unitPrice),
        })
      }

      const discount = rng() > 0.6 ? Math.floor(rng() * 4) * 25 : 0
      const hour = 9 + Math.floor(rng() * 10)
      const minute = Math.floor(rng() * 60)
      const postedAt = new Date(`${dateIso}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`).toISOString()

      invoices.push({
        id: `INV-${counter}`,
        type,
        status: 'POSTED',
        branchId: branch.id,
        customerName: customer.en,
        customerNameAr: customer.ar,
        customerPhones: ['01000000000'],
        customerAddresses: [],
        priceTier: tier,
        items,
        discount,
        taxRate: DEFAULT_TAX_RATE,
        notes: [],
        createdAt: postedAt,
        updatedAt: postedAt,
        postedAt,
      })
    }
  }

  // فاتورتان معلّقتان (HELD) عشان شاشة التعليق يبقى فيها بيانات حقيقية
  const heldCustomer = MOCK_CUSTOMERS[1]
  counter += 1
  invoices.push({
    id: `INV-${counter}`,
    type: 'SALE',
    status: 'HELD',
    branchId: 'BR-MAIN',
    customerName: heldCustomer.en,
    customerNameAr: heldCustomer.ar,
    customerPhones: ['01112223334'],
    customerAddresses: ['Nasr City - Cairo'],
    priceTier: 2,
    items: [
      {
        id: 'ITM-HELD-1',
        barcode: '6221000000024',
        name: 'Wireless Earbuds Pro',
        nameAr: 'سماعة بلوتوث Pro',
        qty: 3,
        unitPrice: seedProducts[1].prices[2],
        total: computeLineTotal(3, seedProducts[1].prices[2]),
        notes: 'Reserved for store pickup',
      },
    ],
    discount: 50,
    taxRate: DEFAULT_TAX_RATE,
    notes: ['Customer will confirm by phone'],
    createdAt: nowUtcIso(),
    updatedAt: nowUtcIso(),
    heldAt: nowUtcIso(),
  })

  counter += 1
  invoices.push({
    id: `INV-${counter}`,
    type: 'PURCHASE',
    status: 'HELD',
    branchId: 'BR-GIZA',
    customerName: MOCK_CUSTOMERS[2].en,
    customerNameAr: MOCK_CUSTOMERS[2].ar,
    customerPhones: ['01555667788'],
    customerAddresses: [],
    priceTier: 3,
    items: [
      {
        id: 'ITM-HELD-2',
        barcode: '6224000000016',
        name: 'A4 Paper Ream',
        nameAr: 'رزم ورق A4',
        qty: 20,
        unitPrice: seedProducts[11].prices[3],
        total: computeLineTotal(20, seedProducts[11].prices[3]),
      },
    ],
    discount: 0,
    taxRate: DEFAULT_TAX_RATE,
    notes: [],
    createdAt: nowUtcIso(),
    updatedAt: nowUtcIso(),
    heldAt: nowUtcIso(),
  })

  return invoices
}

/** أول رقم فاتورة متاح بعد السييد */
export const SEED_START_INVOICE_NUMBER = 1000
