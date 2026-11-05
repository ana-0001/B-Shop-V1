<!-- shared/AppLogo.vue — الشعار الرسمي للمشروع (Logo-favicon.svg) مع نص العلامة -->
<script setup lang="ts">
import { cn } from '@/utils/cn'
import logoUrl from '@/assets/img/logo.svg'

const props = withDefaults(
  defineProps<{
    /** عرض الشعار بوحدات rem (بدون px) */
    size?: 'sm' | 'md' | 'lg'
    withText?: boolean
    class?: string
  }>(),
  { size: 'md', withText: false },
)

const sizeClass = computed(() => ({
  sm: 'w-6 h-6',
  md: 'w-9 h-9',
  lg: 'w-16 h-16',
}[props.size]))
</script>

<template>
  <span :class="cn('inline-flex items-center gap-xs', props.class)">
    <img
      :src="logoUrl"
      alt="B-Shop Logo"
      :class="cn(sizeClass, 'object-contain rounded bg-surface-alt border border-border p-0.5')"
    >
    <span v-if="withText" class="font-extrabold text-sm tracking-wide text-bg-f">B-Shop</span>
  </span>
</template>
