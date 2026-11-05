# خطة تنفيذ مشروع B-Shop

> **تعليمات للـ AI:** اقرأ هذا الملف كاملاً قبل أي عمل. نفّذ المراحل بالترتيب، ولا تنتقل لمرحلة جديدة قبل ما تخلص التحقق (Verification) الخاص بالمرحلة اللي قبلها. اكتب كل التعليقات والتوثيق بالعربية المصرية، والكود نفسه بالإنجليزية.

**اسم المشروع:** B-Shop
**نوع المشروع:** نظام إدارة محلات وشركات تجارية (ERP / POS)، يبدأ بمحل واحد ويكون قابل للتوسع لعدة شركات وفروع.
**الإصدار:** 1.0.0

---

## 1. الهدف من المشروع

بناء تطبيق سطح مكتب وويب لإدارة المحلات التجارية، يشمل:
- تسجيل الدخول بمعرّف موحد (اسم مستخدم، بريد إلكتروني، أو رقم هاتف).
- الشروط والأحكام، وإعداد أولي (Onboarding).
- لوحة تحكم تنفيذية.
- الفواتير (بيع، شراء، مرتجع) مع تعدد التبويبات والتعليق والطباعة.
- الحسابات، المخازن، والتقارير.

المشروع لازم يتبني بطريقة تسمح بالتحويل لاحقاً لنظام متعدد الشركات والفروع من غير إعادة كتابة.

---

## 2. التقنيات المعتمدة

| الطبقة | التقنية |
|---|---|
| Framework | Nuxt 3 (Vue 3, TypeScript) |
| Desktop Shell | Tauri |
| التنسيق | Tailwind CSS |
| مكونات الواجهة | shadcn-vue |
| الجداول | TanStack Table |
| الأيقونات | Lucide Vue Next |
| الإشعارات | Vue Sonner |
| إدارة الحالة | Pinia + @pinia-plugin-persistedstate/nuxt |
| طلبات HTTP | ofetch |
| التحقق من النماذج | VeeValidate + Zod |
| الرسوم البيانية | Chart.js + vue-chartjs |
| التواريخ | date-fns |
| الطباعة | print-js |
| المصادقة (واجهة) | nuxt-auth-utils |

---

## 3. القرارات الافتراضية (معتمدة، لا تُعاد مناقشتها)

1. **التنفيذ:** يتم إنشاء كل الملفات والمجلدات فعلياً في مجلد المشروع، ولا يُكتفى بالوصف.
2. **حساب `bomba` (المستوى 900):** يُحقن في الـ Mock Data كـ seed بالبيانات المحددة في القسم 6، ويُخزَّن كلمة المرور في الـ mock كنص تجريبي مع تعليق صريح أنه تجريبي. **التشفير الحقيقي (bcrypt) يُطبَّق في الباك إند لاحقاً** ولا يُطبَّق على الفرونت.
3. **المحتوى التجريبي:** تُستبدل المنتجات الزراعية بمنتجات عامة (إلكترونيات، مواد غذائية، أدوات منزلية، مستلزمات مكتبية) بأسماء وأسعار واقعية بالجنيه المصري.
4. **الأولوية:** المصادقة أولاً (تسجيل الدخول، الـ seed، الشروط، الإعداد)، ثم الشاشة الرئيسية (الداشبورد والفواتير).
5. **اللغة:** الافتراضية English (en, LTR)، واللغة الثانية العربية المصرية (ar, RTL). الثيم الافتراضي Light، ويدعم Dark و System.

---

## 4. قواعد تنفيذ إلزامية للـ AI

