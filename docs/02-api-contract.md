# 02 — عقد الـ API (الـ Endpoints والـ DTOs)

كل endpoint اتعمل له Mock في `services/mock/handlers.ts` وله نفس التوقيع في `services/api/endpoints.ts`. التبديل بين الوضعين بيتم عبر `NUXT_PUBLIC_API_MOCK`.

> **الاتفاق:** كل الـ timestamps UTC ISO strings، والعملة EGP، ونسبة الضريبة الافتراضية 14%.

## المصادقة

### `POST /auth/login` — تسجيل الدخول بالمعرّف الموحد

- **Request:** `{ identifier: string; password: string }`
- `identifier` بيقبل: اسم مستخدم / بريد / موبايل مصري (01xxxxxxxxx أو +20).
- **Response 200:** `AuthResponse`
```ts
interface AuthResponse {
  user: SessionUser
  accessToken: string      // في الـ Mock: 'mock-token-bomba'
  termsAccepted: boolean
  onboardingCompleted: boolean
}
interface SessionUser {
  id: string; username: string; displayName: string
  level: number; isSystem: boolean; tenantId: string
  avatarLetter: string; phones: string[]; emails: string[]
}
```
- **خطأ:** `401 { code: 'INVALID_CREDENTIALS', message, messageAr }` — لمعرّف غير موجود أو كلمة مرور غلط.
- الـ Mock بيدور في `db.users` بمطابقة username أو أي email أو أي phone (بتطبيع +20) — وكلمة المرور بمقارنة نصية مع `SEED_CREDENTIALS` (bcrypt في الباك إند).

### `POST /auth/logout`

- **Response:** `204` — الـ Mock بينام 120ms ويرجّع.

## الفواتير

### `POST /invoices/next-id` — توليد الرقم التالي

- **Response:** `INV-<n>` (string) — عدّاد متسلسل متحفظ في `meta.nextInvoiceNumber`.

### `POST /invoices/hold` — تعليق فاتورة مفتوحة

- **Request:** `Invoice` كامل (status OPEN)
- **Response:** `Invoice` بحالة `HELD` + `heldAt` — بتتخزن في Mock DB.

### `POST /invoices/post` — ترحيل فاتورة

- **Request:** `Invoice` (بعد التحقق بـ `schemas/invoice.ts`)
- **Response:** `Invoice` بحالة `POSTED` + `postedAt` — بتتخزن في Mock DB.

### `GET /invoices/held` — قائمة المعلّقين

- **Response:** `Invoice[]` (status HELD فقط).

### `POST /invoices/held/:id/restore` — استرجاع فاتورة معلّقة

- **Response:** `Invoice | null` — بتتشال من المعلّقين (المسؤولية على المتجر يضيفها كمسودة).

### `DELETE /invoices/held/:id` — حذف معلّقة نهائيًا

- **Response:** `boolean`.

## الشاشات المجمعة

> ملاحظة مهمة: الدوال دي في الـ Mock بتستقبل `openDrafts: Invoice[]` من الصفحة (المسودات المفتوحة في متجر الفواتير) — عشان كل الشاشات تحسب على **نفس** مجموعة الفواتير: مسودات مفتوحة + مرحّلة + معلّقة. في الباك إند الحقيقي الاستعلام هيتعمل من قاعدة البيانات بنفس المنطق.

### `GET /dashboard/summary?locale=`

- **Response:** `DashboardSummary`
```ts
{
  totalNet, invoiceCount, openCount, postedCount, heldCount,
  itemUnits, customerCount,
  weekSeries: [{ date, label, sales, purchases }],  // آخر 7 أيام من المرحّلة
  typeDistribution: { SALE, PURCHASE, RETURN },
  recentInvoices: Invoice[]                          // آخر 8
}
```

### `GET /accounts/totals`

- **Response:** `{ salesTotal, purchaseTotal, returnTotal, heldCount, ledger: Invoice[] }`

### `GET /inventory?branchId=BR-MAIN|ALL`

- **Response:** `InventoryRow[]` = `{ barcode, name, nameAr, categoryId, manufacturerId, stock, unitsBilled, invoicesCount }`
- رصيد المخزون حتمي (hash) لكل صنف/فرع — تحت 10 يعتبر Low Stock.

### `GET /reports/summary`

- **Response:** `{ invoiceCount, totalNet, averageTicket, totalUnits, totalDiscounts, postedCount, heldCount, rows: [{ type, invoices, items, netTotal }] }`

### `GET /meta` — بيانات النظام

- **Response:** `{ currency: 'EGP', defaultTaxRate: 14, operationDate, branches, categories, manufacturers, products, lowStockThreshold: 10 }`

## غلاف الأخطاء الموحد

كل الأخطاء بتطلع من الطبقة على شكل:
```ts
class ApiRequestError {
  code: string        // INVALID_CREDENTIALS / NETWORK_ERROR / HTTP_500 ...
  message: string     // English
  messageAr: string   // العربية المصرية — الواجهة بتعرضها حسب اللغة
}
```
