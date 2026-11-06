<!-- shared/AppTitleBar.vue — شريط العنوان العلوي الموحد (العلامة + اللغة + الثيم + النافذة) -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import AppLogo from '@/components/shared/AppLogo.vue'
import LanguageToggle from '@/components/shared/LanguageToggle.vue'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import WindowControls from '@/components/shared/WindowControls.vue'

const { t } = useI18n()
</script>

<template>
  <header class="titlebar bg-bg text-bg-f flex justify-between items-center px-md border-b border-border gap-sm">
    <NuxtLink to="/" class="flex items-center gap-sm font-extrabold text-sm" aria-label="B-Shop Home">
      <AppLogo size="sm" />
      <span class="bg-primary text-primary-f px-sm py-0.5 rounded text-xs tracking-wider">B-SHOP</span>
      <span class="hidden md:inline text-muted-f font-semibold text-xs">{{ t('app.subtitle') }}</span>
    </NuxtLink>

    <div class="titlebar-controls flex items-center gap-xs">
      <LanguageToggle />
      <ThemeToggle />
      <WindowControls />
    </div>
  </header>
</template>
