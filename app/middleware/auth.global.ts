/**
 * app/middleware/auth.global.ts — حماية المسارات العامة (Route Guard).
 * ترتيب الفحوصات (حسب الخطة):
 *  1) صانع النظام (المستوى 900): بيتسمح له فورًا في فحوصات الصلاحيات (ALLOW_ALL).
 *  2) غير المسجل: ممنوع الشاشات المحمية وصفحات القمع → /auth/sign-in.
 *  3) المسجل بدون شروط مقبولة → /terms (إلزامي لكل المستخدمين).
 *  4) المسجل بدون إعداد أولي → /onboarding (إلزامي لكل المستخدمين).
 *  5) اللي خلص كل حاجة: صفحات الدخول والقمع بتحوّله للوحة التحكم.
 */
import { PROTECTED_ROUTES, ROUTE_NAMES } from '@/utils/constants'
import { isSuperBomba } from '@/utils/permissions'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // (1) أول شرط تحقق على الإطلاق — صانع النظام level=900
  const isSuperUser = isSuperBomba(auth.user)

  const isProtected = PROTECTED_ROUTES.some(
    route => to.path === route || to.path.startsWith(`${route}/`),
  )
  const isSignInPage = to.path === ROUTE_NAMES.signIn
  const isFunnelPage = to.path === ROUTE_NAMES.terms || to.path === ROUTE_NAMES.onboarding

  // (2) زائر — حماية الشاشات المحمية وصفحات القمع
  if (!auth.isAuthenticated) {
    if (isProtected || isFunnelPage) {
      return navigateTo(ROUTE_NAMES.signIn, { replace: true })
    }
    return
  }

  // (3) مسجل دخول — منع رجوعه لصفحة تسجيل الدخول وتوجيهه حسب بواباته
  if (isSignInPage) {
    if (auth.needsTerms) return navigateTo(ROUTE_NAMES.terms, { replace: true })
    if (auth.needsOnboarding) return navigateTo(ROUTE_NAMES.onboarding, { replace: true })
    return navigateTo(ROUTE_NAMES.dashboard, { replace: true })
  }

  // (4) بوابات الشروط والإعداد — إلزامية قبل الوصول للوحة التحكم
  if (isProtected) {
    if (auth.needsTerms) return navigateTo(ROUTE_NAMES.terms, { replace: true })
    if (auth.needsOnboarding) return navigateTo(ROUTE_NAMES.onboarding, { replace: true })
  }

  // اللي خلص القمع ومحاول يرجع لصفحاته تاني — بيتوجه للشغل مباشرة
  if (isFunnelPage && !auth.needsTerms && !auth.needsOnboarding) {
    return navigateTo(ROUTE_NAMES.dashboard, { replace: true })
  }

  // (5) صانع النظام: ALLOW_ALL — بيتجاوز أي فحص صلاحيات إضافي (نطاقات/scope)
  if (isSuperUser) return

  // باقي المستخدمين: فحوصات الصلاحيات التفصيلية هتشتغل مع الباك إند الحقيقي
  return
})
