<!-- ui/CardDescription.vue — وصف البطاقة الصغير -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <p :class="cn('text-xs text-muted-f mt-xs', props.class)">
    <slot />
  </p>
</template>
