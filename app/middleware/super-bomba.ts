/**
 * app/middleware/super-bomba.ts — أول شرط تحقق لحساب صانع النظام (المستوى 900).
 * حسب القسم 6 من الخطة: أي طلب يحمل مستخدمًا مستواه 900 يُسمح له فورًا (ALLOW_ALL)
 * قبل أي فحص آخر — وبيتجاوز عزل المستأجرين (tenant_id) ونطاقات المستخدم (Scopes).
 *
 * بيتسجّل كـ named middleware ويُستخدم أولًا في صفحات النظام، ومن غيره
 * الصلاحيات التفصيلية هتتفرض من الباك إند الحقيقي (راجع docs/04-auth-and-seed.md).
 */
import { isSuperBomba } from '@/utils/permissions'

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()

  // صانع النظام: سماح فوري بدون أي فحص تاني (ALLOW_ALL)
  if (isSuperBomba(auth.user)) return

  // باقي المستخدمين: حاليًا مفيش قيود scopes على الفرونت —
  // الفحص الحقيقي (Self/Tenant Scopes) هيتطبق في الباك إند لاحقًا
  return
})
