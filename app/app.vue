<!-- app/app.vue — الجذر الرئيسي للتطبيق.
     - إطار التطبيق الخارجي (app-shell-frame) زي ملف التصميم بالظبط.
     - مزامنة الثيم (light/dark/system) واللغة (ltr/rtl) مع وسم html.
     - شريط الحالة النظامي الموحد (SystemStatusBar وفق PRD) + إشعارات Vue Sonner. -->
<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useI18n } from '@/composables/useI18n'
import SystemStatusBar from '@/components/system-status-bar/SystemStatusBar.vue'

const preferences = usePreferencesStore()
const { dir, locale } = useI18n()

/** الثيم المحسوم فعليًا (system بيتحول لـ light/dark حسب نظام التشغيل) */
const resolvedTheme = ref<'light' | 'dark'>('light')
let mediaQuery: MediaQueryList | null = null

function resolveTheme(): void {
  const prefersDark = mediaQuery?.matches ?? false
  resolvedTheme.value = preferences.theme === 'system' ? (prefersDark ? 'dark' : 'light') : preferences.theme
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', resolveTheme)
  resolveTheme()
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', resolveTheme)
})

watch(() => preferences.theme, resolveTheme)

// تطبيق الثيم على وسم html
watch(resolvedTheme, (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}, { immediate: true })

// تطبيق اللغة والاتجاه على وسم html
watch(locale, (next) => {
  document.documentElement.setAttribute('lang', next === 'ar' ? 'ar-EG' : 'en')
  document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
}, { immediate: true })

/** موضع الإشعارات حسب الاتجاه */
const toastPosition = computed(() => (dir.value === 'rtl' ? 'bottom-left' : 'bottom-right') as 'bottom-left' | 'bottom-right')
</script>

<template>
  <div class="min-h-screen bg-bg p-sm flex">
    <div class="app-shell-frame">
      <SystemStatusBar />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <Toaster
      :theme="resolvedTheme"
      :position="toastPosition"
      :dir="dir"
      :duration="3600"
      close-button
      rich-colors
    />
  </div>
</template>