- **لا تحذف ولا تعدّل** أي ملف خارج نطاق المرحلة الحالية إلا لو المرحلة نصّت على ذلك صراحة.
- **كل ملف جديد** يبدأ بتعليق File Header بالعربية المصرية (JSDoc) يوضح الغرض من الملف.
- **الاستيرادات:** لا تستخدم مسارات نسبية طويلة (`../../`)، واستخدم alias مركزي `@/`.
- **الأيقونات:** كل أيقونة من Lucide تُستورد بادئة `Icon` (مثال: `IconUser`).
- **الأنواع:** استخدم `import type` للأنواع فقط.
- **لا تستخدم HTML مباشر** داخل الصفحات؛ استخدم مكونات UI من shadcn-vue أو مكونات المشروع.
- **التصميم:** كل الألوان عبر CSS Variables بصيغة HSL، والمسافات والأحجام بـ `em` و `rem` فقط، ولا تستخدم `px` في التصميم.
- **i18n:** أي نص ظاهر للمستخدم يُكتب في ملف الترجمة، ولا يُكتب مباشرة في المكون.
- **التوقيت:** أي timestamp يُخزَّن بصيغة UTC.
- **لا تضع أسرار أو مفاتيح حقيقية** في الكود أو الملفات.
- **التحقق بعد كل مرحلة:** شغّل `npm run lint` و `npm run typecheck` وتأكد أن المشروع يبني بدون أخطاء قبل الانتقال.

---

## 5. هيكل المجلدات المستهدف

```
b-shop/
├── README.md
├── package.json
├── nuxt.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── components.json                 # إعداد shadcn-vue
├── .env.example
├── .gitignore
├── docs/
│   ├── 00-overview.md              # نظرة عامة على المشروع
│   ├── 01-architecture.md          # المعمارية والطبقات
│   ├── 02-api-contract.md          # عقد الـ API (الـ endpoints والـ DTOs)
│   ├── 03-data-model.md            # نموذج البيانات (سيتحول لقاعدة بيانات)
│   ├── 04-auth-and-seed.md         # المصادقة وحساب bomba
│   ├── 05-i18n-and-theme.md        # اللغات والثيمات
│   ├── 06-backend-migration.md     # دليل التحويل للباك إند
│   └── 07-changelog.md
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
├── public/
│   └── favicon.ico
├── app/
│   ├── app.vue
│   ├── assets/css/main.css         # CSS Variables للثيم
│   ├── alias/index.ts              # نقطة الاستيراد المركزية
│   ├── layouts/
│   │   ├── default.vue             # Shell التطبيق الرئيسي
│   │   └── auth.vue                # Shell صفحات الدخول
│   ├── pages/
│   │   ├── index.vue               # Splash
│   │   ├── auth/sign-in.vue
│   │   ├── terms.vue
│   │   ├── onboarding.vue
│   │   ├── dashboard.vue
│   │   ├── invoices/index.vue
│   │   ├── accounts.vue
│   │   ├── inventory.vue
│   │   ├── reports.vue
│   │   └── [...slug].vue           # 404
│   ├── components/
│   │   ├── ui/                     # مكونات shadcn-vue
│   │   ├── shared/                 # مكونات مشتركة
│   │   ├── auth/                   # SmartIdentifierInput وغيرها
│   │   ├── invoices/               # محرر الفواتير
│   │   └── dashboard/              # بطاقات وشارتات
│   ├── composables/
│   ├── stores/                     # Pinia: auth, invoices, preferences
│   ├── middleware/
│   │   ├── auth.global.ts          # حماية المسارات
│   │   └── super-bomba.ts          # أول شرط تحقق للمستوى 900
│   ├── services/
│   │   ├── api/                    # ofetch wrapper
│   │   └── mock/                   # Mock Data و Seed
│   ├── schemas/                    # Zod schemas
│   ├── types/                      # أنواع TypeScript مشتركة
│   ├── utils/                      # دوال مساعدة (تنسيق EGP، التواريخ)
│   └── locales/
│       ├── en.json
│       └── ar.json
└── server/                         # جاهز للباك إند لاحقاً (فارغ في المرحلة الأولى)
    └── api/
```

---

