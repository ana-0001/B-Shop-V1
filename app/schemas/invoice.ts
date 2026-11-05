/**
 * app/schemas/invoice.ts — مخططات Zod للتحقق من الفواتير قبل التعليق أو الترحيل.
 * بتضمن إن الفاتورة اللي بتتنقل للباك إند (حاليًا Mock) دايمًا سليمة الشكل.
 */
import { z } from 'zod'

export const invoiceItemSchema = z.object({
  id: z.string().min(1),
  barcode: z.string().min(1),
  name: z.string().min(1),
  nameAr: z.string(),
  qty: z.number().int().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
})

export const invoiceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['SALE', 'PURCHASE', 'RETURN']),
  status: z.enum(['OPEN', 'POSTED', 'HELD']),
  branchId: z.string().min(1),
  customerName: z.string().trim().min(1),
  customerNameAr: z.string(),
  items: z.array(invoiceItemSchema).min(1),
  discount: z.number().min(0),
  taxRate: z.number().min(0).max(100),
  notes: z.array(z.string()),
})

export type InvoiceInput = z.infer<typeof invoiceSchema>

/** تحقق سريع قبل Hold/Post — بيرجع true لو الفاتورة جاهزة للإرسال */
export function validateInvoiceDraft(invoice: unknown): boolean {
  return invoiceSchema.safeParse(invoice).success
}
