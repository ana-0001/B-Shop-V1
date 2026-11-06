<!-- system-status-bar/elements/SsbPulseDot.vue — نقطة النبضة الحية (PRD: System Health Pulse).
     بتعرض حالة النظام بلون متدرج (أخضر/أصفر/أحمر) مع aria-live="polite" حسب SOP الوصولية. -->
<script setup lang="ts">
import type { SsbHealthStatus } from '@/components/system-status-bar/types'

const props = defineProps<{
  /** حالة صحة النظام الحالية */
  status: SsbHealthStatus
  /** النص التوضيحي المجاور للنبضة (مفتاح ترجمة جاهز العرض) */
  label?: string
}>()
</script>

<template>
  <span class="ssb-pulse" role="status" aria-live="polite" :data-status="props.status">
    <span class="ssb-pulse-dot" aria-hidden="true" />
    <span v-if="props.label" class="ssb-pulse-label">{{ props.label }}</span>
  </span>
</template>
