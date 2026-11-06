/**
 * system-status-bar/composables/useNotificationCenter.ts — مركز إشعارات مساحة العمل.
 * نظام Mock كامل مشتق من حالة التطبيق الحالية (بدون backend):
 * - فواتير معلّقة (Held) من طبقة الـ API + فتح نافذة الاسترجاع عند النقر.
 * - تنبيهات المخزون المنخفض من صفوف الـ inventory مقارنة بعتبة النظام.
 * - أحداث المزامنة / التصفير من ناقل الأحداث (bshop:sync / bshop:db-reset).
 * الإشعارات جلسية (useState) — لما نيجي للـ backend الحقيقي هتبقى مكانها
 * endpoint إشعارات فعلية بنفس الشكل (راجع docs/06-backend-migration.md).
 */
import type { SsbNotification } from '@/components/system-status-bar/types'
import { onBusEvent } from '@/utils/bus'
import { nowUtcIso } from '@/utils/dates'
import { invoicesApi, inventoryApi } from '@/services/api/endpoints'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { useInvoicesStore } from '@/stores/invoices'

let notificationSeq = 0

/** بناء إشعار جديد بختم زمني حالي */
function buildNotification(
  kind: SsbNotification['kind'],
  titleKey: string,
  bodyKey: string,
  params?: Record<string, string | number>,
  to?: string,
): SsbNotification {
  notificationSeq += 1
  return {
    id: `ssb-notif-${notificationSeq}`,
    kind,
    titleKey,
    bodyKey,
    params,
    createdAt: nowUtcIso(),
    read: false,
    to,
  }
}

export function useNotificationCenter() {
  const notifications = useState<SsbNotification[]>('bshop:ssbNotifications', () => [])
  const metaState = useSystemMeta()
  const invoicesStore = useInvoicesStore()

  /** عدد الإشعارات غير المقروءة — شارة زر الجرس */
  const unreadCount = computed<number>(() => notifications.value.filter(item => !item.read).length)

  /** إضافة إشعار في مقدمة القائمة مع سقف أقصى (أحدث 30 إشعار) */
  function push(notification: SsbNotification): void {
    notifications.value = [notification, ...notifications.value].slice(0, 30)
  }

  /**
   * توليد الإشعارات المشتقة من بيانات النظام (المعلّق + المخزون المنخفض).
   * بتستبدل إشعارات النوعين 'held' و 'stock' القديمة بقيم محدثة بدل التراكم.
   */
  async function refreshDerived(): Promise<void> {
    try {
      // فواتير معلّقة من طبقة الـ API
      const held = await invoicesApi.listHeld()
      const heldNotifications = held.map(invoice =>
        buildNotification(
          'held',
          'ssb.notif.kind.held',
          'ssb.notif.body.held',
          { id: invoice.id, count: invoice.items.length },
          '/invoices',
        ),
      )

      // تنبيهات المخزون المنخفض من صفوف الـ inventory (كل الفروع)
      const stockNotifications: SsbNotification[] = []
      if (metaState.meta.value) {
        const rows = await inventoryApi.list(invoicesStore.tabs)
        const threshold = metaState.meta.value.lowStockThreshold
        for (const row of rows) {
          if (row.stock <= threshold) {
            stockNotifications.push(
              buildNotification(
                'stock',
                'ssb.notif.kind.stock',
                'ssb.notif.body.stock',
                { name: row.name, nameAr: row.nameAr, qty: row.stock, threshold },
                '/inventory',
              ),
            )
          }
        }
      }

      // استبدال إشعارات held/stock القديمة والإبقاء على أحداث الجلسة (sync/system)
      const sessionEvents = notifications.value.filter(
        item => item.kind === 'sync' || item.kind === 'system',
      )
      notifications.value = [...sessionEvents, ...heldNotifications, ...stockNotifications].slice(0, 30)
    } catch {
      // فشل اشتقاق الإشعارات (قبل تحميل البيانات مثلًا) — نتجاهله بهدوء
    }
  }

  /** تحميل أولي عند إدخال الشريط */
  function init(): void {
    refreshDerived()
  }

  // أحداث الجلسة — مزامنة وتصفير
  onBusEvent('bshop:sync', () => {
    push(buildNotification('sync', 'ssb.notif.kind.sync', 'ssb.notif.body.sync'))
    refreshDerived()
  })
  onBusEvent('bshop:db-reset', () => {
    push(buildNotification('system', 'ssb.notif.kind.reset', 'ssb.notif.body.reset'))
    refreshDerived()
  })

  /** تعليم إشعار واحد كمقروء */
  function markAsRead(id: string): void {
    const target = notifications.value.find(item => item.id === id)
    if (target) target.read = true
  }

  /** تعليم الكل كمقروء */
  function markAllAsRead(): void {
    notifications.value = notifications.value.map(item => ({ ...item, read: true }))
  }

  /** حذف إشعار واحد */
  function dismiss(id: string): void {
    notifications.value = notifications.value.filter(item => item.id !== id)
  }

  /** تفريغ كل الإشعارات */
  function clearAll(): void {
    notifications.value = []
  }

  return {
    notifications,
    unreadCount,
    init,
    refreshDerived,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll,
  }
}
