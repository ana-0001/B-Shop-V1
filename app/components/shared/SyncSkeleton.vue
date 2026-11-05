<!-- shared/SyncSkeleton.vue — غلاف الـ Skeleton اللي بيظهر أثناء مزامنة الـ API -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import Skeleton from '@/components/ui/Skeleton.vue'

const { t } = useI18n()
const { isSyncing } = useAppData()
</script>

<template>
  <div v-if="isSyncing" class="erp-section space-y-md" aria-busy="true" :aria-label="t('common.loading')">
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-sm">
      <div v-for="index in 4" :key="index" class="erp-card space-y-sm">
        <Skeleton class="h-4 w-28" />
        <Skeleton class="h-7 w-36" />
        <Skeleton class="h-3 w-44" />
      </div>
    </div>
    <div class="erp-card space-y-sm">
      <Skeleton class="h-5 w-48" />
      <Skeleton class="h-44 w-full" />
    </div>
  </div>
</template>
