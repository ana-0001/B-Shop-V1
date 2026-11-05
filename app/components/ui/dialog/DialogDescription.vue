<!-- ui/dialog/DialogDescription.vue — وصف المودال -->
<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogDescription :class="cn('text-xs text-muted-f', props.class)">
    <slot />
  </DialogDescription>
</template>