## 6. بيانات حساب صانع النظام (Seed)

يُحقن هذا الحساب عند أول تشغيل فقط، ولا توجد أي بيانات أخرى قبله.

- **Entity:** نوع `user`، `is_active = 1`.
- **User:** `username = "bomba"`، `level = 900`، `is_system = true`.
- **Credentials:** كلمة المرور `bomba000` (في الـ mock فقط، مع تعليق أنها تُشفَّر بـ bcrypt في الباك إند).
- **Phones:**
  - `01281130712` مع `is_primary = true`
  - `01281130713` مع `is_primary = false`
- **Emails:**
  - `bomba000@bomba.com` مع `is_primary = true`
  - `bomba001@bomba.com` مع `is_primary = false`
- **Attachments:** أفاتار دائري افتراضي يحمل الحرف `B` مع `is_primary = true`.

### منطق الصلاحيات (super_bomba)

1. **أول شرط تحقق (Middleware):** أي طلب يحمل مستخدم مستواه 900 يُسمح له فوراً (`ALLOW_ALL`) قبل أي فحص آخر.
2. **تجاوز النطاقات:** يتجاوز هذا الحساب العزل بين المستأجرين (`tenant_id`) ونطاقات المستخدم (Self/Tenant Scopes).
3. **منح الصلاحيات:** يستطيع إنشاء أي حساب مشرف أو مستخدم دون تطبيق قاعدة "فاقد الشيء لا يعطيه".
4. **الحماية:** يُمنع حذف الحساب أو تعديل مستواه برمجياً عبر شرط `is_system = true`.

---

## 7. تسجيل الدخول

- حقل واحد يقبل: اسم مستخدم، بريد إلكتروني، أو رقم هاتف.
- الحقل يكتشف النوع تلقائياً أثناء الكتابة ويعرض Badge مناسب (Email / Phone / Username).
- كلمة المرور حقل منفصل مع زر إظهار/إخفاء.
- عند النجاح: إن لم تُقبل الشروط يذهب المستخدم لـ `/terms`، ثم لـ `/onboarding` إن لم يكتمل الإعداد، ثم لـ `/dashboard`.
- الـ mock يتحقق من القيمة المدخلة مقابل الـ seed، ويعيد DTO مثل الباك إند الحقيقي.

---

## 8. نموذج البيانات (Mock)

| الكيان | الحقول الأساسية |
|---|---|
| Branch | id، name، companyId |
| Company | id، tenantId |
| Category | id، name |
| Manufacturer | id، name |
| Product | barcode، name، categoryId، manufacturerId، prices (T1/T2/T3)، imageUrl |
| Invoice | id، type (SALE/PURCHASE/RETURN)، status (OPEN/POSTED/HELD)، branchId، customer، items، discount، taxRate، notes |
| InvoiceItem | id، barcode، name، qty، unitPrice، total، notes |
| User | id، username، level، isSystem، tenantId |
| Phone / Email | value، isPrimary، userId |

الأسعار تكون بالجنيه المصري (EGP). ضريبة القيمة المضافة الافتراضية 14%.

---

## 9. المراحل والتنفيذ

### المرحلة 0: التهيئة
- إنشاء مشروع Nuxt 3 بـ TypeScript.
- تثبيت كل المكتبات من القسم 2.
- إعداد Tailwind وshadcn-vue (`components.json`).
- إعداد Tauri (`src-tauri`).
- إنشاء `.gitignore` و `.env.example`.
- **التحقق:** `npm run dev` يعمل، و `npm run build` ينجح.

### المرحلة 1: الأساس (Foundation)
- إنشاء `app/alias/index.ts` وربط alias `@/`.
- إنشاء CSS Variables للثيم (Light / Dark) في `app/assets/css/main.css`.
- إعداد Pinia مع persisted state للتفضيلات (اللغة والثيم).
- إعداد i18n مع `en.json` و `ar.json` ودعم RTL.
- إنشاء Layouts: `default.vue` و `auth.vue`.
- **التحقق:** تبديل اللغة والثيم يعمل ويحفظ التفضيل.

