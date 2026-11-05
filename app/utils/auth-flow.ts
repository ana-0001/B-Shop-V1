/**
 * app/utils/auth-flow.ts — حساب مسار التوجيه بعد تسجيل الدخول أو الـ Splash.
 * الترتيب إلزامي: الشروط → الإعداد الأولي → لوحة التحكم (القسم 7 من الخطة).
 */
import { ROUTE_NAMES } from '@/utils/constants'

export function resolvePostAuthRoute(needsTerms: boolean, needsOnboarding: boolean): string {
  if (needsTerms) return ROUTE_NAMES.terms
  if (needsOnboarding) return ROUTE_NAMES.onboarding
  return ROUTE_NAMES.dashboard
}
