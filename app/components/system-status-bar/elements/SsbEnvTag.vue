<!-- system-status-bar/elements/SsbEnvTag.vue — وسم البيئة (PRD: Environment Tag).
     DEV في وضع التطوير و PROD في البناء النهائي — بحدود متقطعة مميزة. -->
<script setup lang="ts">
const { t } = useI18n()

/** بيئة التشغيل الحالية */
const isDev = import.meta.dev
const envLabel = computed(() => (isDev ? t('ssb.env.dev') : t('ssb.env.prod')))
</script>

<template>
  <span class="ssb-env-tag" :data-env="isDev ? 'dev' : 'prod'" data-testid="ssb-env">
    {{ envLabel }}
  </span>
</template>
