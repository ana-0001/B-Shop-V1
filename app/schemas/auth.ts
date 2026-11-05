/**
 * app/schemas/auth.ts — مخططات Zod للتحقق من نموذج تسجيل الدخول.
 * رسائل الخطأ عبارة عن مفاتيح ترجمة — بتترجم في المكون عبر t().
 * منطق كشف نوع المعرّف مشترك مع utils/identifier.ts (نفس ريجيكسات التصميم).
 */
import { z } from 'zod'
import { isValidIdentifier } from '@/utils/identifier'

export const identifierSchema = z
  .string()
  .trim()
  .min(1, 'signin.errIdEmpty')
  .refine(isValidIdentifier, 'signin.errIdInvalid')

export const passwordSchema = z.string().min(6, 'signin.errPassShort')

export const signInSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
  remember: z.boolean(),
})

export type SignInInput = z.infer<typeof signInSchema>
