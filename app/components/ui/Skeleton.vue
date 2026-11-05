<!-- ui/Skeleton.vue — عنصر تحميل نابض (erp-skeleton) أثناء محاكاة جلب البيانات -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('erp-skeleton', props.class)" aria-hidden="true" />
</template>
