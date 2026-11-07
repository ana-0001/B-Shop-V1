<!-- components/dashboard/StatCard.vue — بطاقة إحصائية للوحة التحكم (أيقونة + قيمة + وصف) -->
<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps<{
  title: string
  value: string
  sub?: string
  /** أيقونة lucide-vue-next — Functional Component فعلاً مش object عادي */
  icon: Component
  iconClass?: string
  class?: string
}>()
</script>

<template>
  <article :class="cn('erp-card bg-glass', props.class)">
    <div class="flex items-center justify-between text-xs font-bold text-muted-f">
      <span>{{ props.title }}</span>
      <span :class="cn('w-9 h-9 rounded bg-surface-alt flex items-center justify-center', props.iconClass)">
        <component :is="props.icon" class="w-4 h-4" />
      </span>
    </div>
    <div class="text-xl font-extrabold text-bg-f mt-sm font-mono">{{ props.value }}</div>
    <div v-if="props.sub" class="text-xs text-muted-f mt-xs">{{ props.sub }}</div>
  </article>
</template>
