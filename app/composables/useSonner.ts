/**
 * app/composables/useSonner.ts — غلاف موحد لإشعارات Vue Sonner.
 * كل الإشعارات في المشروع بتخرج من هنا عشان الشكل والألوان تبقى موحدة
 * (ok / err / war / inf) بنفس روح erp-toast في ملف التصميم.
 */
import { toast } from 'vue-sonner'

export function useSonner() {
  return { toast }
}

/** إشعار نجاح */
export function notifySuccess(message: string): void {
  toast.success(message)
}

/** إشعار خطأ */
export function notifyError(message: string): void {
  toast.error(message)
}

/** إشعار تحذير */
export function notifyWarning(message: string): void {
  toast.warning(message)
}

/** إشعار معلومات */
export function notifyInfo(message: string): void {
  toast.info(message)
}
