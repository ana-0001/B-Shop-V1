# 03 — نموذج البيانات (Mock) وخطة التحويل لقاعدة بيانات

## الكيانات (زي القسم 8 من الخطة)

| الكيان | الحقول الأساسية | ملاحظات |
|---|---|---|
| **User** | id، username، level، isSystem، isActive، tenantId، phones[]، emails[]، attachments[] | bomba هو الوحيد في الـ Seed |
| **Phone / Email** | value، isPrimary، userId | الأساسي أولًا في العرض |
| **Attachment** | id، userId، kind='avatar'، letter='B'، isPrimary | أفاتار دائري افتراضي |
| **Company** | id، name، nameAr، tenantId | شركة بي شوب للتجارة |
| **Branch** | id، name، nameAr، companyId | فرعان: القاهرة والجيزة |
| **Category** | id، name، nameAr | 4 فئات عامة |
| **Manufacturer** | id، name، nameAr | 4 مصنّعين |
| **Product** | barcode، name، nameAr، categoryId، manufacturerId، prices{1,2,3}، imageUrl | باركود يبدأ 622 (GS1 مصر) |
| **Invoice** | id، type، status، branchId، customerName(+Ar)، phones، addresses، priceTier، items[]، discount، taxRate، notes[]، createdAt/updatedAt/postedAt/heldAt | UTC ISO |
| **InvoiceItem** | id، barcode، name، nameAr، qty، unitPrice، total، notes؟ | total = qty × unitPrice |

## الأنواع (Type / Status)

- `InvoiceType`: `SALE | PURCHASE | RETURN`
- `InvoiceStatus`: `OPEN | POSTED | HELD`
  - **OPEN**: مسودة في متجر الفواتير (مش في الـ Mock DB).
  - **POSTED / HELD**: محفوظة في الـ Mock DB.
- شرائح الأسعار: `T1 قطاعي / T2 نص جملة (≈ -4%) / T3 جملة (≈ -8%)`.

## معادلات الحساب (المصدر: utils/invoice.ts)

```
gross      = Σ item.total
discounted = max(0, gross − discount)
tax        = discounted × (taxRate / 100)        ← الافتراضي 14%
net        = discounted + tax
```

## بيانات الـ Seed الافتتاحية

- 14 صنفًا موزعين على: إلكترونيات (4) — مواد غذائية (4) — أدوات منزلية (3) — مستلزمات مكتبية (3).
- مولّد فواتير **حتمي** (mulberry32 بثابت 20261105): لكل يوم من آخر 7 أيام 3–6 مبيعات + 1–2 مشتريات + احتمال مرتجع، مع فاتورتين معلّقتين جاهزين للتجربة.
- نفس البذرة = نفس البيانات بالظبط في أي جهاز.

## التحويل لقاعدة بيانات حقيقية (SQL)

```
tenants(id, name)
companies(id, tenant_id → tenants, name)
branches(id, company_id → companies, name, name_ar)
users(id, tenant_id → tenants, username UNIQUE, password_hash, level, is_system, is_active)
user_phones(id, user_id → users, value, is_primary)
user_emails(id, user_id → users, value, is_primary)
user_attachments(id, user_id → users, kind, letter, is_primary)
categories(id, tenant_id, name, name_ar)
manufacturers(id, tenant_id, name, name_ar)
products(id, tenant_id, barcode UNIQUE, name, name_ar, category_id, manufacturer_id,
         price_t1, price_t2, price_t3, image_url)
invoices(id, tenant_id, branch_id, type, status, customer_name, customer_name_ar,
         price_tier, discount, tax_rate, created_at, updated_at, posted_at, held_at)
invoice_items(id, invoice_id → invoices, barcode, name, name_ar,
              qty, unit_price, total, notes)
invoice_notes(id, invoice_id, text)
```

**قواعد التحويل:**
1. كل جدول تشغيلي عليه `tenant_id` من اليوم الأول (تعدد مستأجرين).
2. `users.username` فريد داخل المستأجر — والفهارس على `user_emails.value` و `user_phones.value` لتسجيل الدخول الموحد.
3. `invoices.status` = CHECK constraint بالقيم الثلاثة، وفهرس مركّب على `(tenant_id, status, type)` للتقارير.
4. الحسابات المالية (ملخص الداشبورد/الحسابات/التقارير) هتطلع بـ Aggregation Queries على `invoice_items` بدل حسابها في الذاكرة.
5. المخزون: جدول `stock_levels(branch_id, product_barcode, qty)` — الـ hash الحالي في الـ Mock بديل مؤقت.
