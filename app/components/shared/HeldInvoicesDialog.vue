<!-- shared/HeldInvoicesDialog.vue — نافذة الفواتير المعلّقة (استرجاع / حذف) -->
<script setup lang="ts">
import { DialogRoot, DialogClose } from 'reka-ui'
import { Archive as IconArchive, RotateCcw as IconRotateCcw, Trash2 as IconTrash2, X as IconX } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useInvoicesStore } from '@/stores/invoices'
import { invoicesApi } from '@/services/api/endpoints'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency } from '@/utils/format'
import { formatDateTime } from '@/utils/dates'
import { invoiceCustomerName } from '@/types'
import type { Invoice } from '@/types'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const { t, locale } = useI18n()
const { toast } = useSonner()
const invoicesStore = useInvoicesStore()
const router = useRouter()

/** حالة النافذة مشتركة على مستوى التطبيق (بتفتح من شريط الأدوات Alt+H) */
const open = useState('bshop:heldDialogOpen', () => false)

const heldInvoices = ref<Invoice[]>([])
const isLoading = ref(false)

async function loadHeld(): Promise<void> {
  isLoading.value = true
  try {
    heldInvoices.value = await invoicesApi.listHeld()
  } finally {
    isLoading.value = false
  }
}

watch(open, (isOpen) => {
  if (isOpen) loadHeld()
})

/** استرجاع فاتورة لمساحة العمل والانتقال لشاشة الفواتير */
async function restoreInvoice(invoice: Invoice): Promise<void> {
  const ok = await invoicesStore.restoreHeld(invoice.id)
  if (ok) {
    toast.success(t('notif.restoreOk', { id: invoice.id }))
    open.value = false
    router.push('/invoices')
  }
}

/** حذف فاتورة معلّقة نهائيًا */
async function deleteInvoice(invoice: Invoice): Promise<void> {
  await invoicesApi.deleteHeld(invoice.id)
  await loadHeld()
}
</script>

<template>
  <DialogRoot :open="open" @update:open="open = $event">
    <DialogContent class="max-w-[36rem]" aria-describedby="">
      <DialogHeader>
        <div class="flex items-center gap-xs">
          <IconArchive class="w-5 h-5 text-war" />
          <DialogTitle>{{ t('util.heldInvoices') }}</DialogTitle>
          <Badge v-if="heldInvoices.length" variant="war">{{ heldInvoices.length }}</Badge>
        </div>
        <DialogClose class="erp-btn text-xs py-xs px-sm" aria-label="Close dialog">
          <IconX class="w-3.5 h-3.5" />
          Esc
        </DialogClose>
      </DialogHeader>

      <div class="max-h-56 overflow-y-auto space-y-xs">
        <EmptyState v-if="!isLoading && heldInvoices.length === 0" :message="t('held.empty')" />

        <div
          v-for="invoice in heldInvoices"
          :key="invoice.id"
          class="p-sm rounded border border-border bg-surface-alt flex flex-wrap items-center justify-between gap-sm text-xs"
        >
          <div>
            <div class="font-extrabold text-bg-f">
              {{ invoice.id }} — <span class="text-primary">{{ invoiceCustomerName(invoice, locale) }}</span>
            </div>
            <div class="text-muted-f mt-0.5 flex items-center gap-xs flex-wrap">
              <span>{{ t(`enum.type.${invoice.type}`) }}</span>
              <span>·</span>
              <span>{{ t('held.itemsCount', { count: invoice.items.length }) }}</span>
              <span>·</span>
              <strong class="font-mono text-ok">{{ formatCurrency(computeInvoiceAmounts(invoice).net, locale) }}</strong>
              <span>·</span>
              <span>{{ t('held.heldAt', { time: formatDateTime(invoice.heldAt ?? invoice.updatedAt, locale) }) }}</span>
            </div>
          </div>
          <div class="flex items-center gap-xs">
            <Button variant="primary" size="sm" @click="restoreInvoice(invoice)">
              <IconRotateCcw class="w-3.5 h-3.5" />
              <span>{{ t('common.restore') }}</span>
            </Button>
            <Button variant="danger" size="sm" aria-label="Delete held invoice" @click="deleteInvoice(invoice)">
              <IconTrash2 class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="primary" size="sm">{{ t('common.close') }}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
</template>
