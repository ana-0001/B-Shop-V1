<!-- ui/CardHeader.vue — رأس البطاقة (عنوان + وصف) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <header :class="cn('flex flex-wrap justify-between items-center gap-xs mb-sm', props.class)">
    <slot />
  </header>
</template>
