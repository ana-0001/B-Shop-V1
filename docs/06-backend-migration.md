# 06 — دليل التحويل للباك إند الحقيقي

البنية جاهزة بحيث التحويل يكون **استبدال طبقة واحدة** بدون لمس أي شاشة. اقرأ ده قبل ما تكتب أول سطر باك إند.

## 1) الفلسفة: نفس العقود

كل شاشة بتنادي `services/api/endpoints.ts` — ودواله ليها فرعين:

```ts
signIn(payload) {
  if (isMockEnabled()) return mock.mockSignIn(payload.identifier, payload.password)
  return realRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload })
}
```

**خطوات التحويل:**

1. ابنِ الباك إند بنفس الـ endpoints الموثقة في `02-api-contract.md` (نفس المسارات ونفس أشكال DTO حرفيًا).
2. ارفع المسار في `.env`:
   ```
   NUXT_PUBLIC_API_MOCK=false
   NUXT_PUBLIC_API_BASE_URL=https://api.bshop.example/v1
   ```
3. خلاص — `realRequest` (ofetch) هياخد الباقة، والمصفوفة `onResponseError` في `client.ts` هتحوّل أي خطأ لـ `ApiRequestError` بنفس شكل الـ Mock.

## 2) المصادقة و bcrypt

| المكان | ماذا يحدث |
|---|---|
| **الباك إند** | `POST /auth/login` يبحث بالمعرّف الموحد (username/email/phone) ثم `bcrypt.compare(password, user.password_hash)` — ممنوع إرجاع الـ hash للواجهة أبدًا |
| **الباك إند** | التسجيل/تغيير كلمة المرور: `bcrypt.hash(pw, 12)` |
| **الفرونت (بدون تغيير)** | بيرسل `{ identifier, password }` plain عبر HTTPS ويستقبل `AuthResponse` |
| **حذف الـ Mock** | امسح `SEED_CREDENTIALS` و`mockSignIn` — وعلامة `isMockEnabled` هتمنع الوصول ليهم أصلًا |

الجلسة بعد التحويل: الحالة الحالية Pinia persisted (تطوير). الموصى به للإنتاج: جلسة httpOnly cookie عبر **nuxt-auth-utils** (مثبّت ومفعّل كواجهة رسمية):

```ts
// server/api/auth/login.post.ts (مثال)
await setUserSession(event, { user: { id, username, level } })
secure: { password: process.env.NUXT_SESSION_PASSWORD }  // سر 32+ حرف في .env فقط
```

وداعًا للـ accessToken اليدوي — الـ middleware `auth.global.ts` يقرأ من `useUserSession()` بدل المتجر.

## 3) نقل super_bomba للباك إند

الفرونت حاليًا بيعمل ALLOW_ALL للمستوى 900 — الباك إند لازم يفرض نفس القواعد **كسلطة نهائية**:

```ts
// middleware موحد على مستوى الخادم (مثال Nitro)
export function requireScope(event, scope: string) {
  const user = event.context.user
  if (!user) throw unauthorized()
  if (user.level >= 900) return            // 1) ALLOW_ALL أولًا
  if (!hasTenantScope(user, scope)) throw forbidden()
}

// 2) تجاوز عزل المستأجرين لصانع النظام فقط
if (user.level < 900) query = query.where('tenant_id', user.tenantId)

// 3) منح الصلاحيات: المستوى 900 ينشئ أي مشرف (بدون قاعدة فاقد الشيء لا يعطيه)

// 4) الحماية من التعديل/الحذف
if (target.isSystem) throw forbidden('لا يمكن حذف/تعديل مستوى صانع النظام')
```

## 4) استبدال طبقة الـ Mock خطوة بخطوة

1. أنشئ قاعدة البيانات من مخطط `03-data-model.md` (مع tenant_id في كل الجداول التشغيلية).
2. نفّذ بذر الصانع: سكريبت server-side ينشئ `bomba` بـ `bcrypt.hash('bomba000', 12)` — **ثم أجبر تغيير كلمة المرور عند أول دخول**.
3. حوّل endpoints التجميع (`/dashboard/summary` و `/accounts/totals` و `/reports/summary`) لـ SQL Aggregations — مع الحفاظ على نفس قاعدة الاتساق: نفس مجموعة الفواتير (OPEN+POSTED+HELD) لكل الشاشات.
4. المخزون: جدول `stock_levels` + حركة تلقائية عند ترحيل الفواتير (بيع -، شراء +، مرتجع حسب النوع).
5. الطباعة: `print-js` هيفضل شغال زي ما هو لأن القالب DOM محلي — أو انقلها لطباعة خادم (PDF) لاحقًا بنفس الـ DTO.

## 5) اللي مينفعش يتنقل للفرونت أبدًا

- كلمات المرور (hashed أو غيرها) — الفرونت بيستنى mock نصي معلَّم صراحة إنه تجريبي بس.
- مفاتيح الجلسة / أسرار البيئة — كلها في `.env` (موجود `.env.example` بدون أي قيم حقيقية).
- فحوصات الصلاحيات النهائية — الفرونت UX بس، والخادم حكم.
