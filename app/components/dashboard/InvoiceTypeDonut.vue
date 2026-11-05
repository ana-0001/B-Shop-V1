<!-- components/dashboard/InvoiceTypeDonut.vue — دائرة توزيع أنواع الفواتير (conic-gradient زي التصميم) -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  distribution: { SALE: number; PURCHASE: number; RETURN: number }
  totalCount: number
}>()

const { t } = useI18n()

const shares = computed(() => {
  const total = props.distribution.SALE + props.distribution.PURCHASE + props.distribution.RETURN
  if (!total) return { sale: 0, purchase: 0, ret: 0 }
  return {
    sale: (props.distribution.SALE * 100) / total,
    purchase: (props.distribution.PURCHASE * 100) / total,
    ret: (props.distribution.RETURN * 100) / total,
  }
})

const donutBackground = computed(() => {
  const { sale, purchase } = shares.value
  if (!props.totalCount) return 'var(--color-surface-alt)'
  return `conic-gradient(var(--color-py) 0 ${sale}%, var(--color-ok) ${sale}% ${sale + purchase}%, var(--color-war) ${sale + purchase}% 100%)`
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-md">
    <div
      class="relative w-36 h-36 rounded-full flex items-center justify-center"
      :style="{ background: donutBackground }"
      role="img"
      aria-label="Donut chart of invoice types"
    >
      <div class="w-24 h-24 rounded-full bg-surface flex flex-col items-center justify-center">
        <strong class="text-xl font-extrabold font-mono">{{ totalCount }}</strong>
        <span class="text-xs text-muted-f">{{ t('nav.invoices') }}</span>
      </div>
    </div>

    <div class="w-full space-y-sm mt-md text-xs font-semibold">
      <div class="flex justify-between items-center">
        <span class="flex items-center gap-xs">
          <span class="w-2 h-2 rounded-full bg-primary" />{{ t('enum.type.SALE') }}
        </span>
        <span class="font-mono">{{ Math.round(shares.sale) }}%</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="flex items-center gap-xs">
          <span class="w-2 h-2 rounded-full bg-ok" />{{ t('enum.type.PURCHASE') }}
        </span>
        <span class="font-mono">{{ Math.round(shares.purchase) }}%</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="flex items-center gap-xs">
          <span class="w-2 h-2 rounded-full bg-war" />{{ t('enum.type.RETURN') }}
        </span>
        <span class="font-mono">{{ Math.round(shares.ret) }}%</span>
      </div>
    </div>
  </div>
</template>
