<!-- system-status-bar/elements/SsbVersionBadge.vue — شارة الإصدار الذهبية (PRD: Version Badge).
     بتقرأ رقم الإصدار من runtimeConfig وتعرض نسخة الفِسقال في tooltip. -->
<script setup lang="ts">
const config = useRuntimeConfig()
const { t } = useI18n()

/** رقم إصدار التطبيق من الإعدادات المركزية */
const version = config.public.appVersion as string
</script>

<template>
  <span
    class="ssb-version-badge"
    :title="`${t('splash.fiscalBuild')} — ${t('app.subtitle')}`"
    data-testid="ssb-version"
  >
    v{{ version }}
  </span>
</template>
