# B-Shop — نظام إدارة المحلات (ERP / POS)

<div align="start">

**الإصدار:** 1.0.0 · **اللغات:** English (LTR) + العربية المصرية (RTL) · **العملة:** الجنيه المصري (EGP)

نظام متكامل للفواتير ونقاط البيع والمخازن والحسابات والتقارير — يبدأ بمحل واحد ومبني بحيث يتوسع لعدة شركات وفروع من غير إعادة كتابة.

</div>

---

## 🚀 التشغيل السريع

```bash
# 1) تثبيت الحزم
npm install

# 2) وضع التطوير (ويب)
npm run dev            # http://localhost:3000

# 3) التحقق (زي ما الخطة طالبة بعد كل مرحلة)
npm run lint           # ESLint
npm run typecheck      # vue-tsc
npm run build          # بناء الإنتاج

# 4) تطبيق سطح المكتب (Tauri — محتاج Rust مثبت)
npm run tauri dev
npm run tauri build
```

## 🔑 بيانات الدخول التجريبية (صانع النظام)

| المعرّف الموحد — أي واحد منهم | كلمة المرور |
|---|---|
| `bomba` · `bomba000@bomba.com` · `bomba001@bomba.com` · `01281130712` · `01281130713` | `bomba000` |

> كلمة المرور نص تجريبي في طبقة الـ Mock فقط — التشفير bcrypt في الباك إند (راجع `docs/06-backend-migration.md`).

## ✨ المزايا

- **تسجيل دخول بمعرّف موحد** مع كشف تلقائي للنوع (اسم مستخدم / بريد / موبايل مصري) وBadge حي.
- **قمع إلزامي:** الشروط والأحكام (5 بنود) → الإعداد الأولي (4 خطوات) → لوحة التحكم — بدون تخطي.
- **فواتير احترافية:** تبويبات متعددة، Split View، شرائح تسعير T1/T2/T3، تعليق واسترجاع، ترحيل، وطباعة A4 — بضريبة 14% محسوبة من دالة موحدة في كل الشاشات.
- **لوحة تحكم تنفيذية** بشارت أسبوعي (Chart.js) ودائرة توزيع وبحث عام.
- **حسابات + مخازن (TanStack Table) + تقارير** بأرقام متسقة بين كل الوحدات.
- **ثنائي اللغة بالكامل** en/ar مع RTL حقيقي وخط Cairo، وثيم Light/Dark/System محفوظ.
- **حساب super_bomba (المستوى 900):** سماح فوري بفحوصات الصلاحيات قبل أي فحص آخر.
- **طبقة Mock كاملة** قابلة للتحويل للباك إند بتغيير متغير بيئة واحد.

## 🗂️ التوثيق (بالعربية المصرية)

| الملف | المحتوى |
|---|---|
| `docs/PROJECT_PLAN.md` | **الخطة الأساسية المحفوظة — مرجع المشروع الأول** |
| `docs/00-overview.md` | نظرة عامة والوحدات |
| `docs/01-architecture.md` | المعمارية والطبقات |
| `docs/02-api-contract.md` | عقد الـ API (كل endpoint و DTO) |
| `docs/03-data-model.md` | نموذج البيانات ومخطط SQL |
| `docs/04-auth-and-seed.md` | المصادقة وحساب bomba |
| `docs/05-i18n-and-theme.md` | اللغات والثيمات |
| `docs/06-backend-migration.md` | دليل التحويل للباك إند |
| `docs/07-changelog.md` | سجل التغييرات |

## 🧰 سلسلة الأدوات

Nuxt 3 · Vue 3 · TypeScript · Tailwind CSS · shadcn-vue (reka-ui) · TanStack Table · Lucide Vue Next · Vue Sonner · Pinia + Persisted State · ofetch · VeeValidate + Zod · Chart.js + vue-chartjs · date-fns · print-js · nuxt-auth-utils · Tauri 2

## 📝 ملاحظات

- وضع الـ Mock بيتحكم فيه `NUXT_PUBLIC_API_MOCK=true` (انسخ `.env.example` لـ `.env`).
- بيانات المحاكاة بتتحفظ في localStorage — زر «استعادة البيانات الافتراضية» بيرجّعها لحالة المصنع.
- **ممنوع** وضع أسرار أو مفاتيح حقيقية في الكود أو الملفات.
