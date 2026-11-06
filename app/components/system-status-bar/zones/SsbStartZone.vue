<!-- system-status-bar/zones/SsbStartZone.vue — منطقة البداية (PRD: START ZONE).
     صحة النظام (نبضة) + شارة الإصدار الذهبية + وسم البيئة — بترتيب منطقي inline.
     الفواصل والمسافات em بالكامل (EM-Based Geometry) عشان الشريط يتقاس نسبيًا لوحدته. -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useSystemStatus } from '@/components/system-status-bar/composables/useSystemStatus'
import SsbPulseDot from '@/components/system-status-bar/elements/SsbPulseDot.vue'
import SsbVersionBadge from '@/components/system-status-bar/elements/SsbVersionBadge.vue'
import SsbEnvTag from '@/components/system-status-bar/elements/SsbEnvTag.vue'

const { t } = useI18n()
const { status, statusLabelKey } = useSystemStatus()
</script>

<template>
  <div class="ssb-zone ssb-zone-start" data-testid="ssb-start-zone">
    <SsbPulseDot :status="status" :label="t(statusLabelKey)" />
    <SsbVersionBadge />
    <SsbEnvTag />
  </div>
</template>
