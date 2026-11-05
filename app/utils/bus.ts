/**
 * app/utils/bus.ts — ناقل أحداث بسيط على مستوى النافذة (Window Event Bus).
 * بيُستخدم عشان أزرار الـ toolbar العامة (مزامنة الـ API / تصفير قاعدة البيانات)
 * تبعت إشارة للصفحات المفتوحة إنها تعيد تحميل بياناتها.
 */
export type BusEvent = 'bshop:sync' | 'bshop:db-reset'

/** إرسال حدث لكل الصفحات المستمعة */
export function emitBusEvent(event: BusEvent): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event))
  }
}

/** الاستماع لحدث مع إرجاع دالة إلغاء الاستماع (تنظم دورة الحياة في المكونات) */
export function onBusEvent(event: BusEvent, handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(event, handler)
  return () => window.removeEventListener(event, handler)
}
