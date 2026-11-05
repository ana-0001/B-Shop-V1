<!-- ui/dialog/DialogTitle.vue — عنوان المودال -->
<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogTitle :class="cn('text-lg font-extrabold text-bg-f', props.class)">
    <slot />
  </DialogTitle>
</template>
