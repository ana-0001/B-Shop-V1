<!-- ui/TableRow.vue — صف الجدول مع تأثير التحويم -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string; clickable?: boolean }>()
</script>

<template>
  <tr :class="cn('hover:bg-hover', clickable && 'cursor-pointer', props.class)">
    <slot />
  </tr>
</template>
