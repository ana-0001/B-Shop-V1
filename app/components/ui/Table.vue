<!-- ui/Table.vue — عناصر الجدول الموحدة بنمط shadcn-vue (غلاف + رأس + جسم + صفوف) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <div class="overflow-x-auto">
    <table :class="cn('w-full text-start text-xs', props.class)">
      <slot />
    </table>
  </div>
</template>
