/**
 * system-status-bar/composables/useSystemStatus.ts — مؤشر صحة النظام (منطقة البداية).
 * بيشتق الحالة من دورة حياة الـ Mock API في التطبيق الحالي:
 * - online: كل حاجة تمام (الوضع الافتراضي لمحرك الـ Mock).
 * - degraded: عملية مزامنة بيانات شغالة حاليًا (isSyncing).
 * - offline: محجوز لفشل الاتصال — هيتوصل بـ health-check endpoint حقيقي بعد ترحيل الباك إند
 *   (PRD — Future Roadmap: API Integration).
 * كمان بيتتبع تاريخ آخر مزامنة لعرضه في الـ Tooltip وفي درج الإعدادات.
 */
import type { SsbHealthStatus } from '@/components/system-status-bar/types'
import { onBusEvent } from '@/utils/bus'
import { useAppData } from '@/composables/useAppData'

export function useSystemStatus() {
  const { isSyncing } = useAppData()

  /** تاريخ آخر مزامنة ناجحة (UTC ISO) — حالة مشتركة على مستوى التطبيق */
  const lastSyncAt = useState<string | null>('bshop:ssbLastSyncAt', () => null)

  // تحديث ختم آخر مزامنة مع حدثي المزامنة والتصفير
  onBusEvent('bshop:sync', () => {
    lastSyncAt.value = new Date().toISOString()
  })
  onBusEvent('bshop:db-reset', () => {
    lastSyncAt.value = new Date().toISOString()
  })

  /** حالة الصحة المشتقة — degraded أثناء المزامنة، و online في الحالة المستقرة */
  const status = computed<SsbHealthStatus>(() => (isSyncing.value ? 'degraded' : 'online'))

  /** مفتاح الترجمة لنص الحالة المجاور للنبضة */
  const statusLabelKey = computed<string>(() => {
    switch (status.value) {
      case 'degraded':
        return 'ssb.health.degraded'
      case 'offline':
        return 'ssb.health.offline'
      default:
        return 'ssb.health.online'
    }
  })

  return { status, statusLabelKey, lastSyncAt }
}
