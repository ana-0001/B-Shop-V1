<!-- components/shared/DataTable.vue — جدول TanStack Table عام (فرز + بحث + صفوف مرنة) -->
<script setup lang="ts" generic="TData">
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable
  
  
} from '@tanstack/vue-table'
import type {ColumnDef, SortingState} from '@tanstack/vue-table';
import { ArrowDown as IconArrowDown, ArrowUp as IconArrowUp, ChevronsUpDown as IconChevronsUpDown } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import Table from '@/components/ui/Table.vue'
import TableHead from '@/components/ui/TableHead.vue'
import TableBody from '@/components/ui/TableBody.vue'
import TableRow from '@/components/ui/TableRow.vue'
import TableHeaderCell from '@/components/ui/TableHeaderCell.vue'
import TableCell from '@/components/ui/TableCell.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

const props = withDefaults(
  defineProps<{
    data: TData[]
    columns: ColumnDef<TData, any>[]
    globalFilter?: string
  }>(),
  { globalFilter: '' },
)

const { t } = useI18n()
const sorting = ref<SortingState>([])

const table = useVueTable({
  get data() {
    return props.data
  },
  columns: props.columns,
  state: {
    get sorting() {
      return sorting.value
    },
    get globalFilter() {
      return props.globalFilter
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'includesString',
})

function sortIcon(columnId: string) {
  const state = table.getColumn(columnId)?.getIsSorted()
  if (state === 'asc') return IconArrowUp
  if (state === 'desc') return IconArrowDown
  return IconChevronsUpDown
}
</script>

<template>
  <Table>
    <TableHead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <TableHeaderCell
          v-for="header in headerGroup.headers"
          :key="header.id"
          :class="header.column.getCanSort() ? 'cursor-pointer select-none' : ''"
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <span class="inline-flex items-center gap-xs">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            <component :is="sortIcon(header.column.id)" v-if="header.column.getCanSort()" class="w-3 h-3 opacity-60" />
          </span>
        </TableHeaderCell>
      </tr>
    </TableHead>
    <TableBody>
      <TableRow v-if="table.getRowModel().rows.length === 0">
        <TableCell :colspan="table.getAllLeafColumns().length">
          <EmptyState :message="t('tbl.empty')" />
        </TableCell>
      </TableRow>
      <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
