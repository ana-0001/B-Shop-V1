<!-- components/invoices/InvoiceEditorPane.vue — محرر فاتورة كامل (رأس + أصناف + عميل + بنود + معاينة + إجماليات) -->
<script setup lang="ts">
import { ListChecks as IconListChecks, Warehouse as IconWarehouse } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { localizedEntityName } from '@/types'
import type { InvoiceType, PriceTier, PriceTier as TierType  } from '@/types'
import type { InvoiceDraft } from '@/stores/invoices'
import Badge from '@/components/ui/Badge.vue'
import Select from '@/components/ui/Select.vue'
import ProductEntryCard from '@/components/invoices/ProductEntryCard.vue'
import CustomerCard from '@/components/invoices/CustomerCard.vue'
import InvoiceItemsTable from '@/components/invoices/InvoiceItemsTable.vue'
import InvoiceSidePanel from '@/components/invoices/InvoiceSidePanel.vue'
import InvoiceTotalsBar from '@/components/invoices/InvoiceTotalsBar.vue'

const props = withDefaults(
  defineProps<{
    draft: InvoiceDraft
    secondary?: boolean
  }>(),
  { secondary: false },
)

const emit = defineEmits<{
  hold: []
  save: []
  close: []
}>()

const { t, locale } = useI18n()
const invoicesStore = useInvoicesStore()
const { meta } = useSystemMeta()

const INVOICE_TYPES: InvoiceType[] = ['SALE', 'PURCHASE', 'RETURN']

const branchOptions = computed(() =>
  (meta.value?.branches ?? []).map(branch => ({
    value: branch.id,
    label: localizedEntityName(branch, locale.value),
  })),
)

function setType(type: InvoiceType): void {
  invoicesStore.patchTab(props.draft.id, { type })
}

function setTier(tier: PriceTier): void {
  invoicesStore.setPriceTier(props.draft.id, tier)
}

function handleAddItem(item: { barcode: string; name: string; nameAr: string; qty: number; unitPrice: number; notes?: string }): void {
  invoicesStore.addItem(props.draft.id, item)
}
</script>

<template>
  <div class="bg-surface border border-border rounded p-sm flex flex-col gap-sm shadow-sm">
    <!-- رأس المحرر: النوع والفرع -->
    <div class="bg-surface-alt p-xs rounded border border-border flex flex-wrap items-center justify-between gap-sm">
      <div class="flex items-center gap-xs flex-wrap">
        <Badge :variant="props.secondary ? 'secondary' : 'primary'">{{ draft.id }}</Badge>
        <span class="font-bold text-bg-f text-xs ms-xs me-xs flex items-center gap-xs">
          <IconListChecks class="w-3.5 h-3.5 text-primary" />
          {{ t('inv.typeLabel') }}
        </span>
        <button
          v-for="type in INVOICE_TYPES"
          :key="type"
          type="button"
          class="px-sm py-xs rounded text-xs font-bold border transition-all"
          :class="draft.type === type
            ? 'bg-primary text-primary-f border-primary shadow-sm'
            : 'bg-surface text-bg-f border-border hover:bg-hover'"
          :aria-pressed="draft.type === type"
          @click="setType(type)"
        >
          {{ t(`enum.type.${type}`) }}
        </button>
      </div>

      <div class="flex items-center gap-xs">
        <label :for="`branchSelect-${draft.id}`" class="font-bold text-bg-f text-xs whitespace-nowrap flex items-center gap-xs">
          <IconWarehouse class="w-3.5 h-3.5 text-war" />
          {{ t('inv.branchLabel') }}
        </label>
        <Select
          :id="`branchSelect-${draft.id}`"
          :model-value="draft.branchId"
          :options="branchOptions"
          class="font-bold text-primary !w-56 !py-xs text-xs"
          @update:model-value="invoicesStore.patchTab(draft.id, { branchId: $event })"
        />
      </div>
    </div>

    <!-- الأصناف + العميل -->
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-sm">
      <div class="lg:col-span-7">
        <ProductEntryCard
          :draft="draft"
          @add="handleAddItem"
          @update:tier="setTier($event as TierType)"
        />
      </div>
      <div class="lg:col-span-3">
        <CustomerCard :draft="draft" />
      </div>
    </div>

    <!-- البنود + المعاينة -->
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-sm">
      <div class="lg:col-span-7">
        <InvoiceItemsTable :draft="draft" />
      </div>
      <div class="lg:col-span-3">
        <InvoiceSidePanel :draft="draft" />
      </div>
    </div>

    <!-- الإجماليات والعمليات -->
    <InvoiceTotalsBar :draft="draft" @hold="emit('hold')" @save="emit('save')" @close="emit('close')" />
  </div>
</template>
