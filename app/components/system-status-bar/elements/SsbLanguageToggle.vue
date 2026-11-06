<!-- system-status-bar/elements/SsbLanguageToggle.vue — زر تبديل اللغة (EN ↔ AR) بنمط النيومورفيزم.
     بنفس منطق النظام المركزي: setLocale مع حفظ التفضيل + إشعار Toast. -->
<script setup lang="ts">
import { Languages as IconLanguages } from 'lucide-vue-next'
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
    class="ssb-icon-btn"
    :aria-label="t('ssb.aria.language')"
    :title="t('lang.toggleTarget')"
    data-testid="ssb-lang"
    @click="toggleLanguage"
  >
    <IconLanguages aria-hidden="true" />
    <span class="ssb-clock-label hidden sm:inline">{{ t('lang.toggleTarget') }}</span>
  </button>
</template>
