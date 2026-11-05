/**
 * app/alias/index.ts — نقطة الاستيراد المركزية للمشروع (Alias Barrel).
 * كل الاستيرادات في المشروع بتتم عبر @/ بدل المسارات النسبية الطويلة،
 * والملف ده بيجمع أهم الوحدات المشتركة (أنواع + أدوات مساعدة + ثوابت) في مكان واحد.
 */
export * from '@/types'
export * from '@/utils/format'
export * from '@/utils/dates'
export * from '@/utils/identifier'
export * from '@/utils/permissions'
export * from '@/utils/invoice'
export * from '@/utils/constants'
