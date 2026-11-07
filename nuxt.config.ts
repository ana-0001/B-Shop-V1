/**
 * ملف إعداد Nuxt الرئيسي لمشروع B-Shop.
 * - المصدر الكامل للتطبيق داخل مجلد app/ (srcDir) عشان نلتزم بهيكل الخطة،
 *   والـ alias الافتراضي @/ بيشاور على srcDir تلقائيًا (نقطة الاستيراد المركزية app/alias/index.ts).
 * - ssr: false عشان التطبيق ERP سطح مكتب (Tauri) يعمل SPA ويشتغل مع قاعدة Mock محلية.
 * - الموديولات: Pinia + Persisted State + nuxt-auth-utils (واجهة المصادقة) + ESLint.
 */

export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  // مجلد التطبيق الرئيسي — كل صفحات ومكونات ومتاجر المشروع جواه
  srcDir: 'app/',

  // تطبيق ERP يعمل كـ SPA (متوافق مع Tauri ووضع الـ Mock الكامل على العميل)
  ssr: false,

  // منع شاشة التحميل الافتراضية — عندنا صفحة Splash خاصة
  spaLoadingTemplate: false,

  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-auth-utils',
    '@nuxt/eslint',
  ],

  // ملفات CSS العامة: خطوط Inter / Cairo / JetBrains Mono + توكنز الثيم
  css: [
    '@fontsource-variable/inter',
    '@fontsource-variable/cairo',
    '@fontsource-variable/jetbrains-mono',
    '@/assets/css/main.css',
  ],

  // إعداد Tailwind CSS عبر PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      // وضع المحاكاة: true = كل الـ endpoints تتنفذ من طبقة الـ Mock المحلية
      apiMock: true,
      // رابط الـ API الحقيقي (يُستخدم عند التحويل للباك إند — راجع docs/06-backend-migration.md)
      apiBaseUrl: '/api',
      appName: 'B-Shop',
      appVersion: '1.3.1',
    },
  },

  devServer: {
    port: 3000,
  },

  // السماح بالوصول لسيرفر التطوير عبر أي دومين (روابط المعاينة/البروكسي)
  // Vite بيمنع الـ hosts غير المعرّفة افتراضيًا، فبنسمح بالكل في بيئة التطوير فقط
  vite: {
    server: {
      allowedHosts: true,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      title: 'B-Shop ERP — Integrated POS, Billing & Inventory System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'B-Shop ERP & POS System — Billing, Inventory, Accounts and Reports.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  eslint: {
    config: {
      stylistic: false,
    },
  },

  typescript: {
    strict: true,
    // فحص الأنواع بنشغّله يدويًا بأمر npm run typecheck
    typeCheck: false,
  },
})
