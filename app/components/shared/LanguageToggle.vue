<!-- shared/LanguageToggle.vue — زر تبديل اللغة (EN ↔ AR) مع حفظ التفضيل -->
<script setup lang="ts">
import { Globe as IconGlobe } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'

const { t, locale, setLocale } = useI18n()
const { toast } = useSonner()

function toggleLanguage(): void {
  const next = locale.value === 'en' ? 'ar' : 'en'
  setLocale(next, true)
  toast.info(t(next === 'ar' ? 'notif.langSetAr' : 'notif.langSetEn'))
}
</script>

<template>
  <button
    type="button"
    class="titlebar-btn h-7 px-sm flex items-center gap-xs rounded hover:bg-hover text-xs font-bold text-bg-f border border-border"
    :title="t('lang.toggleTarget')"
    :aria-label="t('lang.toggleTarget')"
    @click="toggleLanguage"
  >
    <IconGlobe class="w-3.5 h-3.5 text-accent" />
    <span>{{ t('lang.toggleTarget') }}</span>
  </button>
</template>
