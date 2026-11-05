<!-- components/invoices/InvoiceTotalsBar.vue — شريط الإجماليات (خصم + ضريبة + صافي) وأزرار التعليق/الترحيل -->
<script setup lang="ts">
import { Pause as IconPause, Save as IconSave, X as IconX } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency } from '@/utils/format'
import type { InvoiceDraft } from '@/stores/invoices'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  draft: InvoiceDraft
}>()

const emit = defineEmits<{
  hold: []
  save: []
  close: []
}>()

const { t, locale } = useI18n()
const invoicesStore = useInvoicesStore()

const amounts = computed(() => computeInvoiceAmounts(props.draft))
</script>

<template>
  <div class="bg-surface-alt p-sm rounded border border-border grid grid-cols-1 lg:grid-cols-12 gap-sm items-center">
    <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-sm">
      <div>
        <label class="block font-bold text-bg-f text-xs mb-xs">{{ t('inv.subtotal') }}:</label>
        <Input :model-value="formatCurrency(amounts.gross, locale)" type="text" readonly class="!h-8 text-center font-bold font-mono bg-surface-alt !text-xs" aria-label="Subtotal" />
      </div>
      <div>
        <label class="block font-bold text-bg-f text-xs mb-xs">{{ t('inv.discount') }}:</label>
        <Input
          :model-value="draft.discount"
          type="number"
          min="0"
          class="!h-8 text-center font-bold font-mono text-err"
          aria-label="Discount amount"
          @update:model-value="invoicesStore.patchTab(draft.id, { discount: Math.max(0, Number($event) || 0) })"
        />
      </div>
      <div>
        <label class="block font-bold text-bg-f text-xs mb-xs">{{ t('inv.tax') }}:</label>
        <Input
          :model-value="draft.taxRate"
          type="number"
          min="0"
          max="100"
          class="!h-8 text-center font-bold font-mono text-war"
          aria-label="VAT rate"
          @update:model-value="invoicesStore.patchTab(draft.id, { taxRate: Math.min(100, Math.max(0, Number($event) || 0)) })"
        />
      </div>
      <div>
        <label class="block font-bold text-bg-f text-xs mb-xs">{{ t('inv.netTotal') }}:</label>
        <Input :model-value="formatCurrency(amounts.net, locale)" type="text" readonly class="!h-8 text-center font-bold font-mono text-ok !text-xs" aria-label="Net total" />
      </div>
    </div>

    <div class="lg:col-span-4 flex items-end gap-xs justify-end">
      <div class="flex-1">
        <Button variant="warning" size="md" class="h-8 w-full py-sm text-xs font-bold" @click="emit('hold')">
          <IconPause class="w-3.5 h-3.5" />
          {{ t('inv.holdBtn') }}
        </Button>
      </div>
      <div class="flex-1">
        <Button variant="success" size="md" class="h-8 w-full py-sm text-xs font-bold shadow-sm" @click="emit('save')">
          <IconSave class="w-3.5 h-3.5" />
          {{ t('inv.savePrintBtn') }}
        </Button>
      </div>
      <div>
        <Button variant="danger" size="md" class="h-8 py-sm px-md text-xs font-bold" aria-label="Close tab" @click="emit('close')">
          <IconX class="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  </div>
</template>
