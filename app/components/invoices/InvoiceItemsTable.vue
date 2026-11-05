<!-- components/invoices/InvoiceItemsTable.vue — جدول بنود الفاتورة (كمية قابلة للتعديل + حذف) -->
<script setup lang="ts">
import { Trash2 as IconTrash2 } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { InvoiceDraft } from '@/stores/invoices'
import Table from '@/components/ui/Table.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableHeaderCell from '@/components/ui/TableHeaderCell.vue'
import TableCell from '@/components/ui/TableCell.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const props = defineProps<{
  draft: InvoiceDraft
}>()

const { t, locale } = useI18n()
const invoicesStore = useInvoicesStore()

function onQtyChange(itemId: string, value: string): void {
  invoicesStore.updateItemQty(props.draft.id, itemId, Number(value))
}
</script>

<template>
  <div class="bg-surface rounded border border-border overflow-auto min-h-[12.5em] max-h-[16.875em]">
    <Table class="!text-xs border-collapse">
      <TableHead class="sticky top-0 z-above">
        <tr>
          <TableHeaderCell class="!text-center !w-8 border-b border-border">#</TableHeaderCell>
          <TableHeaderCell class="!text-center !w-24 border-b border-border">{{ t('inv.barcode') }}</TableHeaderCell>
          <TableHeaderCell class="border-b border-border">{{ t('inv.itemName') }}</TableHeaderCell>
          <TableHeaderCell class="!text-center !w-16 border-b border-border">{{ t('inv.qty') }}</TableHeaderCell>
          <TableHeaderCell class="!text-center !w-24 border-b border-border">{{ t('inv.unitPrice') }}</TableHeaderCell>
          <TableHeaderCell class="!text-center !w-28 border-b border-border">{{ t('inv.lineTotal') }}</TableHeaderCell>
          <TableHeaderCell class="!text-center !w-10 border-b border-border" aria-label="Actions" />
        </tr>
      </TableHead>
      <TableBody>
        <tr v-if="draft.items.length === 0">
          <TableCell colspan="7" class="p-md text-center text-muted-f font-bold">
            <EmptyState :message="t('inv.emptyItems')" />
          </TableCell>
        </tr>
        <tr v-for="(item, index) in draft.items" :key="item.id" class="hover:bg-hover font-semibold">
          <TableCell class="p-xs !text-center text-muted-f font-mono border-b border-border">{{ formatNumber(index + 1, locale) }}</TableCell>
          <TableCell class="p-xs !text-center font-mono border-b border-border">{{ item.barcode }}</TableCell>
          <TableCell class="p-xs border-b border-border">
            <div class="font-bold text-primary">{{ locale === 'ar' && item.nameAr ? item.nameAr : item.name }}</div>
            <div v-if="item.notes" class="text-xs text-muted-f font-normal">{{ item.notes }}</div>
          </TableCell>
          <TableCell class="p-xs !text-center border-b border-border">
            <input
              type="number"
              min="1"
              :value="item.qty"
              class="w-14 text-center border border-border rounded font-bold font-mono bg-surface"
              aria-label="Item quantity"
              @change="onQtyChange(item.id, ($event.target as HTMLInputElement).value)"
            >
          </TableCell>
          <TableCell class="p-xs !text-end font-bold font-mono text-ok border-b border-border">{{ formatCurrency(item.unitPrice, locale) }}</TableCell>
          <TableCell class="p-xs !text-end font-bold font-mono text-primary border-b border-border">{{ formatCurrency(item.total, locale) }}</TableCell>
          <TableCell class="p-xs !text-center border-b border-border">
            <button type="button" class="text-err hover:opacity-80 px-xs" aria-label="Remove item" @click="invoicesStore.removeItem(draft.id, item.id)">
              <IconTrash2 class="w-3.5 h-3.5" />
            </button>
          </TableCell>
        </tr>
      </TableBody>
    </Table>
  </div>
</template>