### المرحلة 2: المصادقة (Auth)
- إنشاء `services/mock/seed.ts` بحساب `bomba` كما في القسم 6.
- إنشاء `services/api/` (ofetch wrapper) و mock endpoint لتسجيل الدخول.
- إنشاء `schemas/auth.ts` (Zod) للتحقق من المعرّف وكلمة المرور.
- بناء `SmartIdentifierInput` باكتشاف النوع.
- إنشاء `pages/auth/sign-in.vue` و `stores/auth.ts`.
- إنشاء middleware: `auth.global.ts` و `super-bomba.ts`.
- **التحقق:** تسجيل الدخول بـ `bomba` / `bomba000` ينجح بأي من المعرّفات الثلاثة، والخطأ يظهر لغير ذلك.

### المرحلة 3: الشروط والإعداد
- إنشاء `pages/terms.vue` (5 بنود) مع تفعيل زر القبول عند تأكيد الـ checkbox.
- إنشاء `pages/onboarding.vue` (4 خطوات: ترحيب، الملف الشخصي، الثيم واللغة، الإكمال).
- حفظ حالة الإكمال في الـ store.
- **التحقق:** المسار كامل من الدخول للوحة التحكم بدون تخطي.

### المرحلة 4: الشاشة الرئيسية
- بناء `layouts/default.vue` (شريط التنقل، البحث العام، الفرع، التاريخ).
- بناء `pages/dashboard.vue` (بطاقات، شارت أسبوعي بـ Chart.js، جدول آخر الفواتير).
- بناء `pages/invoices/index.vue` مع تعدد التبويبات، Split View، التعليق (Hold)، والحفظ والطباعة.
- **التحقق:** إضافة صنف لفاتورة تحسب الإجماليات والضريبة صح، والتعليق والاسترجاع يشتغلوا.

### المرحلة 5: الوحدات الإضافية
- `pages/accounts.vue`: ملخص مالي وجدول دفتر الفواتير.
- `pages/inventory.vue`: المخزون حسب الفرع، باستخدام TanStack Table.
- `pages/reports.vue`: تقارير حسب نوع الفاتورة.
- **التحقق:** الأرقام متسقة بين الوحدات الأربعة.

### المرحلة 6: الحالات الخاصة
- `pages/[...slug].vue` (404) و error page (500).
- معالجة الأخطاء بـ error boundary.
- **التحقق:** المسارات غير الموجودة تعرض 404، والأخطاء تعرض 500.

### المرحلة 7: التوثيق والتحويل للباك إند
- كتابة كل ملفات `docs/` بالعربية المصرية.
- توثيق `02-api-contract.md` بكل endpoint تم محاكاته، مع شكل الـ DTO.
- توثيق `06-backend-migration.md`: كيف يتم استبدال `services/mock` بـ API حقيقي، وأين يُطبَّق bcrypt، وكيف تُنقل صلاحيات super_bomba للباك إند.
- **التحقق:** كل endpoint في الـ mock له توثيق مطابق.

---

## 10. معايير القبول النهائية

- [ ] المشروع يبني بدون أخطاء (`npm run build`).
- [ ] تسجيل الدخول بـ `bomba` يعمل بالبريد والهاتف واسم المستخدم.
- [ ] الشروط والإعداد إلزاميان قبل الوصول للوحة التحكم.
- [ ] اللغة (en/ar) والثيم (light/dark/system) يتبدلوا ويتحفظوا.
- [ ] الفواتير تحسب الإجماليات والضريبة (14%) بدقة.
- [ ] المنتجات التجريبية عامة (غير زراعية).
- [ ] كل ملفات `docs/` موجودة ومكتملة.
- [ ] لا توجد أسرار حقيقية في الكود.
