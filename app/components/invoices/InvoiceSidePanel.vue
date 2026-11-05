<!-- components/invoices/InvoiceSidePanel.vue — اللوحة الجانبية: معاينة حرارية أو ملاحظات الفاتورة -->
<script setup lang="ts">
import { Receipt as IconReceipt, StickyNote as IconStickyNote, Plus as IconPlus, X as IconX, ChevronRight as IconChevronRight } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency } from '@/utils/format'
import { localizedEntityName } from '@/types'
import type { InvoiceDraft } from '@/stores/invoices'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  draft: InvoiceDraft
}>()

const { t, locale } = useI18n()
const invoicesStore = useInvoicesStore()
const { meta } = useSystemMeta()

const amounts = computed(() => computeInvoiceAmounts(props.draft))

const branchName = computed(() => {
  const branch = meta.value?.branches.find(entry => entry.id === props.draft.branchId)
  return branch ? localizedEntityName(branch, locale.value) : props.draft.branchId
})

const memoValue = ref('')

function addMemo(): void {
  invoicesStore.addNote(props.draft.id, memoValue.value)
  memoValue.value = ''
}
</script>

<template>
  <div class="bg-bg p-sm rounded border border-border flex flex-col justify-between gap-xs">
    <!-- تبويبات المعاينة / الملاحظات -->
    <div class="flex items-center gap-xs border-b border-border pb-xs mb-xs text-xs font-bold">
      <button
        type="button"
        class="px-sm py-xs rounded flex items-center gap-xs"
        :class="draft.sideTab !== 'notes' ? 'bg-accent text-accent-f shadow-sm' : 'bg-surface-alt text-muted-f'"
        @click="invoicesStore.patchTab(draft.id, { sideTab: 'preview' })"
      >
        <IconReceipt class="w-3.5 h-3.5" />
        {{ t('inv.previewTab') }}
      </button>
      <button
        type="button"
        class="px-sm py-xs rounded flex items-center gap-xs"
        :class="draft.sideTab === 'notes' ? 'bg-accent text-accent-f shadow-sm' : 'bg-surface-alt text-muted-f'"
        @click="invoicesStore.patchTab(draft.id, { sideTab: 'notes' })"
      >
        <IconStickyNote class="w-3.5 h-3.5" />
        {{ t('inv.notesTab') }} ({{ draft.notes.length }})
      </button>
    </div>

    <!-- المعاينة الحرارية -->
    <div v-if="draft.sideTab !== 'notes'" class="flex-1">
      <div class="invoice-preview-paper rounded p-sm text-xs overflow-y-auto max-h-[11.875em] font-mono leading-tight border border-border">
        <div class="text-center font-bold border-b border-dashed border-border pb-xs mb-xs">
          <div class="text-sm font-extrabold">B-SHOP ERP</div>
          <div class="text-xs text-muted-f">{{ branchName }}</div>
          <div>*** {{ t(`enum.type.${draft.type}`) }} ***</div>
        </div>

        <div class="border-b border-dashed border-border pb-xs mb-xs space-y-xs text-xs">
          <div>#{{ draft.id }} | {{ locale === 'ar' && draft.customerNameAr ? draft.customerNameAr : draft.customerName }}</div>
        </div>

        <div class="space-y-xs font-bold pt-xs">
          <div class="flex justify-between">
            <span>{{ t('inv.subtotal') }}:</span>
            <span>{{ formatCurrency(amounts.gross, locale) }}</span>
          </div>
          <div class="flex justify-between text-err">
            <span>{{ t('inv.discount') }}:</span>
            <span>-{{ formatCurrency(draft.discount, locale) }}</span>
          </div>
          <div class="flex justify-between text-war">
            <span>{{ t('inv.tax') }}:</span>
            <span>+{{ formatCurrency(amounts.tax, locale) }}</span>
          </div>
          <div class="flex justify-between text-ok text-xs border-t border-border pt-xs mt-xs">
            <span>{{ t('inv.netTotal') }}:</span>
            <span>{{ formatCurrency(amounts.net, locale) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ملاحظات الفاتورة -->
    <div v-else class="flex-1 flex flex-col justify-between space-y-sm">
      <div class="space-y-xs">
        <label class="block font-bold text-muted-f text-xs">{{ t('inv.addMemo') }}</label>
        <div class="flex gap-xs">
          <Input v-model="memoValue" type="text" :placeholder="t('inv.memoPlaceholder')" class="flex-1 text-xs" aria-label="Invoice memo" @keydown.enter="addMemo" />
          <Button variant="primary" size="sm" aria-label="Add Note" @click="addMemo">
            <IconPlus class="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div class="max-h-[8.75em] overflow-y-auto space-y-xs border border-border rounded p-xs bg-surface-alt">
        <div
          v-for="(note, index) in draft.notes"
          :key="`${note}-${index}`"
          class="bg-surface text-bg-f p-xs rounded border border-border text-xs flex justify-between items-center gap-xs"
        >
          <span class="flex items-center gap-xs">
            <IconChevronRight class="w-3 h-3 text-accent icon-directional" />
            {{ note }}
          </span>
          <button type="button" class="text-err" aria-label="Delete note" @click="invoicesStore.removeNote(draft.id, index)">
            <IconX class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
