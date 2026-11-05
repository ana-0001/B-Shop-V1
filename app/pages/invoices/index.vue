<!-- pages/invoices/index.vue — مساحة عمل الفواتير:
     تبويبات متعددة + Split View + تعليق (Hold) + حفظ وطباعة (print-js) -->
<script setup lang="ts">
import printJS from 'print-js'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { useInvoicesStore  } from '@/stores/invoices'
import type {InvoiceDraft} from '@/stores/invoices';
import { validateInvoiceDraft } from '@/schemas/invoice'
import type { Invoice } from '@/types'
import InvoiceTabBar from '@/components/invoices/InvoiceTabBar.vue'
import InvoiceEditorPane from '@/components/invoices/InvoiceEditorPane.vue'
import InvoicePrintTemplate from '@/components/invoices/InvoicePrintTemplate.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

definePageMeta({ middleware: ['super-bomba'] })

const { t } = useI18n()
const { toast } = useSonner()
const route = useRoute()
const invoicesStore = useInvoicesStore()
const { load } = useSystemMeta()

const isReady = ref(false)

/** آخر فاتورة مرحّلة — بتُعرض في قالب الطباعة المخفي ثم تُطبع */
const lastPosted = ref<Invoice | null>(null)

const heldDialogOpen = useState('bshop:heldDialogOpen', () => false)

onMounted(async () => {
  await load()

  // ضمان وجود تبويب واحد على الأقل
  if (invoicesStore.tabs.length === 0) {
    await invoicesStore.createTab()
  }

  // معالجة معاملات الرابط: فاتورة جديدة / تركيز تبويب / فتح المعلّقين
  if (route.query.new) {
    await invoicesStore.createTab()
  }
  if (route.query.focus) {
    const id = String(route.query.focus)
    if (invoicesStore.findTab(id)) invoicesStore.selectTab(id)
  }
  if (route.query.held) {
    heldDialogOpen.value = true
  }

  isReady.value = true
})

/** تعليق الفاتورة الحالية */
async function handleHold(draft: InvoiceDraft): Promise<void> {
  if (draft.items.length === 0) {
    toast.warning(t('notif.holdEmpty'))
    return
  }
  const ok = await invoicesStore.holdTab(draft.id)
  if (ok) toast.warning(t('notif.holdOk', { id: draft.id }))
}

/** ترحيل الفاتورة ثم طباعتها عبر print-js */
async function handleSave(draft: InvoiceDraft): Promise<void> {
  if (draft.items.length === 0) {
    toast.error(t('notif.saveEmpty'))
    return
  }
  if (!validateInvoiceDraft(draft)) {
    toast.error(t('notif.validationErrors'))
    return
  }

  // نسخة الطباعة قبل إزالة التبويب من مساحة العمل
  lastPosted.value = JSON.parse(JSON.stringify(draft)) as Invoice

  const ok = await invoicesStore.postTab(draft.id)
  if (!ok) return
  toast.success(t('notif.savePosted'))

  await nextTick()
  printJS({
    printable: 'bshop-invoice-print',
    type: 'html',
    targetStyles: ['*'],
    documentTitle: draft.id,
  })
}

function handleClose(draft: InvoiceDraft): void {
  invoicesStore.closeTab(draft.id)
}
</script>

<template>
  <div class="flex flex-col gap-sm min-h-full">
    <InvoiceTabBar />

    <div
      v-if="isReady && invoicesStore.activeTab"
      :class="invoicesStore.splitView ? 'grid grid-cols-1 lg:grid-cols-2 gap-sm' : 'grid grid-cols-1 gap-sm'"
    >
      <InvoiceEditorPane
        :key="invoicesStore.activeTab.id"
        :draft="invoicesStore.activeTab"
        @hold="handleHold(invoicesStore.activeTab!)"
        @save="handleSave(invoicesStore.activeTab!)"
        @close="handleClose(invoicesStore.activeTab!)"
      />

      <InvoiceEditorPane
        v-if="invoicesStore.splitView && invoicesStore.secondaryTab"
        :key="invoicesStore.secondaryTab.id"
        :draft="invoicesStore.secondaryTab"
        secondary
        @hold="handleHold(invoicesStore.secondaryTab!)"
        @save="handleSave(invoicesStore.secondaryTab!)"
        @close="handleClose(invoicesStore.secondaryTab!)"
      />
    </div>

    <!-- هيكل تحميل لحظة تجهيز مساحة العمل -->
    <div v-else class="erp-card space-y-sm">
      <Skeleton class="h-5 w-48" />
      <Skeleton class="h-32 w-full" />
      <Skeleton class="h-10 w-full" />
    </div>

    <!-- قالب الطباعة المخفي -->
    <InvoicePrintTemplate v-if="lastPosted" :invoice="lastPosted" />
  </div>
</template>
