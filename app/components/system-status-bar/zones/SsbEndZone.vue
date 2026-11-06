<!-- system-status-bar/zones/SsbEndZone.vue — منطقة النهاية (PRD: END ZONE).
     الساعة الحية + تبديل الثيم + تبديل اللغة + إشعارات Popover + إعدادات Drawer
     + أزرار تحكم النافذة (Tauri فقط) — بترتيب منطقي inline-start→inline-end. -->
<script setup lang="ts">
import SsbLiveClock from '@/components/system-status-bar/elements/SsbLiveClock.vue'
import SsbThemeToggle from '@/components/system-status-bar/elements/SsbThemeToggle.vue'
import SsbLanguageToggle from '@/components/system-status-bar/elements/SsbLanguageToggle.vue'
import SsbNotificationBell from '@/components/system-status-bar/elements/SsbNotificationBell.vue'
import SsbSettingsTrigger from '@/components/system-status-bar/elements/SsbSettingsTrigger.vue'
import WindowControls from '@/components/shared/WindowControls.vue'
</script>

<template>
  <div class="flex items-center gap-1" data-testid="ssb-end-zone">
    <SsbLiveClock />
    <span class="w-px h-3 bg-border mx-0.5" aria-hidden="true" />
    <SsbThemeToggle />
    <SsbLanguageToggle />
    <span class="w-px h-3 bg-border mx-0.5" aria-hidden="true" />
    <SsbNotificationBell />
    <SsbSettingsTrigger />
    <WindowControls />
  </div>
</template>
