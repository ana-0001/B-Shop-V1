<!-- system-status-bar/SystemStatusBar.vue — شريط الحالة النظامي الموحد (Main Entry).
     التنفيذ الكامل لـ PRD (07-1-PRD-StatusBar.md) بنسخة Vue 3 المكافئة:
     - START: صحة النظام (نبضة) + شارة الإصدار + وسم البيئة.
     - CENTER: العلامة التجارية (شعار + اسم + سطر تعريفي).
     - END: ساعة 12h مع Tooltip (24h القاهرة + ميلادي + هجري أم القرى) + ثيم + لغة
       + إشعارات Popover + إعدادات Drawer + أزرار النافذة (Tauri).
     المناطق مقسومة بخصائص منطقية (Start/End) لانعكاس RTL/LTR سلس. -->
<script setup lang="ts">
import '@/components/system-status-bar/status-bar.css'
import SsbStartZone from '@/components/system-status-bar/zones/SsbStartZone.vue'
import SsbCenterZone from '@/components/system-status-bar/zones/SsbCenterZone.vue'
import SsbEndZone from '@/components/system-status-bar/zones/SsbEndZone.vue'
import SettingsDrawer from '@/components/system-status-bar/SettingsDrawer.vue'
import { useSystemStatus } from '@/components/system-status-bar/composables/useSystemStatus'

/** حالة الصحة على جذر الشريط (للتنسيق الشرطي لألوان النبضة) */
const { status } = useSystemStatus()
</script>

<template>
  <header
    class="ssb"
    :data-health="status"
    role="banner"
    aria-label="System Status Bar"
    data-testid="system-status-bar"
  >
    <!-- [START ZONE]: صحة النظام + الإصدار + البيئة -->
    <SsbStartZone />

    <!-- [CENTER ZONE]: العلامة التجارية -->
    <SsbCenterZone />

    <!-- [END ZONE]: الساعة + التبديلات + الإشعارات + الإعدادات + النافذة -->
    <SsbEndZone />

    <!-- درج الإعدادات الجانبي -->
    <SettingsDrawer />
  </header>
</template>
