<!-- ui/dialog/DialogHeader.vue — رأس نافذة المودال -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex items-center justify-between border-b border-border pb-sm gap-sm', props.class)">
    <slot />
  </div>
</template>
