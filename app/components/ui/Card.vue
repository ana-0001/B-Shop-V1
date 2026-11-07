<!-- ui/Card.vue — بطاقة النظام الموحدة (erp-card) مع أجزائها -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <article :class="cn('erp-card bg-glass', props.class)">
    <slot />
  </article>
</template>
