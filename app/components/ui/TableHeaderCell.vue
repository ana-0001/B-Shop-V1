<!-- ui/TableHeaderCell.vue — خلية رأس الجدول -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <th :class="cn('p-sm text-start font-bold whitespace-nowrap', props.class)">
    <slot />
  </th>
</template>
