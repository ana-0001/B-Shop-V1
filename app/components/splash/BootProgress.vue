<!-- components/splash/BootProgress.vue — شريط التقدم ونسبة الإقلاع -->
<script setup lang="ts">
defineProps<{
  currentStepLabel: string
  percent: number
}>()
</script>

<template>
  <div class="space-y-xs text-start">
    <div class="flex justify-between items-center text-xs font-bold">
      <span class="text-primary">{{ currentStepLabel }}</span>
      <span class="font-mono text-bg-f">{{ percent }}%</span>
    </div>
    <div
      class="w-full h-3 bg-surface-alt rounded-full overflow-hidden border border-border"
      role="progressbar"
      :aria-valuenow="percent"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="h-full bg-primary transition-all" :style="{ inlineSize: `${percent}%` }" />
    </div>
  </div>
</template>
