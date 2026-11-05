<!-- components/onboarding/OnboardingStepper.vue — مؤشر تقدم خطوات الإعداد الأربع -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  current: number
  total?: number
}>()

const { t } = useI18n()
const totalSteps = computed(() => props.total ?? 4)
</script>

<template>
  <div class="space-y-xs">
    <div class="flex justify-between items-center text-xs font-bold text-muted-f">
      <span>{{ t('onboard.wizardLabel') }}</span>
      <span class="font-mono text-primary">{{ t('onboard.stepCounter', { current, total: totalSteps }) }}</span>
    </div>
    <div class="grid grid-cols-4 gap-xs" aria-hidden="true">
      <div
        v-for="step in totalSteps"
        :key="step"
        class="h-2 rounded-full transition-all"
        :class="step <= current ? 'bg-primary' : 'bg-surface-alt border border-border'"
      />
    </div>
  </div>
</template>
