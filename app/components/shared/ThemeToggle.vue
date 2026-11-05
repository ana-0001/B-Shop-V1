<!-- shared/ThemeToggle.vue — زر تدوير الثيم (Light → Dark → System) بنفس سلوك التصميم -->
<script setup lang="ts">
import { Sun as IconSun, Moon as IconMoon, Monitor as IconMonitor } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'

const { t } = useI18n()
const { toast } = useSonner()
const preferences = usePreferencesStore()

const themeMeta = computed(() => {
  switch (preferences.theme) {
    case 'dark':
      return { icon: IconMoon, iconClass: 'text-primary', label: t('theme.dark') }
    case 'system':
      return { icon: IconMonitor, iconClass: 'text-accent', label: t('theme.system') }
    default:
      return { icon: IconSun, iconClass: 'text-war', label: t('theme.light') }
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
    class="titlebar-btn h-7 px-sm flex items-center gap-xs rounded hover:bg-hover text-xs font-semibold text-bg-f border border-border"
    :title="`${t('theme.light')} / ${t('theme.dark')} / ${t('theme.system')}`"
    aria-label="Toggle Theme"
    @click="cycleTheme"
  >
    <component :is="themeMeta.icon" class="w-3.5 h-3.5" :class="themeMeta.iconClass" />
    <span class="hidden sm:inline">{{ themeMeta.label }}</span>
  </button>
</template>
