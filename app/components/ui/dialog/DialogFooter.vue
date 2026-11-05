<!-- ui/dialog/DialogFooter.vue — أسفل المودال (أزرار العمليات) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex items-center justify-end gap-xs border-t border-border pt-sm', props.class)">
    <slot />
  </div>
</template>
