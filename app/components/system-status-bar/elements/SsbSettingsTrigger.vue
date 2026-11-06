<!-- system-status-bar/elements/SsbSettingsTrigger.vue — زر فتح درج الإعدادات (PRD: Settings Drawer). -->
<script setup lang="ts">
import { Settings2 as IconSettings2 } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

/** حالة فتح الدرج — حالة مشتركة مع SettingsDrawer */
const settingsOpen = useState('bshop:ssbSettingsOpen', () => false)
</script>

<template>
  <button
    type="button"
    class="ssb-icon-btn"
    :aria-label="t('ssb.aria.settings')"
    :title="t('ssb.aria.settings')"
    aria-haspopup="dialog"
    :aria-expanded="settingsOpen"
    data-testid="ssb-settings"
    @click="settingsOpen = true"
  >
    <IconSettings2 aria-hidden="true" />
  </button>
</template>
