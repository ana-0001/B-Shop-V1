# 07 — سجل التغييرات (Changelog)

الصيغة مبنية على [Keep a Changelog](https://keepachangelog.com) والإصدارات SemVer.

## [1.0.1] — 2026-11-06

### إصلاح — جولة الاختبار الشامل (تشغيل فعلي + متصفح)
- **الأصناف كأنواع ضمنية**: إضافة `vue` كاعتماد مباشر في `package.json` — توليد إعلانات الـ auto-imports كان يشير لـ `vue/index` (غير قابل للتحليل مع `moduleResolution: Bundler`) فكانت كل الدوال المُستوردة تلقائيًا بترجع `any` في `nuxt typecheck` (22 خطأ TS7006/TS7053).
- **تعليق/ترحيل الفواتير**: `DataCloneError` في `structuredClone` مع الـ reactive Proxies بتاعة Pinia — استُبدل بنسخ JSON آمنة (`deepCloneInvoice`) في `handlers.ts`.
- **تعليق مساحة العمل بعد آخر تبويب**: بعد Hold أو Save & Print لآخر تبويب كانت الشاشة تعلق في الـ Skeleton — الآن `holdTab` و`postTab` بيهيّئوا مسودة جديدة فورًا (نفس سلوك غلق آخر تبويب).
- **بوابات الشروط/الإعداد بعد الخروج**: `mockSignIn` كان يرجع دائمًا `termsAccepted: false` فكان المستخدم يعيد القمع بعد كل خروج — أُضيف `userStates` لكل مستخدم في قاعدة الـ Mock + endpoints: `POST /auth/accept-terms` و `POST /auth/onboarding` (يحاكي تخزين الباك إند الحقيقي) — الموثقة في `02-api-contract.md`.
- **تحذير prop الأيقونة**: `StatCard.icon` كان `object` والأيقونات Functional Components — صار `Component` من Vue.
- **اعتماديات بيئة التطوير**: تثبيت `@vue/devtools-api` (استيراد اختياري في vee-validate كان يكسر الـ Vite Dev Overlay).

## [1.0.0] — 2026-11-05

### إضافة — المرحلة 0: التهيئة
- مشروع Nuxt 3 (Vue 3 + TypeScript) بـ `srcDir: app/` ووضع SPA متوافق مع Tauri.
- تثبيت كامل مكتبات الخطة: Tailwind، shadcn-vue (reka-ui)، TanStack Table، Lucide، Vue Sonner، Pinia + Persisted State، ofetch، VeeValidate + Zod، Chart.js + vue-chartjs، date-fns، print-js، nuxt-auth-utils.
- إعداد Tauri (`src-tauri`) بأيقونات مولّدة من اللوجو الرسمي + فاڤيكون ICO/SVG.
- `.gitignore` و `.env.example` و `components.json` (shadcn-vue) و `eslint.config.mjs`.

### إضافة — المرحلة 1: الأساس
- توكنز التصميم HSL كاملة (Light/Dark) + مكونات `erp-*` منقولة من الملف المرجعي — بدون أي px.
- `app/alias/index.ts` كنقطة استيراد مركزية + `@/` على srcDir.
- Pinia بمتاجر `preferences` / `auth` / `invoices` مع persisted state.
- i18n كامل en/ar + RTL بخط Cairo + أرقام `ar-EG` وعملة ج.م.
- Layouts: `default` (شل النظام) و `auth` (شل ما قبل الدخول) + TitleBar موحد + شعار المشروع الرسمي.

### إضافة — المرحلة 2: المصادقة
- Seed حساب `bomba` (المستوى 900) بالهواتف والبريد والأفاتار حرفيًا حسب الخطة.
- Mock DB محلية (localStorage) + مولّد فواتير حتمي لآخر 7 أيام + فاتورتان معلّقتان.
- 12 endpoint في طبقة API موحدة (Mock/حقيقي) — موثقة في `02-api-contract.md`.
- `SmartIdentifierInput` بكشف تلقائي (Email/Phone/Username) + `PasswordInput` بإظهار/إخفاء.
- `schemas/auth.ts` (Zod) + VeeValidate + رسائل خطأ مترجمة.
- `auth.global.ts` + `super-bomba.ts` (ALLOW_ALL أولًا + بوابات الشروط/الإعداد).
- تسجيل دخول ناجح بأي من: `bomba` / البريدين / الموبايلين + `bomba000`.

### إضافة — المرحلة 3: الشروط والإعداد
- `/terms`: 5 بنود ثنائية اللغة + checkbox إلزامي + رفض = خروج.
- `/onboarding`: 4 خطوات (ترحيب → ملف وظيفي وأيقونة → ثيم ولغة → إكمال) بحفظ كامل.

### إضافة — المرحلة 4: الشاشة الرئيسية
- Splash بخمس خطوات إقلاع + توجيه تلقائي حسب الجلسة.
- Dashboard: 4 بطاقات + شارت أسبوعي (Chart.js) + دائرة توزيع conic-gradient + جدول آخر الفواتير بفلتر البحث العام.
- شاشة الفواتير: تبويبات متعددة قابلة للغلق، Split View، شرائح تسعير T1/T2/T3، اختيار من الكتالوج بفلاتر، بطاقة عميل (هواتف/عناوين)، جدول بنود بكميات قابلة للتعديل، معاينة حرارية + ملاحظات، تعليق/استرجاع، ترحيل، وطباعة A4 عبر print-js — وضريبة 14% محسوبة من دالة موحدة.

### إضافة — المرحلة 5: الوحدات الإضافية
- `/accounts`: ملخص مالي + دفتر فواتير.
- `/inventory`: TanStack Table (فرز + بحث عام) حسب الفرع مع شارة Low Stock.
- `/reports`: بطاقات + أشرطة توزيع الأنواع + ملخص تشغيلي.
- أرقام متسقة بين الوحدات الأربعة (نفس مجموعة الفواتير + نفس دوال الحساب).

### إضافة — المرحلة 6: الحالات الخاصة
- `[...slug].vue` (404) + `error.vue` (500) بنفس هوية التصميم + زر محاكاة انهيار في وضع التطوير.

### إضافة — المرحلة 7: التوثيق
- 9 ملفات توثيق بالعربية المصرية (ملف الخطة `PROJECT_PLAN.md` محفوظ كمرجع أساسي).

### قرار تقني
- منتجات الـ Mock عامة (إلكترونيات/غذائية/منزلية/مكتبية) — بدل الزراعية حسب القرار الافتراضي 3.
