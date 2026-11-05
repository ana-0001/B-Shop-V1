<!-- components/dashboard/RecentInvoicesTable.vue — جدول آخر الفواتير مع فلتر البحث العام -->
<script setup lang="ts">
import { ArrowRight as IconArrowRight, Check as IconCheck, PenLine as IconPenLine } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency, formatNumber  } from '@/utils/format'
import { invoiceCustomerName, localizedEntityName } from '@/types'
import type { Invoice, InvoiceStatus, InvoiceType } from '@/types'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { useInvoicesStore } from '@/stores/invoices'
import Table from '@/components/ui/Table.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHeaderCell from '@/components/ui/TableHeaderCell.vue'
import TableCell from '@/components/ui/TableCell.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const props = defineProps<{
  invoices: Invoice[]
}>()

const { t, locale } = useI18n()
const route = useRoute()
const { meta } = useSystemMeta()
const invoicesStore = useInvoicesStore()
const router = useRouter()

/** فلتر البحث العام (q من شريط الأدوات) على رقم الفاتورة/العميل/الأصناف */
const searchQuery = computed(() => ((route.query.q as string) ?? '').trim().toLowerCase())

const filteredInvoices = computed(() => {
  const query = searchQuery.value
  if (!query) return props.invoices
  return props.invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(query)
    || invoiceCustomerName(invoice, locale.value).toLowerCase().includes(query)
    || invoice.items.some(item => item.name.toLowerCase().includes(query) || item.barcode.includes(query)),
  )
})

function branchName(branchId: string): string {
  const branch = meta.value?.branches.find(entry => entry.id === branchId)
  return branch ? localizedEntityName(branch, locale.value) : branchId
}

function statusVariant(status: InvoiceStatus): 'primary' | 'ok' | 'war' {
  if (status === 'POSTED') return 'ok'
  if (status === 'HELD') return 'war'
  return 'primary'
}

function typeVariant(type: InvoiceType): 'primary' | 'accent' | 'secondary' {
  if (type === 'PURCHASE') return 'accent'
  if (type === 'RETURN') return 'secondary'
  return 'primary'
}

/** فتح المسودة المفتوحة في مساحة الفواتير */
function openInvoice(invoice: Invoice): void {
  if (invoice.status !== 'OPEN') return
  invoicesStore.selectTab(invoice.id)
  router.push(`/invoices?focus=${invoice.id}`)
}
</script>

<template>
  <article class="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
    <header class="flex items-center justify-between p-md border-b border-border gap-sm flex-wrap">
      <div>
        <h2 class="font-extrabold text-bg-f">{{ t('dash.recentTitle') }}</h2>
        <p class="text-xs text-muted-f mt-xs">{{ t('dash.recentSub') }}</p>
      </div>
      <NuxtLink to="/invoices" class="text-primary text-xs font-bold hover:underline flex items-center gap-xs">
        <span>{{ t('dash.openWorkspace') }}</span>
        <IconArrowRight class="w-3.5 h-3.5 icon-directional" />
      </NuxtLink>
    </header>

    <Table>
      <TableHead>
        <tr>
          <TableHeaderCell>{{ t('tbl.invoiceId') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.customer') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.type') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.branch') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.itemsCount') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.netAmount') }}</TableHeaderCell>
          <TableHeaderCell>{{ t('tbl.status') }}</TableHeaderCell>
        </tr>
      </TableHead>
      <TableBody>
        <TableRow v-if="filteredInvoices.length === 0">
          <TableCell class="text-center" colspan="7">
            <EmptyState :message="t('tbl.empty')" />
          </TableCell>
        </TableRow>
        <TableRow
          v-for="invoice in filteredInvoices.slice(0, 8)"
          :key="invoice.id"
          :clickable="invoice.status === 'OPEN'"
          @click="openInvoice(invoice)"
        >
          <TableCell class="font-mono font-semibold">{{ invoice.id }}</TableCell>
          <TableCell class="font-semibold">{{ invoiceCustomerName(invoice, locale) }}</TableCell>
          <TableCell>
            <Badge :variant="typeVariant(invoice.type)">{{ t(`enum.type.${invoice.type}`) }}</Badge>
          </TableCell>
          <TableCell class="text-xs">{{ branchName(invoice.branchId) }}</TableCell>
          <TableCell class="font-mono font-semibold">{{ formatNumber(invoice.items.length, locale) }}</TableCell>
          <TableCell class="font-mono font-semibold">{{ formatCurrency(computeInvoiceAmounts(invoice).net, locale) }}</TableCell>
          <TableCell>
            <Badge :variant="statusVariant(invoice.status)">
              <IconCheck v-if="invoice.status === 'POSTED'" class="w-3 h-3" />
              <IconPenLine v-else class="w-3 h-3" />
              {{ t(`enum.status.${invoice.status}`) }}
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </article>
</template>
