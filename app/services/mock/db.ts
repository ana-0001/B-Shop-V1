/**
 * app/services/mock/db.ts — قاعدة البيانات التجريبية المحلية (Mock Database).
 * - بتتحفظ في localStorage عشان البيانات تفضل موجودة بعد إعادة التشغيل.
 * - أول تشغيل فقط بيتم حقن الـ Seed (حساب bomba + الكتالوج + الفواتير الافتتاحية).
 * - resetMockDatabase() بيرجّع حالة المصنع بالكامل (نفس زر Reset Mock DB).
 */
import type { Branch, Category, Company, Invoice, Manufacturer, Product, User } from '@/types'
import { STORAGE_KEYS } from '@/utils/constants'
import { todayIsoDate } from '@/utils/dates'
import {
  SEED_START_INVOICE_NUMBER,
  generateSeedInvoices,
  seedBranches,
  seedCategories,
  seedCompany,
  seedManufacturers,
  seedProducts,
  seedUser,
} from '@/services/mock/seed'

export interface MockDatabase {
  meta: {
    currency: 'EGP'
    defaultTaxRate: number
    operationDate: string
    nextInvoiceNumber: number
  }
  users: User[]
  /** حالة كل مستخدم (الشروط + الإعداد الأولي) — زي ما الباك إند بيخزنها على حساب المستخدم */
  userStates: Record<string, UserSystemState>
  companies: Company[]
  branches: Branch[]
  categories: Category[]
  manufacturers: Manufacturer[]
  products: Product[]
  /** الفواتير المخزنة — POSTED و HELD فقط (المسودات المفتوحة في متجر الفواتير) */
  invoices: Invoice[]
}

/** حالة المستخدم داخل النظام (بوابات الشروط والإعداد) */
export interface UserSystemState {
  termsAcceptedAt: string | null
  onboardingCompleted: boolean
  operatorProfile: { jobTitle: string; avatarIcon: string }
}

let cachedDb: MockDatabase | null = null

/** بناء قاعدة بيانات جديدة من الـ Seed من الصفر */
export function buildSeedDatabase(): MockDatabase {
  const seed = seedUser
  return {
    meta: {
      currency: 'EGP',
      defaultTaxRate: 14,
      operationDate: todayIsoDate(),
      nextInvoiceNumber: SEED_START_INVOICE_NUMBER,
    },
    users: [seed],
    userStates: {},
    companies: [seedCompany],
    branches: seedBranches,
    categories: seedCategories,
    manufacturers: seedManufacturers,
    products: seedProducts,
    invoices: generateSeedInvoices(),
  }
}

/** قراءة قاعدة البيانات — أول مرة بتبني الـ Seed وتحفظه */
export function loadMockDatabase(): MockDatabase {
  if (cachedDb) return cachedDb

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.mockDb)
      if (raw) {
        const parsed = JSON.parse(raw) as MockDatabase
        if (parsed?.products?.length && parsed?.invoices && parsed?.meta) {
          // ترقية قواعد بيانات الجلسات القديمة — ضمان وجود userStates
          if (!parsed.userStates) parsed.userStates = {}
          cachedDb = parsed
          return cachedDb
        }
      }
    } catch {
      // بيانات تالفة — هنبني من الـ Seed تاني
    }
  }

  cachedDb = buildSeedDatabase()
  saveMockDatabase(cachedDb)
  return cachedDb
}

/** حفظ قاعدة البيانات في localStorage */
export function saveMockDatabase(db: MockDatabase): void {
  cachedDb = db
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEYS.mockDb, JSON.stringify(db))
    } catch {
      // التخزين ممتلئ أو ممنوع — بنكمل في الذاكرة فقط
    }
  }
}

/** تصفير كامل لقاعدة البيانات واسترجاع الـ Seed الافتراضي */
export function resetMockDatabase(): MockDatabase {
  const fresh = buildSeedDatabase()
  saveMockDatabase(fresh)
  return fresh
}

/** محاكاة زمن استجابة الـ API (بنفس قيمة ملف التصميم) */
export function mockLatency(ms = 260): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
