<!-- pages/inventory.vue — المخازن والأصناف: فلتر الفرع + بحث + جدول TanStack Table قابل للفرز -->
<script setup lang="ts">
import { h  } from 'vue'
import type {Component} from 'vue';
import type { ColumnDef } from '@tanstack/vue-table'
import { useI18n } from '@/composables/useI18n'
import { useAppData } from '@/composables/useAppData'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { useInvoicesStore } from '@/stores/invoices'
import { usePreferencesStore } from '@/stores/preferences'
import { inventoryApi } from '@/services/api/endpoints'
import { formatNumber } from '@/utils/format'
import { localizedEntityName } from '@/types'
import type { InventoryRow } from '@/types'
import { LOW_STOCK_THRESHOLD } from '@/utils/constants'
import PageHeader from '@/components/shared/PageHeader.vue'
import SyncSkeleton from '@/components/shared/SyncSkeleton.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import DataTable from '@/components/shared/DataTable.vue'
import Select from '@/components/ui/Select.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import { Boxes as IconBoxes, Package as IconPackage, Warehouse as IconWarehouse } from 'lucide-vue-next'

definePageMeta({ middleware: ['super-bomba'] })

const { t, locale } = useI18n()
const { onDataRefresh } = useAppData()
const { meta, load } = useSystemMeta()
const invoicesStore = useInvoicesStore()
const preferences = usePreferencesStore()

const rows = ref<InventoryRow[]>([])
const isLoading = ref(true)
const searchQuery = ref('')

async function fetchInventory(): Promise<void> {
  isLoading.value = true
  try {
    rows.value = await inventoryApi.list(invoicesStore.tabs, preferences.currentBranchId)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await load()
  await fetchInventory()
})
onDataRefresh(fetchInventory)
watch(() => preferences.currentBranchId, fetchInventory)
watch(locale, fetchInventory)

/** إجماليات ملخص المخازن */
const summary = computed(() => {
  const relevantInvoices = rows.value.length
    ? rows.value
    : []
  const billedUnits = rows.value.reduce((sum, row) => sum + row.unitsBilled, 0)
  const branchesCount = preferences.currentBranchId === 'ALL' ? (meta.value?.branches.length ?? 0) : 1
  void relevantInvoices
  return {
    skuCount: rows.value.length,
    billedUnits,
    branchesCount,
  }
})

/** خيارات فلتر الفرع */
const branchOptions = computed(() => [
  { value: 'ALL', label: t('wh.allBranches') },
  ...(meta.value?.branches ?? []).map(branch => ({
    value: branch.id,
    label: localizedEntityName(branch, locale.value),
  })),
])

/** أعمدة جدول TanStack — قابلة للفرز مع تنسيق مالي وعربي حسب اللغة */
const columns = computed<ColumnDef<InventoryRow, unknown>[]>(() => [
  {
    accessorKey: 'barcode',
    header: () => t('inv.barcode'),
    cell: info => h('span', { class: 'font-mono font-semibold' }, String(info.getValue())),
  },
  {
    accessorKey: locale.value === 'ar' ? 'nameAr' : 'name',
    id: 'name',
    header: () => t('inv.itemName'),
    cell: info => h('span', { class: 'font-semibold' }, String(info.getValue())),
  },
  {
    accessorKey: 'categoryId',
    id: 'category',
    header: () => t('inv.category'),
    cell: info => h('span', { class: 'text-xs' }, localizedEntityName(
      meta.value?.categories.find(category => category.id === info.getValue()) ?? { name: String(info.getValue()), nameAr: String(info.getValue()) },
      locale.value,
    )),
  },
  {
    accessorKey: 'manufacturerId',
    id: 'manufacturer',
    header: () => t('inv.manufacturer'),
    cell: info => h('span', { class: 'text-xs' }, localizedEntityName(
      meta.value?.manufacturers.find(manufacturer => manufacturer.id === info.getValue()) ?? { name: String(info.getValue()), nameAr: String(info.getValue()) },
      locale.value,
    )),
  },
  {
    accessorKey: 'stock',
    id: 'stock',
    header: () => t('wh.stockColumn'),
    cell: (info) => {
      const stock = Number(info.getValue())
      return h(Badge, { variant: stock <= LOW_STOCK_THRESHOLD ? 'war' : 'ok' }, {
        default: () => (stock <= LOW_STOCK_THRESHOLD ? t('wh.lowStock') : t('wh.inStock')),
      })
    },
  },
  {
    accessorKey: 'unitsBilled',
    id: 'unitsBilled',
    header: () => t('tbl.unitsBilled'),
    cell: info => h('span', { class: 'font-mono font-semibold' }, formatNumber(Number(info.getValue()), locale.value)),
  },
  {
    accessorKey: 'invoicesCount',
    id: 'invoicesCount',
    header: () => t('tbl.invoices'),
    cell: info => h('span', { class: 'font-mono font-semibold' }, formatNumber(Number(info.getValue()), locale.value)),
  },
])

const statIcons: Record<string, Component> = {
  sku: IconPackage,
  units: IconBoxes,
  branches: IconWarehouse,
}
</script>

<template>
  <div>
    <SyncSkeleton v-if="isLoading && rows.length === 0" />

    <section v-else class="space-y-md" aria-labelledby="warehouseTitle">
      <PageHeader
        :kicker="t('wh.kicker')"
        kicker-class="text-war"
        :title="t('wh.title')"
      >
        <template #actions>
          <label class="flex items-center gap-xs text-xs font-bold text-bg-f">
            <IconWarehouse class="w-3.5 h-3.5 text-war" />
            <span>{{ t('tbl.branch') }}:</span>
            <Select
              :model-value="preferences.currentBranchId"
              :options="branchOptions"
              class="!w-56"
              aria-label="Branch filter"
              @update:model-value="preferences.setCurrentBranch($event)"
            />
          </label>
        </template>
      </PageHeader>

      <!-- ملخص المخازن -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-sm">
        <StatCard :title="t('wh.skuCount')" :value="formatNumber(summary.skuCount, locale)" :icon="statIcons.sku" icon-class="text-primary" />
        <StatCard :title="t('wh.billedUnits')" :value="formatNumber(summary.billedUnits, locale)" :icon="statIcons.units" icon-class="text-ok" />
        <StatCard :title="t('wh.activeBranches')" :value="formatNumber(summary.branchesCount, locale)" :icon="statIcons.branches" icon-class="text-secondary" />
      </div>

      <!-- جدول الأصناف -->
      <Card class="!p-0 overflow-hidden">
        <div class="p-md border-b border-border flex flex-wrap items-center justify-between gap-sm">
          <CardTitle>{{ t('wh.title') }}</CardTitle>
          <div class="w-full sm:w-64">
            <Input v-model="searchQuery" type="search" :placeholder="t('wh.searchPlaceholder')" aria-label="Inventory search" />
          </div>
        </div>
        <DataTable :data="rows" :columns="columns" :global-filter="searchQuery.trim()" />
      </Card>
    </section>
  </div>
</template>
