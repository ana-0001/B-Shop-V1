<!-- system-status-bar/zones/SsbEndZone.vue — منطقة النهاية (PRD: END ZONE).
     الساعة الحية + وسم نسخة الفِسقال (منقول من الفوتر القديم زي ما كان جنب الساعة)
     + إشعارات Popover + إعدادات Drawer — بترتيب منطقي inline-start→inline-end.
     ملاحظة: تبديل الثيم/اللغة وأزرار النافذة في الهيدر المستعاد (AppTitleBar) فما بنكررها هنا.
     الفواصل والمسافات em بالكامل (EM-Based Geometry). -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import SsbLiveClock from '@/components/system-status-bar/elements/SsbLiveClock.vue'
import SsbNotificationBell from '@/components/system-status-bar/elements/SsbNotificationBell.vue'
import SsbSettingsTrigger from '@/components/system-status-bar/elements/SsbSettingsTrigger.vue'

const { t } = useI18n()
</script>

<template>
  <div class="ssb-zone ssb-zone-end" data-testid="ssb-end-zone">
    <SsbLiveClock />
    <span class="ssb-separator" aria-hidden="true" />
    <span class="ssb-fiscal-tag" data-testid="ssb-fiscal">{{ t('splash.fiscalBuild') }}</span>
    <span class="ssb-separator" aria-hidden="true" />
    <SsbNotificationBell />
    <SsbSettingsTrigger />
  </div>
</template>
