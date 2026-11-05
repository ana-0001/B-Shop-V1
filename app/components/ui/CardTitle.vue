<!-- ui/CardTitle.vue — عنوان البطاقة -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <h2 :class="cn('font-extrabold text-bg-f', props.class)">
    <slot />
  </h2>
</template>
