<!-- ui/Label.vue — عنوان حقل موحد (بنفس نمط shadcn-vue) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  for?: string
  class?: string
}>()
</script>

<template>
  <label :for="props.for" :class="cn('block text-xs font-bold text-bg-f mb-xs', props.class)">
    <slot />
  </label>
</template>
