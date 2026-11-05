<!-- ui/TableBody.vue — جسم الجدول -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <tbody :class="cn('divide-y divide-border', props.class)">
    <slot />
  </tbody>
</template>
