<!-- components/splash/BootStepsList.vue — قائمة خطوات الفحص الخمسة أثناء الإقلاع -->
<script setup lang="ts">
import { CircleCheck as IconCircleCheck, CircleDot as IconCircleDot, LoaderCircle as IconLoaderCircle } from 'lucide-vue-next'

defineProps<{
  steps: string[]
  currentIndex: number
}>()
</script>

<template>
  <div class="space-y-xs text-start text-xs border border-border rounded-lg p-sm bg-surface-alt">
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="flex items-center justify-between py-0.5"
      :class="index === currentIndex ? 'text-primary font-bold' : index < currentIndex ? 'text-ok font-semibold' : 'text-muted-f'"
    >
      <span class="flex items-center gap-xs">
        <IconCircleCheck v-if="index < currentIndex" class="w-3.5 h-3.5 text-ok" />
        <IconLoaderCircle v-else-if="index === currentIndex" class="w-3.5 h-3.5 text-primary animate-spin" />
        <IconCircleDot v-else class="w-3.5 h-3.5" />
        {{ step }}
      </span>
      <span class="font-mono">{{ index < currentIndex ? 'OK' : index === currentIndex ? '...' : '' }}</span>
    </div>
  </div>
</template>
