/**
 * app/utils/format.ts — دوال تنسيق الأرقام والعملة (EGP) حسب اللغة الحالية.
 * العربي بيستخدم الأرقام الهندية (ar-EG) والإنجليزي الصيغة الدولية (en-US).
 */
import { CURRENCY_CODE } from '@/utils/constants'
import type { LocaleCode } from '@/types'

/** تنسيق مبلغ مالي بالجنيه المصري — زي ملف التصميم بالظبط */
export function formatCurrency(value: number | string, locale: LocaleCode): string {
  const num = Number(value) || 0
  if (locale === 'ar') {
    return `${num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`
  }
  return `${CURRENCY_CODE} ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** تنسيق رقم عادي مع فواصل الآلاف حسب اللغة */
export function formatNumber(value: number | string, locale: LocaleCode): string {
  const num = Number(value) || 0
  return num.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')
}

/** تنسيق نسبة مئوية — بيدخل كسر عشري (0.25 = 25%) */
export function formatPercent(fraction: number, locale: LocaleCode): string {
  const pct = Math.round((Number(fraction) || 0) * 100)
  return `${formatNumber(pct, locale)}%`
}

/** تنسيق سعر شريحة تسعير مع رقمها (T1/T2/T3) */
export function formatTierPrice(price: number, tier: 1 | 2 | 3, locale: LocaleCode): string {
  return formatCurrency(price, locale)
}
