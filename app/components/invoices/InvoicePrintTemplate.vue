<!-- components/invoices/InvoicePrintTemplate.vue — قالب طباعة A4 (يُستخدم مع print-js).
     العنصر بره الشاشة (مش hidden) عشان print-js يقدر يقرأ الستايلات المحسوبة. -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { computeInvoiceAmounts } from '@/utils/invoice'
import { formatCurrency, formatNumber } from '@/utils/format'
import { formatDate } from '@/utils/dates'
import { invoiceCustomerName, localizedEntityName } from '@/types'
import type { Invoice } from '@/types'

const props = defineProps<{
  invoice: Invoice
}>()

const { t, locale } = useI18n()
const { meta } = useSystemMeta()

const amounts = computed(() => computeInvoiceAmounts(props.invoice))

const branchName = computed(() => {
  const branch = meta.value?.branches.find(entry => entry.id === props.invoice.branchId)
  return branch ? localizedEntityName(branch, locale.value) : props.invoice.branchId
})
</script>

<template>
  <div id="bshop-invoice-print" class="print-anchor" aria-hidden="true">
    <main class="print-invoice">
      <header class="print-header">
        <div>
          <div class="print-brand">B-SHOP ERP</div>
          <div>{{ branchName }}</div>
        </div>
        <div>
          <h1>{{ t(`enum.type.${invoice.type}`) }}</h1>
          <div>#{{ invoice.id }}</div>
        </div>
      </header>

      <section class="print-details">
        <div><strong>{{ t('tbl.customer') }}:</strong> {{ invoiceCustomerName(invoice, locale) }}</div>
        <div><strong>{{ t('nav.opDate') }}</strong> {{ formatDate(invoice.postedAt ?? invoice.updatedAt, locale) }}</div>
      </section>

      <table class="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{{ t('inv.barcode') }}</th>
            <th>{{ t('inv.itemName') }}</th>
            <th>{{ t('inv.qty') }}</th>
            <th>{{ t('inv.unitPrice') }}</th>
            <th>{{ t('inv.lineTotal') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoice.items" :key="item.id">
            <td>{{ formatNumber(index + 1, locale) }}</td>
            <td>{{ item.barcode }}</td>
            <td class="print-item-name"><strong>{{ locale === 'ar' && item.nameAr ? item.nameAr : item.name }}</strong></td>
            <td>{{ formatNumber(item.qty, locale) }}</td>
            <td>{{ formatCurrency(item.unitPrice, locale) }}</td>
            <td>{{ formatCurrency(item.total, locale) }}</td>
          </tr>
        </tbody>
      </table>

      <section class="print-summary">
        <div><span>{{ t('inv.subtotal') }}</span><strong>{{ formatCurrency(amounts.gross, locale) }}</strong></div>
        <div><span>{{ t('inv.discount') }}</span><strong>- {{ formatCurrency(invoice.discount, locale) }}</strong></div>
        <div><span>{{ t('inv.tax') }}</span><strong>+ {{ formatCurrency(amounts.tax, locale) }}</strong></div>
        <div class="print-net"><span>{{ t('inv.netTotal') }}</span><strong>{{ formatCurrency(amounts.net, locale) }}</strong></div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* العنصر بره مجال الرؤية لكنه موجود في الـ DOM لطباعة print-js */
.print-anchor {
  position: fixed;
  inset-inline-start: -125rem;
  top: 0;
  inline-size: 56.25rem;
  background: white;
}

.print-invoice {
  padding: 2rem;
  color: hsl(215 35% 15%);
  font-family: 'Cairo Variable', 'Cairo', 'Inter Variable', 'Inter', sans-serif;
}

.print-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding-block-end: 1rem;
  border-block-end: 0.1875rem solid hsl(215 85% 48%);
}

.print-brand {
  color: hsl(215 85% 48%);
  font-size: 1.5rem;
  font-weight: 800;
}

.print-header h1 {
  font-size: 1.125rem;
  font-weight: 800;
}

.print-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 1.5rem;
  padding: 1rem 0;
  font-size: 0.9rem;
}

.print-table {
  inline-size: 100%;
  border-collapse: collapse;
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
}

.print-table th,
.print-table td {
  border: 0.0625rem solid hsl(214 22% 75%);
  padding: 0.65rem 0.5rem;
  text-align: center;
}

.print-table th {
  color: hsl(215 65% 28%);
  background: hsl(210 40% 96%);
}

.print-table td.print-item-name {
  text-align: start;
}

.print-summary {
  inline-size: min(100%, 22.5rem);
  margin: 1rem 0 0 auto;
  font-size: 0.9rem;
}

.print-summary div {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0.6rem;
  border-block-end: 0.0625rem solid hsl(214 22% 83%);
}

.print-summary .print-net {
  color: hsl(152 72% 28%);
  background: hsl(150 50% 96%);
  font-size: 1.1rem;
  font-weight: 800;
  border: 0.125rem solid hsl(152 60% 65%);
}
</style>
