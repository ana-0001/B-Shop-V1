<!-- components/onboarding/StepComplete.vue — الخطوة 4: ملخص الإكمال -->
<script setup lang="ts">
import { CheckCheck as IconCheckCheck } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  displayName: string
  jobTitle: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="text-center space-y-md">
    <div class="w-16 h-16 mx-auto rounded-full bg-ok text-ok-f flex items-center justify-center text-2xl shadow-md">
      <IconCheckCheck class="w-8 h-8" />
    </div>
    <h2 class="text-xl font-extrabold text-bg-f">{{ t('onboard.step4Title') }}</h2>
    <p class="text-xs text-muted-f">
      {{ t('onboard.summary', { name: props.displayName, job: props.jobTitle || '—' }) }}
    </p>
  </div>
</template>
