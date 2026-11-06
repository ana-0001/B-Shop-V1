# 07 — سجل التغييرات (Changelog)

الصيغة مبنية على [Keep a Changelog](https://keepachangelog.com) والإصدارات SemVer.

## [1.1.1] — 2026-11-06

### تغيير معماري — إعادة تموضع شريط الحالة: الفوتر بدلًا من الهيدر
تصحيح لالتباس v1.1.0 بناءً على قرار صاحب المشروع: **شريط الحالة بياخد محل محتويات الفوتر القديم مش الهيدر** — تمت استعادة الهيدر السابق كاملًا ونقل الشريط النظامي لفوتر مساحة العمل.

#### استرجاع الهيدر السابق (Top Bar)
- إرجاع `shared/AppTitleBar.vue` (العلامة التجارية + اللغة + الثيم + أزرار النافذة) أعلى `app.vue` و`error.vue` — بنفس محتواه وسلوكه السابق تمامًا بما فيه منطقة سحب النافذة (`.titlebar` في main.css).
- إرجاع `shared/LanguageToggle.vue` و`shared/ThemeToggle.vue` القديمين (تبديل سريع EN↔AR و Light→Dark→System مع Toast).

#### نقل SystemStatusBar إلى الفوتر (فقط داخل مساحة العمل)
- الشريط صار `<footer role="contentinfo">` في `layouts/default.vue` في نفس موضع شريط الحالة السفلي القديم — مفيش شريط حالة على Splash/الدخول/الخطأ (زي التصميم القديم).
- **منع التكرار مع الهيدر المستعاد**: حذف من الشريط — العلامة التجارية (منطقة الوسط) + تبديل الثيم واللغة + أزرار النافذة — كلها رجعت للهيدر. بقي في الفوتر: نبضة الصحة + شارة الإصدار + وسم البيئة (Start) والساعة الحية + الإشعارات + الإعدادات (End).
- اتجاهات معكوسة لكشريط سفلي: الحد والظل فوق الشريط، حركة الدخول صاعدة من تحت لفوق، وقوائم الساعة والإشعارات بتفتح **لفوق** (`side="top"`).

#### هندسة النسبية المطلقة (EM-Based Geometry)
- مرساة قياس واحدة `--ssb-em` على `.ssb` وعلى الحاويات المنقولة عبر Portal (`ssb-pop-content`/`ssb-drawer-content` لأنها خارج شجرة `.ssb`) — تغيير قيمتها الواحدة يقيّس الشريط كله (ارتفاع/مسافات/خطوط/حدود/ظلال) بنسب ثابتة.
- تحويل كل القيم الداخلية من `rem` إلى `em` نسبية للمرساة (بما فيها `blur(0.75em)`) — صفر px وصفر rem داخلي؛ استثناء محسوب: `calc(var(--ssb-em) * 0.5625)` لشارة العدّاد وأيقونات الإشعارات لأن سياقها المحلي بخط أصغر.
- استبدال أدوات Tailwind المعتمدة على rem داخل المناطق (`gap-1`, `w-px h-3`, `mx-0.5`…) بأصناف CSS نسبية: `.ssb-zone` / `.ssb-zone-start` / `.ssb-zone-end` / `.ssb-separator` — كلها em.
- ضبط مسافات الدرج: `gap-2`/`mt-2`/`w-3.5` → `gap-[0.5em]`/`mt-[0.5em]`/`w-[0.875em]`.

#### تنظيف
- حذف `zones/SsbCenterZone.vue` و`elements/SsbBrandMark.vue` و`SsbThemeToggle.vue` و`SsbLanguageToggle.vue` + مفاتيح i18n اليتيمة `ssb.aria.theme` و`ssb.aria.language` (274 مفتاحًا متوازنًا في الملفين).
- رفع `appVersion` إلى `1.1.1`.

#### إصلاح مصاحب — توحيد المنطقة الزمنية في `useLiveClock`
- الساعة الرئيسية (12h) والتاريخان الميلادي والهجري كانوا يُنسيقان بمنطقة المتصفح بينما الـ 24h فقط بتوقيت القاهرة — يظهر تناقض (مثال: `08:17 AM` في الشريط مقابل `10:17:24` في البطاقة). أُضيف `timeZone: SSB_TIMEZONE` لكل المنسّقات فأصبح العرض كله مثبتًا على القاهرة (PRD: دقة مالية)، والاختبار الفعلي يؤكد التطابق (`10:18 AM` = `10:18:07`).

## [1.1.0] — 2026-11-06

### إضافة — شريط الحالة النظامي الموحد (SystemStatusBar) وفق PRD
تنفيذ كامل لوثيقة `07-1-PRD-StatusBar.md` بنسخة Vue 3 المكافئة لبيئة المشروع الحالية (قرار صاحب القرار: "التنفيذ بما يتناسب مع بيئة العمل الحالية والمكاتب الحالية")، مع اعتماد **ألوان الـ PRD حرفيًا** (ذهبي `hsl(45 85% 62%)`، خلفية فاتحة `hsl(30 20% 98%)`، غامقة `hsl(220 15% 12%)`) والساعة بصيغة **12 ساعة + Tooltip احترافي** حسب اختيارات صاحب المشروع.

#### وحدة جديدة `app/components/system-status-bar/` (بنيّة PRD الثلاثية)
- `SystemStatusBar.vue` — نقطة الدخول: ثلاث مناطق بخصائص CSS منطقية (Start/Center/End) لانعكاس RTL/LTR سلس + حركة دخول نابضة (spring cubic-bezier).
- `zones/` — `SsbStartZone` (نبضة الصحة + شارة الإصدار الذهبية + وسم البيئة) · `SsbCenterZone` (الشعار الرسمي + الاسم + السطر التعريفي) · `SsbEndZone` (الساعة + الثيم + اللغة + الإشعارات + الإعدادات + أزرار النافذة Tauri).
- `elements/` — `SsbPulseDot` (aria-live="polite") · `SsbVersionBadge` · `SsbEnvTag` (DEV/PROD) · `SsbBrandMark` · `SsbLiveClock` (Popover التحويم) · `SsbNotificationBell` · `SsbThemeToggle` · `SsbLanguageToggle` · `SsbSettingsTrigger`.
- `composables/` — `useLiveClock` (12h + 24h بتوقيت `Africa/Cairo` + ميلادي + هجري **أم القرى** `islamic-umalqura` بصيغة PRD `Tuesday : 25 - (11 - Dhu al-Qi'dah) - 1447 AH` مع كاش منسّقات Intl) · `useSystemStatus` (online/degraded/offline مشتقة من دورة المزامنة) · `useNotificationCenter` (إشعارات Mock مشتقة: فواتير معلّقة من الـ API + مخزون منخفض من الـ inventory + أحداث sync/db-reset من ناقل الأحداث، مع تعليم كمقروء وحذف وتفريغ وسقف 30 إشعارًا).
- `SettingsDrawer.vue` — درج جانبي (reka-ui Drawer) بمظهر النيومورفيزم: المظهر (Light/Dark/System) + اللغة + الفرع الحالي + المنطقة والتوقيت (القاهرة مثبتة مع ملاحظة الجاهزية لـ RegionSettings حسب خارطة الطريق) + بطاقة "عن النسخة".
- `status-bar.css` — توكنز `--ssb-*` معزولة تحت جذر `.ssb`: زجاج `backdrop-blur(12px)` + ظل مزدوج مرفوع + ظل داخلي للضغط + ارتفاع صارم `1.5em` + استجابة تدريجية (إخفاء العلامة/التاجليت حسب العرض) — بدون أي px.

#### قرارات معمارية (بديلة لعناصر PRD غير المتوافقة مع بيئة المشروع)
| PRD (React) | التنفيذ الفعلي (Vue) |
| --- | --- |
| React 19 + Vite 6 | Vue 3 + Nuxt 3 (بيئة المشروع القائمة) |
| Radix UI | reka-ui (نفس الـ API — Popover + Drawer) |
| Framer Motion (spring) | CSS keyframes بنفس منحنى الـ spring + `<Transition>` |
| i18next | `useI18n` المركزي بالمشروع (en/ar + RTL) |
| CSS Module لكل مكوّن | `status-bar.css` واحد بتوكنز معزولة `--ssb-*` |

#### تغييرات مرتبطة
- **استبدال `AppTitleBar`**: الشريط الجديد صار شريط الردبس الموحد أعلى `app.vue` و`error.vue` في كل الشاشات (Splash/دخول/مساحة عمل/أخطاء) — مع دمج `WindowControls` (Tauri) داخل منطقة النهاية + مناطق سحب النافذة (`-webkit-app-region`).
- **حذف شريط الحالة السفلي القديم** (`shared/StatusBar.vue`) — محتواه موزع: صحة/ساعة → الشريط الجديد، المستخدم → قائمة UserMenu، تبويبات مفتوحة → شريط تبويبات الفواتير، نسخة الفِسقال → Tooltip الشارة + درج الإعدادات.
- **حذف** `LanguageToggle.vue` و`ThemeToggle.vue` القديمين (استُبدلا بنسختي SSB النيومورفيزم بنفس المنطق المركزي).
- مفاتيح i18n جديدة تحت `ssb.*` (صحة/ساعة/إشعارات/إعدادات/وصولية) في `en.json` و`ar.json` + حذف مفاتيح `status.*` اليتيمة.
- رفع `appVersion` إلى `1.1.0` في `runtimeConfig`.

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
