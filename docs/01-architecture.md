# 01 — المعمارية والطبقات

## نظرة الطبقات

```
┌─────────────────────────────────────────────────────────┐
│  Pages (app/pages) — شاشات رقيقة بتجمّع مكونات فقط        │
├─────────────────────────────────────────────────────────┤
│  Components (ui / shared / feature) — كل UI قابل لإعادة   │
│  الاستخدام، بنمط shadcn-vue فوق reka-ui + cva             │
├─────────────────────────────────────────────────────────┤
│  Stores (Pinia) — auth / invoices / preferences           │
│  + Persisted State (localStorage)                         │
├─────────────────────────────────────────────────────────┤
│  Services/API (endpoints.ts) — عقود موحدة Mock/حقيقي      │
│  ├─ وضع Mock: services/mock/handlers.ts                   │
│  └─ وضع حقيقي: ofetch client.ts → NUXT_PUBLIC_API_BASE_URL│
├─────────────────────────────────────────────────────────┤
│  Mock DB (localStorage) — seed: bomba + كتالوج + فواتير   │
└─────────────────────────────────────────────────────────┘
```

## القواعد الذهبية في المعمارية

1. **الصفحات رقيقة:** الصفحة بتجمع مكونات وبتوصل الأحداث بالمتاجر — مفيش منطق أعمال جواها.
2. **مصدر حقيقة واحد للحسابات:** `utils/invoice.ts#computeInvoiceAmounts` هو الدالة الوحيدة اللي بتحسب (المجموع → الخصم → الضريبة → الصافي). كل الشاشات الأربعة (داشبورد/فواتير/حسابات/تقارير) بتنادي نفس طبقة البيانات بنفس المدخلات (المسودات المفتوحة + المخزنة) عشان **الأرقام تفضل متسقة**.
3. **عقود API موحدة:** أي صفحة بتنادي `services/api/endpoints.ts` — الدالة بتفضل بين `handlers.ts` (Mock) و `realRequest` (HTTP) حسب `NUXT_PUBLIC_API_MOCK`. تحويل المشروع للباك إند = تغيير متغير بيئة (راجع `06-backend-migration.md`).
4. **الأنواع أولاً:** كل DTO معرّف في `app/types/index.ts` ومشترك بين الواجهة والـ Mock — نفس الشكل اللي الباك إند هيرجعه.
5. **الحالة مقسمة بذكاء:**
   - `preferences`: لغة + ثيم + فرع حالي (persisted).
   - `auth`: جلسة المستخدم + الشروط + الإعداد (persisted).
   - `invoices`: تبويبات المسودات المفتوحة (persisted).
   - Mock DB: الفواتير المرحّلة/المعلّقة + الكتالوج (persisted localStorage).
6. **اتجاه الواجهة:** كل الأنماط بتستخدم خصائص منطقية (`ms-` / `ps-` / `inset-inline`) والخط بيتغير تلقائيًا مع `html[dir]` — فالـ RTL مش Patch منفصل.

## آلية حماية المسارات

```
طلب تنقّل
   │
   ├─ middleware/auth.global.ts
   │    1) super-bomba check (المستوى 900) → سماح فوري بفحوصات الصلاحيات
   │    2) زائر + مسار محمي → /auth/sign-in
   │    3) مسجل بدون شروط → /terms
   │    4) مسجل بدون إعداد → /onboarding
   │    5) كامل البوابات + عائد لصفحات الدخول → /dashboard
   │
   └─ middleware/super-bomba.ts (named، أول middleware في صفحات النظام)
        → ALLOW_ALL لصانع النظام قبل أي فحص تاني
```

## طبقة المحاكاة (Mock)

- `services/mock/seed.ts`: السييد (bomba + فروع + فئات + كتالوج 14 صنف + مولّد فواتير حتمي لآخر 7 أيام).
- `services/mock/db.ts`: قراءة/كتابة localStorage بمفتاح `bshop_mock_db_v1` + `resetMockDatabase()`.
- `services/mock/handlers.ts`: تنفيذ الـ endpoints بتأخير شبكة محاكى (260ms).
- التوقيتات كلها UTC ISO — والعرض بيتم عبر `utils/dates.ts` حسب اللغة.

## دورة بيانات مشتركة

`useAppData()` بتوفر عدّاد `dataVersion` — أزرار «مزامنة الـ API» و«تصفير قاعدة البيانات» في شريط الأدوات بيزودوا العدّاد، وكل صفحة بتسمع عليه عبر `onDataRefresh()` وتعيد جلب بياناتها تلقائيًا. كذلك بتعرض غلاف الـ Skeleton أثناء المزامنة (نفس سلوك ملف التصميم المرجعي).

## Tauri (سطح المكتب)

- `src-tauri/tauri.conf.json`: `beforeDevCommand: npm run dev` و `devUrl: http://localhost:3000` في التطوير، و `frontendDist: ../.output/public` بعد `npm run generate` في الإنتاج.
- شريط العنوان داخل التطبيق شغال في الحالتين، وأزرار التحكم في النافذة (تصغير/تكبير/غلق) بتظهر **فقط** لما يكتشف التطبيق بيئة Tauri (`__TAURI_INTERNALS__`) عن طريق `shared/WindowControls.vue`.
