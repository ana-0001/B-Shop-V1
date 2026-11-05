<!-- ui/Separator.vue — فاصل أفقي/رأسي موحد -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    class?: string
  }>(),
  { orientation: 'horizontal' },
)
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="cn(
      'bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      props.class,
    )"
  />
</template>
