<!-- system-status-bar/elements/SsbTabsChip.vue — رقاقة التبويبات المفتوحة.
     محتوى منقول من الفوتر القديم (shared/StatusBar.vue) جوه الشريط الجديد:
     عدد تبويبات الفواتير المفتوحة في مساحة العمل (تفاعلية مع كل فتح/غلق/تعليق).
     رقاقة عرض فقط — العدّاد بخط mono وأرقام جدولية، وكل الأبعاد em نسبية لمرساة --ssb-em. -->
<script setup lang="ts">
import { Layers as IconLayers } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'

const { t } = useI18n()
const invoicesStore = useInvoicesStore()
</script>

<template>
  <span class="ssb-chip ssb-tabs-chip" :title="t('ssb.tabs')" data-testid="ssb-tabs">
    <IconLayers aria-hidden="true" />
    <span class="ssb-chip-label">{{ t('ssb.tabs') }}</span>
    <strong class="ssb-chip-value ssb-tabs-count">{{ invoicesStore.tabs.length }}</strong>
  </span>
</template>
