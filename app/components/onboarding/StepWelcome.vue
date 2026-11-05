<!-- components/onboarding/StepWelcome.vue — الخطوة 1: الترحيب -->
<script setup lang="ts">
import { Handshake as IconHandshake } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <div class="text-center space-y-md">
    <div class="w-16 h-16 mx-auto rounded-full bg-primary text-primary-f flex items-center justify-center text-2xl shadow-md">
      <IconHandshake class="w-8 h-8" />
    </div>
    <h2 class="text-xl font-extrabold text-bg-f">{{ t('onboard.step1Title') }}</h2>
    <p class="text-xs text-muted-f max-w-[28rem] mx-auto">{{ t('onboard.step1Desc') }}</p>
  </div>
</template>
