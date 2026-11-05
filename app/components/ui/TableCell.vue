<!-- ui/TableCell.vue — خلية بيانات في الجدول -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <td :class="cn('p-sm align-middle', props.class)">
    <slot />
  </td>
</template>
