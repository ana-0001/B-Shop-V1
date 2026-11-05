/**
 * app/utils/invoice.ts — حسابات الفواتير المالية (نفس منطق ملف التصميم).
 * الإجماليات: المجموع = مجموع بنود الفاتورة، الخصم مبلغ قطعي،
 * والضريبة نسبة مئوية (افتراضيًا 14%) بتتطبق على الصافي بعد الخصم.
 */
import type { Invoice, InvoiceItem } from '@/types'

export interface InvoiceAmounts {
  gross: number
  discounted: number
  tax: number
  net: number
}

/** حساب إجماليات أي فاتورة — المصدر الوحيد للحقيقة في كل الشاشات */
export function computeInvoiceAmounts(invoice: Pick<Invoice, 'items' | 'discount' | 'taxRate'>): InvoiceAmounts {
  const gross = invoice.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
  const discounted = Math.max(0, gross - (Number(invoice.discount) || 0))
  const tax = discounted * ((Number(invoice.taxRate) || 0) / 100)
  return { gross, discounted, tax, net: discounted + tax }
}

/** حساب إجمالي سطر صنف (الكمية × سعر الوحدة) بتقريب أمين */
export function computeLineTotal(qty: number, unitPrice: number): number {
  return Number(((Number(qty) || 0) * (Number(unitPrice) || 0)).toFixed(2))
}

/** إعادة حساب total لكل بنود الفاتورة بعد أي تعديل كمية أو سعر */
export function recalcInvoiceItems(items: InvoiceItem[]): InvoiceItem[] {
  return items.map(item => ({ ...item, total: computeLineTotal(item.qty, item.unitPrice) }))
}

/** توليد معرّف فريد لبنود الفاتورة */
export function generateItemId(): string {
  return `ITM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}
