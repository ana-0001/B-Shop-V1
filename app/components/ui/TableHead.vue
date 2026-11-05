<!-- ui/TableHead.vue — صف رأس الجدول -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <thead :class="cn('bg-surface-alt text-muted-f', props.class)">
    <slot />
  </thead>
</template>
