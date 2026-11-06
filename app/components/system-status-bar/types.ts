/**
 * system-status-bar/types.ts — أنواع وحدة شريط الحالة النظامي (SystemStatusBar).
 * بتوصف صحة النظام، وإشعارات مساحة العمل، وبنية بيانات الساعة —
 * متوافقة مع PRD (07-1-PRD-StatusBar.md) بنسخة Vue المكافئة.
 */

/* ============ صحة النظام (منطقة البداية) ============ */

/** حالة صحة النظام اللي بيرسمها نبضة الشريط */
export type SsbHealthStatus = 'online' | 'degraded' | 'offline'

/* ============ الإشعارات (Popover منطقة النهاية) ============ */

/** نوع الإشعار — بيحدد الأيقونة واللون وسلوك النقر */
export type SsbNotificationKind = 'held' | 'stock' | 'sync' | 'system'

/** إشعار واحد في مركز الإشعارات (بيانات Mock مشتقة من حالة التطبيق) */
export interface SsbNotification {
  /** معرّف فريد للإشعار */
  id: string
  /** نوع الإشعار */
  kind: SsbNotificationKind
  /** مفتاح الترجمة للعنوان */
  titleKey: string
  /** مفتاح الترجمة لجسم الرسالة */
  bodyKey: string
  /** معاملات الاستبدال داخل نص الرسالة */
  params?: Record<string, string | number>
  /** وقت إنشاء الإشعار (UTC ISO) */
  createdAt: string
  /** هل اتقري؟ (بيتعلم تلقائيًا عند فتح الـ Popover) */
  read: boolean
  /** مسار تنقل اختياري عند النقر على الإشعار */
  to?: string
}
