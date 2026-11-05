<!-- pages/accounts.vue — الحسابات المالية: ملخص الإيرادات/المشتريات/المرتجعات + دفتر الفواتير -->
<script setup lang="ts">
import { Banknote as IconBanknote, ShoppingCart as IconShoppingCart, Repeat2 as IconRepeat2, Archive as IconArchive } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAppData } from '@/composables/useAppData'
import { useInvoicesStore } from '@/stores/invoices'
import { accountsApi } from '@/services/api/endpoints'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency } from '@/utils/format'
import { invoiceCustomerName } from '@/types'
import type { AccountTotals } from '@/types'
import PageHeader from '@/components/shared/PageHeader.vue'
import SyncSkeleton from '@/components/shared/SyncSkeleton.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import Table from '@/components/ui/Table.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHeaderCell from '@/components/ui/TableHeaderCell.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import Card from '@/components/ui/Card.vue'
import CardTitle from '@/components/ui/CardTitle.vue'

definePageMeta({ middleware: ['super-bomba'] })

const { t, locale } = useI18n()
const { onDataRefresh } = useAppData()
const invoicesStore = useInvoicesStore()

const totals = ref<AccountTotals | null>(null)
const isLoading = ref(true)

async function fetchTotals(): Promise<void> {
  isLoading.value = true
  try {
    totals.value = await accountsApi.totals(invoicesStore.tabs)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTotals)
onDataRefresh(fetchTotals)

function statusVariant(status: string): 'primary' | 'ok' | 'war' {
  if (status === 'POSTED') return 'ok'
  if (status === 'HELD') return 'war'
  return 'primary'
}
</script>

<template>
  <div>
    <SyncSkeleton v-if="isLoading && !totals" />

    <section v-else-if="totals" class="space-y-md" aria-labelledby="accountsTitle">
      <PageHeader
        :kicker="t('acc.kicker')"
        kicker-class="text-ok"
        :title="t('acc.title')"
        :subtitle="t('acc.subtitle')"
      />

      <!-- ملخص مالي -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-sm">
        <StatCard :title="t('acc.salesTotal')" :value="formatCurrency(totals.salesTotal, locale)" :icon="IconBanknote" icon-class="text-ok" />
        <StatCard :title="t('acc.purchaseTotal')" :value="formatCurrency(totals.purchaseTotal, locale)" :icon="IconShoppingCart" icon-class="text-primary" />
        <StatCard :title="t('acc.returnTotal')" :value="formatCurrency(totals.returnTotal, locale)" :icon="IconRepeat2" icon-class="text-war" />
        <StatCard :title="t('util.heldInvoices')" :value="totals.heldCount.toString()" :icon="IconArchive" icon-class="text-secondary" />
      </div>

      <!-- دفتر الفواتير المالي -->
      <Card class="!p-0 overflow-hidden">
        <div class="p-md border-b border-border">
          <CardTitle>{{ t('acc.ledgerTitle') }}</CardTitle>
        </div>

        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>{{ t('tbl.invoiceId') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.customer') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.type') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.subtotal') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.discount') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.tax') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.netAmount') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.status') }}</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            <TableRow v-if="totals.ledger.length === 0">
              <TableCell colspan="8">
                <EmptyState :message="t('tbl.empty')" />
              </TableCell>
            </TableRow>
            <TableRow v-for="invoice in totals.ledger" :key="invoice.id">
              <TableCell class="font-mono font-semibold">{{ invoice.id }}</TableCell>
              <TableCell class="font-semibold">{{ invoiceCustomerName(invoice, locale) }}</TableCell>
              <TableCell>{{ t(`enum.type.${invoice.type}`) }}</TableCell>
              <TableCell class="font-mono font-semibold">{{ formatCurrency(computeInvoiceAmounts(invoice).gross, locale) }}</TableCell>
              <TableCell class="font-mono font-semibold text-err">{{ formatCurrency(invoice.discount, locale) }}</TableCell>
              <TableCell class="font-mono font-semibold text-war">{{ formatCurrency(computeInvoiceAmounts(invoice).tax, locale) }}</TableCell>
              <TableCell class="font-mono font-semibold text-ok">{{ formatCurrency(computeInvoiceAmounts(invoice).net, locale) }}</TableCell>
              <TableCell>
                <Badge :variant="statusVariant(invoice.status)">{{ t(`enum.status.${invoice.status}`) }}</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </section>
  </div>
</template>
