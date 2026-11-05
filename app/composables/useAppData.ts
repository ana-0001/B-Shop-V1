/**
 * app/composables/useAppData.ts — إدارة دورة بيانات الـ Mock على مستوى التطبيق.
 * - dataVersion: عدّاد بيزيد مع كل مزامنة/تصفير — الصفحات بتسمع عليه وتعيد جلب بياناتها.
 * - isSyncing: فلاجل شاشة الـ Skeleton أثناء محاكاة جلب البيانات.
 * - refreshMockData / resetMockDb: العمليات العامة من شريط الأدوات.
 */
import { MOCK_LATENCY_MS } from '@/utils/constants'
import { emitBusEvent } from '@/utils/bus'
import { notifyInfo, notifySuccess } from '@/composables/useSonner'
import { useI18n } from '@/composables/useI18n'

export function useAppData() {
  const dataVersion = useState('bshop:dataVersion', () => 0)
  const isSyncing = useState('bshop:isSyncing', () => false)

  /** زيادة عدّاد النسخة عشان الصفحات تعيد الجلب */
  function bumpDataVersion(): void {
    dataVersion.value += 1
  }

  /** الاستماع لتحديث البيانات (يُستخدم داخل الصفحات) */
  function onDataRefresh(handler: () => void): () => void {
    return watch(dataVersion, () => handler())
  }

  /**
   * مزامنة الـ Mock API — بتعرض الـ Skeleton ثم تبث إشارة للصفحات.
   * نفس سلوك app.syncMockApi() في ملف التصميم المرجعي.
   */
  async function refreshMockData(): Promise<void> {
    isSyncing.value = true
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS + 200))
    isSyncing.value = false
    bumpDataVersion()
    emitBusEvent('bshop:sync')
    const { t } = useI18n()
    notifyInfo(t('notif.synced'))
  }

  /**
   * تصفير قاعدة البيانات الافتراضية — بيمسح كل حاجة ويرجّع الـ Seed.
   * بيمسح كذلك تبويبات الفواتير المفتوحة عشان الأرقام تفضل متسقة.
   */
  async function resetMockDb(): Promise<void> {
    isSyncing.value = true
    const { resetMockDatabase } = await import('@/services/mock/db')
    resetMockDatabase()
    const invoicesStore = useInvoicesStore()
    await invoicesStore.clearAll()
    await new Promise(resolve => setTimeout(resolve, 200))
    isSyncing.value = false
    bumpDataVersion()
    emitBusEvent('bshop:db-reset')
    const { t } = useI18n()
    notifySuccess(t('notif.resetDone'))
  }

  return { dataVersion, isSyncing, bumpDataVersion, onDataRefresh, refreshMockData, resetMockDb }
}
