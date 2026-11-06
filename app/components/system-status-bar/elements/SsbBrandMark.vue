<!-- system-status-bar/elements/SsbBrandMark.vue — العلامة التجارية (PRD: Center Zone Branding).
     الشعار الرسمي + اسم النظام + السطر التعريفي — رابط للرئيسية، بيختفي على الموبايل. -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import logoUrl from '@/assets/img/logo.svg'

const { t } = useI18n()
</script>

<template>
  <NuxtLink to="/" class="ssb-brand" aria-label="B-Shop Home">
    <img :src="logoUrl" alt="B-Shop Logo" class="ssb-brand-logo">
    <span class="ssb-brand-name">B-Shop</span>
    <span class="ssb-brand-tagline">{{ t('app.subtitle') }}</span>
  </NuxtLink>
</template>
