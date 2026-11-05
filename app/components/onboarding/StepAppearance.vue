<!-- components/onboarding/StepAppearance.vue — الخطوة 3: الثيم واللغة -->
<script setup lang="ts">
import { Sun as IconSun, Moon as IconMoon, Monitor as IconMonitor } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { usePreferencesStore } from '@/stores/preferences'
import { useSonner } from '@/composables/useSonner'

const { t } = useI18n()
const { toast } = useSonner()
const preferences = usePreferencesStore()

const themeOptions = [
  { key: 'light', icon: IconSun },
  { key: 'dark', icon: IconMoon },
  { key: 'system', icon: IconMonitor },
] as const

function pickTheme(mode: 'light' | 'dark' | 'system'): void {
  preferences.setTheme(mode)
  toast.info(t('notif.themeSet', { mode: mode.toUpperCase() }))
}

function pickLocale(locale: 'en' | 'ar'): void {
  preferences.setLocale(locale)
  toast.info(t(locale === 'ar' ? 'notif.langSetAr' : 'notif.langSetEn'))
}
</script>

<template>
  <div class="space-y-md">
    <h2 class="text-lg font-extrabold text-bg-f">{{ t('onboard.step3Title') }}</h2>

    <div>
      <span class="block text-xs font-bold text-bg-f mb-xs">{{ t('onboard.themeLabel') }}</span>
      <div class="grid grid-cols-3 gap-sm">
        <button
          v-for="option in themeOptions"
          :key="option.key"
          type="button"
          class="p-sm rounded border text-xs font-bold flex flex-col items-center gap-xs transition-all"
          :class="preferences.theme === option.key
            ? 'bg-primary text-primary-f border-primary shadow-sm'
            : 'bg-surface-alt text-bg-f border-border hover:bg-hover'"
          :aria-pressed="preferences.theme === option.key"
          @click="pickTheme(option.key)"
        >
          <component :is="option.icon" class="w-5 h-5" />
          <span>{{ t(`theme.${option.key}`) }}</span>
        </button>
      </div>
    </div>

    <div>
      <span class="block text-xs font-bold text-bg-f mb-xs">{{ t('onboard.languageLabel') }}</span>
      <div class="grid grid-cols-2 gap-sm">
        <button
          type="button"
          class="p-sm rounded border text-xs font-bold transition-all"
          :class="preferences.locale === 'en'
            ? 'bg-primary text-primary-f border-primary shadow-sm'
            : 'bg-surface-alt text-bg-f border-border hover:bg-hover'"
          :aria-pressed="preferences.locale === 'en'"
          @click="pickLocale('en')"
        >
          {{ t('onboard.langEn') }}
        </button>
        <button
          type="button"
          class="p-sm rounded border text-xs font-bold transition-all"
          :class="preferences.locale === 'ar'
            ? 'bg-primary text-primary-f border-primary shadow-sm'
            : 'bg-surface-alt text-bg-f border-border hover:bg-hover'"
          :aria-pressed="preferences.locale === 'ar'"
          @click="pickLocale('ar')"
        >
          {{ t('onboard.langAr') }}
        </button>
      </div>
    </div>
  </div>
</template>
