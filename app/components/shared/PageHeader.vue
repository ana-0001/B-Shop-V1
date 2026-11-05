<!-- shared/PageHeader.vue — رأس صفحة موحد (كِكر + عنوان + وصف + أزرار) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  kicker?: string
  kickerClass?: string
  title: string
  subtitle?: string
  class?: string
}>()
</script>

<template>
  <div :class="cn('flex flex-wrap items-center justify-between gap-sm', props.class)">
    <div>
      <p v-if="kicker" :class="cn('text-xs font-bold mb-xs', kickerClass)">{{ kicker }}</p>
      <h1 class="text-xl font-extrabold text-bg-f">{{ title }}</h1>
      <p v-if="subtitle" class="text-xs text-muted-f mt-xs">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-xs">
      <slot name="actions" />
    </div>
  </div>
</template>
