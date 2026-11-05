# 05 — اللغات (i18n) والثيمات

## اللغات

| | English (افتراضية) | العربية المصرية |
|---|---|---|
| الكود | `en` | `ar` |
| الاتجاه | LTR | RTL |
| الخط | Inter Variable | Cairo Variable |
| الأرقام | `en-US` (1234.50) | `ar-EG` (١٬٢٣٤٫٥٠) |
| العملة | `EGP 1,250.00` | `1,250.00 ج.م` |

### كيف يعمل النظام

1. القواميس في `app/locales/en.json` و `ar.json` — **مفاتيح مسطحة** بنفس أسلوب ملف التصميم المرجعي (`dash.title`، `inv.tax`...).
2. `composables/useI18n.ts` بيوفّر `t(key, params?)` مع استبدال `{param}`، و `locale` و `dir` و `isRTL` — كلها reactive مربوطة بمتجر التفضيلات.
3. أي نص يظهر للمستخدم **لا يُكتب داخل المكون أبدًا** — قاعدة إلزامية في الخطة؛ حتى رسائل الأخطاء من مخططات Zod عبارة عن مفاتيح ترجمة بتترجم وقت العرض.
4. تبديل اللغة (زر الـ Globe في شريط العنوان أو Alt+L):
   - بيحدّث `preferences.locale` (بتتحفظ localStorage).
   - `app.vue` بيطبّق `lang` + `dir` على وسم `<html>` فورًا.
   - الخط بيتبدل تلقائيًا عبر قاعدة `html[dir="rtl"]` في `main.css`.
   - أيقونات اتجاهية (أسهم) بتنقلب عبر كلاس `icon-directional`.
   - إشعارات Sonner بتتنقل للجهة المقابلة.
5. البيانات نفسها ثنائية اللغة (`name` + `nameAr` للمنتجات والفئات والفروع وأسماء العملاء) — `localizedEntityName()` بتختار حسب اللغة.

### إضافة لغة جديدة

1. انسخ `en.json` لملف جديد وترجم القيم.
2. أضف الكود لنوع `LocaleCode` في `types/index.ts`.
3. سجّله في قاموس `useI18n` وخطه في `main.css` لو مختلف.

## الثيمات

| الوضع | السلوك |
|---|---|
| `light` (افتراضي) | توكنز فاتحة |
| `dark` | توكنز داكنة |
| `system` | يتبع `prefers-color-scheme` مع مستمع حي للتغييرات |

### التوكنز (CSS Variables بصيغة HSL فقط)

كل الألوان في `app/assets/css/main.css` منقولة حرفيًا من ملف التصميم المرجعي:

```css
--color-py (primary) --color-sy (secondary) --color-at (accent)
--color-ok / --color-err / --color-war / --color-inf
--color-surface / --color-surface-alt / --color-br (borders)
--color-bg / --color-bg-f / --color-md-f ...
```

- التبديل بعملة واحدة: `data-theme="dark"` على وسم `<html>` — وكل التوكنز بتتبدل دفعة واحدة (بدون كلاسات `dark:` منتشرة في المكونات).
- Tailwind معدّل بـ `darkMode: ['class', '[data-theme="dark"]']` لو احتجت variants.
- الشارت الأسبوعي (Chart.js) بيتلون من نفس التوكنز حسب الثيم المحسوم.

### القواعد الإلزامية للتصميم

- ✅ الألوان: CSS Variables HSL فقط.
- ✅ المسافات والأحجام: `em` و `rem` فقط — **ممنوع px نهائيًا** (حتى حدود الجداول 0.0625em).
- ✅ مكونات جاهزة: `erp-card` / `erp-input` / `erp-btn-*` / `erp-badge` / `erp-checkbox` / `erp-modal-*` / `erp-skeleton` / `price-tier-btn` / `invoice-preview-paper`.

### دوّر الثيم

زر الثيم في شريط العنوان بيدوّر: Light → Dark → System (نفس سلوك ملف التصميم)، وكذلك خطوة الإعداد الثالثة بتخليك تختار الثيم واللغة بشكل بصري — والاثنين بيتحفظوا ويرجعوا بعد إعادة التشغيل (معيار القبول رقم 4).
