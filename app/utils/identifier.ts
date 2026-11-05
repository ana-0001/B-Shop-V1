/**
 * app/utils/identifier.ts — منطق المعرّف الموحد (اسم مستخدم / بريد / هاتف مصري).
 * الريجيكسات مأخوذة من ملف التصميم المرجعي حرفيًا عشان نفس سلوك الـ Badge.
 */

export type IdentifierType = 'email' | 'phone' | 'username' | 'invalid' | 'empty'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** الهاتف المصري: 01xxxxxxxxx (مع سماحية +20 اختيارية) */
const PHONE_REGEX = /^(\+?20|0)?1[0125]\d{8}$/
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,24}$/

/** كشف نوع المعرّف تلقائيًا أثناء الكتابة */
export function detectIdentifierType(raw: string): IdentifierType {
  const value = raw.trim()
  if (!value) return 'empty'
  if (EMAIL_REGEX.test(value)) return 'email'
  if (PHONE_REGEX.test(value)) return 'phone'
  if (USERNAME_REGEX.test(value)) return 'username'
  return 'invalid'
}

/** هل المعرّف صالح بصيغة من الصيغ الثلاثة؟ */
export function isValidIdentifier(raw: string): boolean {
  const type = detectIdentifierType(raw)
  return type === 'email' || type === 'phone' || type === 'username'
}

/** مفتاح الترجمة الخاص بحالة الـ Badge */
export function identifierBadgeKey(type: IdentifierType): string {
  switch (type) {
    case 'email': return 'signin.badgeEmail'
    case 'phone': return 'signin.badgePhone'
    case 'username': return 'signin.badgeUsername'
    case 'invalid': return 'signin.badgeInvalid'
    default: return 'signin.badgeAuto'
  }
}

/** مفتاح الترجمة الخاص برسالة التحقق تحت الحقل */
export function identifierFeedbackKey(type: IdentifierType): string {
  switch (type) {
    case 'email': return 'signin.okEmail'
    case 'phone': return 'signin.okPhone'
    case 'username': return 'signin.okUser'
    case 'invalid': return 'signin.errIdInvalid'
    default: return 'signin.errIdEmpty'
  }
}

/** لون الـ Badge حسب النوع — كلاسات جاهزة بنفس هوية التصميم */
export function identifierBadgeClass(type: IdentifierType): string {
  switch (type) {
    case 'email':
    case 'phone':
      return 'bg-ok text-ok-f'
    case 'username':
      return 'bg-primary text-primary-f'
    case 'invalid':
      return 'bg-war text-war-f'
    default:
      return 'bg-surface-alt text-muted-f'
  }
}
