<!-- layouts/auth.vue — شل صفحات ما قبل الدخول (Splash / تسجيل الدخول / الشروط / الإعداد) -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <main class="flex-1 flex flex-col items-center justify-center p-md bg-surface-alt overflow-y-auto">
      <slot />
    </main>

    <!-- تذييل حالة الزائر — زي ملف التصميم -->
    <footer class="bg-bg border-t border-border px-md py-xs text-xs text-muted-f flex flex-wrap justify-between items-center gap-sm">
      <span class="flex items-center gap-xs">
        <span class="w-2 h-2 rounded-full bg-war" aria-hidden="true" />
        <span>{{ t('splash.guestStatus') }}</span>
        <span class="border-s border-border ps-md">{{ t('splash.dbMode') }}</span>
      </span>
      <span class="font-mono">{{ t('splash.fiscalBuild') }}</span>
    </footer>
  </div>
</template>
