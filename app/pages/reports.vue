<!-- pages/reports.vue — التقارير التحليلية حسب نوع الفاتورة (بيع/شراء/مرتجع) -->
<script setup lang="ts">
import { RotateCcw as IconRotateCcw, FileText as IconFileText, Banknote as IconBanknote, Receipt as IconReceipt  } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAppData } from '@/composables/useAppData'
import { useInvoicesStore } from '@/stores/invoices'
import { reportsApi } from '@/services/api/endpoints'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { ReportSummary } from '@/types'
import PageHeader from '@/components/shared/PageHeader.vue'
import SyncSkeleton from '@/components/shared/SyncSkeleton.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import Table from '@/components/ui/Table.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHeaderCell from '@/components/ui/TableHeaderCell.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardTitle from '@/components/ui/CardTitle.vue'

definePageMeta({ middleware: ['super-bomba'] })

const { t, locale } = useI18n()
const { onDataRefresh } = useAppData()
const invoicesStore = useInvoicesStore()

const summary = ref<ReportSummary | null>(null)
const isLoading = ref(true)

async function fetchSummary(): Promise<void> {
  isLoading.value = true
  try {
    summary.value = await reportsApi.summary(invoicesStore.tabs)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSummary)
onDataRefresh(fetchSummary)

/** نسبة كل نوع من إجمالي الفواتير لأشرطة التوزيع */
function typeShare(invoiceCount: number): number {
  if (!summary.value || summary.value.invoiceCount === 0) return 0
  return Math.max(4, Math.round((invoiceCount / summary.value.invoiceCount) * 100))
}

function barClass(type: string): string {
  if (type === 'SALE') return 'bg-primary'
  if (type === 'PURCHASE') return 'bg-ok'
  return 'bg-war'
}
</script>

<template>
  <div>
    <SyncSkeleton v-if="isLoading && !summary" />

    <section v-else-if="summary" class="space-y-md" aria-labelledby="reportsTitle">
      <PageHeader
        :kicker="t('rep.kicker')"
        kicker-class="text-secondary"
        :title="t('rep.title')"
      >
        <template #actions>
          <Button size="md" @click="fetchSummary">
            <IconRotateCcw class="w-3.5 h-3.5 text-primary" />
            <span>{{ t('rep.refresh') }}</span>
          </Button>
        </template>
      </PageHeader>

      <!-- البطاقات الرئيسية -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-sm">
        <StatCard :title="t('dash.card2Title')" :value="formatNumber(summary.invoiceCount, locale)" :icon="IconFileText" icon-class="text-primary" />
        <StatCard :title="t('dash.card1Title')" :value="formatCurrency(summary.totalNet, locale)" :icon="IconBanknote" icon-class="text-ok" />
        <StatCard :title="t('rep.avgTicket')" :value="formatCurrency(summary.averageTicket, locale)" :icon="IconReceipt" icon-class="text-secondary" />
      </div>

      <!-- توزيع الأنواع + الملخص التشغيلي -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-sm">
        <Card>
          <CardTitle class="!mb-md">{{ t('rep.byType') }}</CardTitle>
          <div class="space-y-md">
            <div v-for="row in summary.rows" :key="row.type">
              <div class="flex justify-between text-xs font-bold mb-xs">
                <span>{{ t(`enum.type.${row.type}`) }}</span>
                <span class="font-mono">{{ formatNumber(row.invoices, locale) }}</span>
              </div>
              <div class="h-3 rounded-full bg-surface-alt overflow-hidden">
                <div :class="barClass(row.type)" class="h-full rounded-full transition-all" :style="{ inlineSize: `${typeShare(row.invoices)}%` }" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle class="!mb-md">{{ t('rep.opSummary') }}</CardTitle>
          <div class="space-y-sm text-sm">
            <div class="flex justify-between border-b border-border pb-sm">
              <span class="text-muted-f">{{ t('rep.totalUnits') }}</span>
              <strong class="font-mono">{{ formatNumber(summary.totalUnits, locale) }}</strong>
            </div>
            <div class="flex justify-between border-b border-border pb-sm">
              <span class="text-muted-f">{{ t('rep.totalDiscounts') }}</span>
              <strong class="font-mono text-err">{{ formatCurrency(summary.totalDiscounts, locale) }}</strong>
            </div>
            <div class="flex justify-between border-b border-border pb-sm">
              <span class="text-muted-f">{{ t('rep.postedInvoices') }}</span>
              <strong class="font-mono text-ok">{{ formatNumber(summary.postedCount, locale) }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-f">{{ t('rep.heldRow') }}</span>
              <strong class="font-mono text-war">{{ formatNumber(summary.heldCount, locale) }}</strong>
            </div>
          </div>
        </Card>
      </div>

      <!-- جدول الأنواع -->
      <Card class="!p-0 overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>{{ t('tbl.type') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('dash.card2Title') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.itemsCount') }}</TableHeaderCell>
              <TableHeaderCell>{{ t('tbl.netAmount') }}</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            <TableRow v-for="row in summary.rows" :key="row.type">
              <TableCell class="font-bold">{{ t(`enum.type.${row.type}`) }}</TableCell>
              <TableCell class="font-mono font-semibold">{{ formatNumber(row.invoices, locale) }}</TableCell>
              <TableCell class="font-mono font-semibold">{{ formatNumber(row.items, locale) }}</TableCell>
              <TableCell class="font-mono font-semibold text-ok">{{ formatCurrency(row.netTotal, locale) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </section>
  </div>
</template>
