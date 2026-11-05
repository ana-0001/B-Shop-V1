<!-- pages/[...slug].vue — التقاط كل المسارات غير الموجودة (404) -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import ErrorState from '@/components/shared/ErrorState.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

useHead({ title: 'B-Shop — 404' })

/** التوجيه لأعلى من الصفحة نفسها — الأزرار جوه ErrorState */
void t
</script>

<template>
  <ErrorState code="404" />
</template>
