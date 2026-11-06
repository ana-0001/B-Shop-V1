<!-- system-status-bar/elements/SsbThemeToggle.vue — زر تدوير الثيم بنمط النيومورفيزم.
     نفس سلوك النظام (Light → Dark → System) مع أيقونة تعبر عن الوضع الحالي. -->
<script setup lang="ts">
import { Sun as IconSun, Moon as IconMoon, Monitor as IconMonitor } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'

const { t } = useI18n()
const { toast } = useSonner()
const preferences = usePreferencesStore()

/** الأيقونة والوصف حسب وضع الثيم الحالي */
const themeMeta = computed(() => {
  switch (preferences.theme) {
    case 'dark':
      return { icon: IconMoon, label: t('theme.dark') }
    case 'system':
      return { icon: IconMonitor, label: t('theme.system') }
    default:
      return { icon: IconSun, label: t('theme.light') }
  }
})

function cycleTheme(): void {
  const next = preferences.cycleTheme()
  toast.info(t('notif.themeSet', { mode: next.toUpperCase() }))
}
</script>

<template>
  <button
    type="button"
    class="ssb-icon-btn"
    :aria-label="`${t('ssb.aria.theme')} — ${themeMeta.label}`"
    :title="themeMeta.label"
    data-testid="ssb-theme"
    @click="cycleTheme"
  >
    <component :is="themeMeta.icon" aria-hidden="true" />
    <span class="ssb-clock-label hidden sm:inline">{{ themeMeta.label }}</span>
  </button>
</template>
