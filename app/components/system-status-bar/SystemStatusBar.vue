<!-- system-status-bar/SystemStatusBar.vue — شريط الحالة النظامي الموحد (Main Entry).
     التنفيذ الكامل لـ PRD (07-1-PRD-StatusBar.md) بنسخة Vue 3 المكافئة — كموقع في الفوتر:
     - START: صحة النظام (نبضة) + شارة الإصدار + وسم البيئة.
     - END: ساعة 12h مع Tooltip (24h القاهرة + ميلادي + هجري أم القرى)
       + إشعارات Popover + إعدادات Drawer.
     - الهيدر (AppTitleBar) المستعاد يملك العلامة التجارية والثيم واللغة وأزرار النافذة،
       فما بنكررها هنا — الفوتر مخصص لحالة النظام والوقت والإشعارات والإعدادات.
     المناطق مقسومة بخصائص منطقية (Start/End) لانعكاس RTL/LTR سلس. -->
<script setup lang="ts">
import '@/components/system-status-bar/status-bar.css'
import SsbStartZone from '@/components/system-status-bar/zones/SsbStartZone.vue'
import SsbEndZone from '@/components/system-status-bar/zones/SsbEndZone.vue'
import SettingsDrawer from '@/components/system-status-bar/SettingsDrawer.vue'
import { useSystemStatus } from '@/components/system-status-bar/composables/useSystemStatus'

/** حالة الصحة على جذر الشريط (للتنسيق الشرطي لألوان النبضة) */
const { status } = useSystemStatus()
</script>

<template>
  <footer
    class="ssb"
    :data-health="status"
    role="contentinfo"
    aria-label="System Status Bar"
    data-testid="system-status-bar"
  >
    <!-- [START ZONE]: صحة النظام + الإصدار + البيئة -->
    <SsbStartZone />

    <!-- [END ZONE]: الساعة + الإشعارات + الإعدادات -->
    <SsbEndZone />

    <!-- درج الإعدادات الجانبي -->
    <SettingsDrawer />
  </footer>
</template>
