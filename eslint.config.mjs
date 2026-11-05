/**
 * إعداد ESLint لمشروع B-Shop — مبني على كونفج Nuxt الرسمي.
 * - إيقاف قاعدة أسماء المكونات متعددة الكلمات (الصفحات زي index.vue و terms.vue مقصودة كده).
 * - السماح بـ console في وضع التطوير فقط لأغراض الـ debugging.
 */
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      // الخصائص الاختيارية في مكوناتنا مقصود إنها undefined افتراضيًا (نمط shadcn-vue)
      'vue/require-default-prop': 'off',
      // بنفصل استيرادات الأنواع (import type) عن استيرادات القيم عن قصد —
      // عشان كده بنسمح بأكثر من استيراد من نفس الوحدة
      'import/no-duplicates': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['.output/**', '.nuxt/**', 'node_modules/**', 'src-tauri/target/**', 'public/**'],
  },
)
