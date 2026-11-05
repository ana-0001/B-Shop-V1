/**
 * app/utils/constants.ts — ثوابت المشروع العامة (عملة، ضريبة، مفاتيح تخزين...).
 * بتجمع الأرقام والقيم اللي بتتكرر في أكتر من مكان عشان سهولة التعديل.
 */
import type { PriceTier } from '@/types'

/** رمز العملة الرسمي للمشروع — الجنيه المصري */
export const CURRENCY_CODE = 'EGP'

/** نسبة ضريبة القيمة المضافة الافتراضية (14%) */
export const DEFAULT_TAX_RATE = 14

/** شرائح التسعير الثلاثة المتاحة */
export const PRICE_TIERS: PriceTier[] = [1, 2, 3]

/** مستوى صانع النظام (super bomba) */
export const SUPER_BOMBA_LEVEL = 900

/** مفاتيح التخزين المحلي — موحدة عشان ما يحصلش تعارض */
export const STORAGE_KEYS = {
  preferences: 'bshop_prefs_v1',
  auth: 'bshop_auth_v1',
  invoices: 'bshop_invoices_v1',
  mockDb: 'bshop_mock_db_v1',
} as const

/** أسماء صفحات النظام — بتستخدم في الترجمة والتنقل */
export const ROUTE_NAMES = {
  splash: '/',
  signIn: '/auth/sign-in',
  terms: '/terms',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  invoices: '/invoices',
  accounts: '/accounts',
  inventory: '/inventory',
  reports: '/reports',
} as const

/** المسارات المحمية اللي محتاجة تسجيل دخول */
export const PROTECTED_ROUTES: string[] = [
  ROUTE_NAMES.dashboard,
  ROUTE_NAMES.invoices,
  ROUTE_NAMES.accounts,
  ROUTE_NAMES.inventory,
  ROUTE_NAMES.reports,
]

/** حد المخزون المنخفض — تحته الصنف يظهر بتحذير */
export const LOW_STOCK_THRESHOLD = 10

/** مدة تأخير محاكاة الـ API بالمللي ثانية */
export const MOCK_LATENCY_MS = 260
