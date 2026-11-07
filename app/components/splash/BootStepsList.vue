<!-- components/splash/BootStepsList.vue — قائمة خطوات فحص المتطلبات الخمسة أثناء الإقلاع.
     الحالات حقيقية الآن (من useBootChecks): انتظار / جارية / نجاح / فشل -->
<script setup lang="ts">
import { CircleCheck as IconCircleCheck, CircleDot as IconCircleDot, CircleX as IconCircleX, LoaderCircle as IconLoaderCircle } from 'lucide-vue-next'
import type { BootStepState } from '@/components/splash/useBootChecks'

defineProps<{
  steps: string[]
  states: BootStepState[]
  currentIndex: number
}>()
</script>

<template>
  <div class="space-y-xs text-start text-xs border border-border rounded-lg p-sm bg-surface-alt">
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="flex items-center justify-between py-0.5"
      :class="states[index] === 'failed'
        ? 'text-err font-bold'
        : states[index] === 'passed'
          ? 'text-ok font-semibold'
          : states[index] === 'running'
            ? 'text-primary font-bold'
            : 'text-muted-f'"
    >
      <span class="flex items-center gap-xs">
        <IconCircleCheck v-if="states[index] === 'passed'" class="w-3.5 h-3.5 text-ok" />
        <IconCircleX v-else-if="states[index] === 'failed'" class="w-3.5 h-3.5 text-err" />
        <IconLoaderCircle v-else-if="states[index] === 'running'" class="w-3.5 h-3.5 text-primary animate-spin" />
        <IconCircleDot v-else class="w-3.5 h-3.5" />
        {{ step }}
      </span>
      <span class="font-mono" :class="states[index] === 'failed' ? 'text-err font-bold' : ''">
        {{ states[index] === 'passed' ? 'OK' : states[index] === 'running' ? '...' : states[index] === 'failed' ? 'FAIL' : '' }}
      </span>
    </div>
  </div>
</template>
