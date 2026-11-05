<!-- components/invoices/ProductEntryCard.vue — بطاقة إدخال الأصناف:
     شرائح التسعير + الباركود + الكتالوج + الفلاتر + الكمية/السعر/الإجمالي + المعاينة -->
<script setup lang="ts">
import { Plus as IconPlus } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { computeLineTotal } from '@/utils/invoice'
import { formatCurrency } from '@/utils/format'
import { productImage } from '@/utils/product-image'
import { localizedEntityName } from '@/types'
import type { InvoiceDraft } from '@/stores/invoices'
import type { Product, PriceTier } from '@/types'
import type { SystemMeta } from '@/composables/useSystemMeta'
import { PRICE_TIERS } from '@/utils/constants'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'

const props = defineProps<{
  draft: InvoiceDraft
}>()

const emit = defineEmits<{
  add: [item: { barcode: string; name: string; nameAr: string; qty: number; unitPrice: number; notes?: string }]
  'update:tier': [tier: PriceTier]
}>()

const { t, locale } = useI18n()
const { meta, productByBarcode } = useSystemMeta()

/** حالة إدخال الصنف الحالي (مسودة السطر) — لكل تبويب حالة مستقلة */
const entry = reactive({
  barcode: '',
  categoryId: 'ALL',
  manufacturerId: 'ALL',
  name: '',
  nameAr: '',
  qty: 1,
  unitPrice: 0,
  notes: '',
})

const activeProduct = computed<Product | undefined>(() => productByBarcode(entry.barcode))
const previewImage = computed(() => activeProduct.value?.imageUrl ?? productImage(entry.categoryId === 'ALL' ? undefined : entry.categoryId))
const lineTotal = computed(() => computeLineTotal(entry.qty, entry.unitPrice))

/** تطبيق بيانات منتج على المسودة بسعر الشريحة الحالية */
function applyProduct(product: Product): void {
  entry.barcode = product.barcode
  entry.name = product.name
  entry.nameAr = product.nameAr
  entry.unitPrice = product.prices[props.draft.priceTier] ?? product.prices[1]
  entry.categoryId = product.categoryId
  entry.manufacturerId = product.manufacturerId
}

// أول منتج في الكتالوج كقيمة افتراضية عند جاهزية البيانات
watch(() => meta.value, (value: SystemMeta | null) => {
  if (!entry.barcode && value?.products.length) applyProduct(value.products[0])
}, { immediate: true })

// تغيير شريحة التسعير بيرجّع سعر الصنف الحالي بالشريحة الجديدة
watch(() => props.draft.priceTier, (tier: PriceTier) => {
  const product = productByBarcode(entry.barcode)
  if (product) entry.unitPrice = product.prices[tier] ?? product.prices[1]
})

function onBarcodeChange(value: string): void {
  entry.barcode = value.trim()
  const product = productByBarcode(entry.barcode)
  if (product) applyProduct(product)
}

function onCatalogChange(barcode: string): void {
  const product = productByBarcode(barcode)
  if (product) applyProduct(product)
}

/** المنتجات المطابقة لفلاتر الفئة والمصنع */
const matchingProducts = computed<Product[]>(() =>
  (meta.value?.products ?? []).filter(product =>
    (entry.categoryId === 'ALL' || product.categoryId === entry.categoryId)
    && (entry.manufacturerId === 'ALL' || product.manufacturerId === entry.manufacturerId),
  ),
)

function setCategoryFilter(value: string): void {
  entry.categoryId = value
  const match = matchingProducts.value[0]
  if (match) applyProduct(match)
}

function setManufacturerFilter(value: string): void {
  entry.manufacturerId = value
  const match = matchingProducts.value[0]
  if (match) applyProduct(match)
}

/** إضافة الصنف للفاتورة وتصفير الكمية والملاحظة */
function addItem(): void {
  if (!entry.name.trim()) return
  emit('add', {
    barcode: entry.barcode || '99001122',
    name: entry.name.trim(),
    nameAr: entry.nameAr,
    qty: Math.max(1, Math.round(Number(entry.qty) || 1)),
    unitPrice: Math.max(0, Number(entry.unitPrice) || 0),
    notes: entry.notes.trim() || undefined,
  })
  entry.qty = 1
  entry.notes = ''
}

const categoryOptions = computed(() => [
  { value: 'ALL', label: t('inv.allCategories') },
  ...(meta.value?.categories ?? []).map(category => ({ value: category.id, label: localizedEntityName(category, locale.value) })),
])

const manufacturerOptions = computed(() => [
  { value: 'ALL', label: t('inv.allManufacturers') },
  ...(meta.value?.manufacturers ?? []).map(manufacturer => ({ value: manufacturer.id, label: localizedEntityName(manufacturer, locale.value) })),
])

const catalogOptions = computed(() =>
  matchingProducts.value.map(product => ({
    value: product.barcode,
    label: `${localizedEntityName(product, locale.value)} — ${formatCurrency(product.prices[props.draft.priceTier], locale.value)}`,
  })),
)
</script>

<template>
  <div class="bg-surface-alt p-sm rounded border border-border flex flex-col gap-sm">
    <!-- شرائح التسعير + الباركود -->
    <div class="flex items-center justify-between gap-sm pb-xs border-b border-border flex-wrap">
      <div class="flex items-center gap-xs">
        <span class="font-bold text-bg-f text-xs">{{ t('inv.priceTier') }}</span>
        <div class="flex items-center gap-xs">
          <button
            v-for="tier in PRICE_TIERS"
            :key="tier"
            type="button"
            class="price-tier-btn"
            :class="draft.priceTier === tier ? 'active' : ''"
            @click="$emit('update:tier', tier as PriceTier)"
          >
            {{ t(`inv.tier${tier}`) }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-xs">
        <Label class="!mb-0 !font-bold">{{ t('inv.barcode') }}:</Label>
        <Input
          type="text"
          :model-value="entry.barcode"
          class="!w-28 font-mono text-center text-xs"
          aria-label="Barcode"
          @update:model-value="onBarcodeChange"
        />
      </div>
    </div>

    <!-- الكتالوج والفلاتر -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-sm">
      <div>
        <Label>{{ t('inv.quickLookup') }}</Label>
        <Select :model-value="entry.barcode" :options="catalogOptions" class="text-xs" aria-label="Catalog" @update:model-value="onCatalogChange" />
      </div>
      <div>
        <Label>{{ t('inv.category') }}:</Label>
        <Select :model-value="entry.categoryId" :options="categoryOptions" class="text-xs" aria-label="Category filter" @update:model-value="setCategoryFilter" />
      </div>
      <div>
        <Label>{{ t('inv.manufacturer') }}:</Label>
        <Select :model-value="entry.manufacturerId" :options="manufacturerOptions" class="text-xs" aria-label="Manufacturer filter" @update:model-value="setManufacturerFilter" />
      </div>
    </div>

    <!-- إدخال السطر -->
    <div class="grid grid-cols-2 sm:grid-cols-12 gap-sm items-end bg-surface p-sm rounded border border-border">
      <div class="col-span-2 sm:col-span-3">
        <Label>{{ t('inv.itemName') }}:</Label>
        <Input v-model="entry.name" type="text" class="font-bold" aria-label="Item name" />
      </div>
      <div class="col-span-1 sm:col-span-1">
        <Label>{{ t('inv.qty') }}:</Label>
        <Input v-model="entry.qty" type="number" min="1" class="text-center font-bold font-mono" aria-label="Quantity" />
      </div>
      <div class="col-span-1 sm:col-span-2">
        <Label>{{ t('inv.unitPrice') }}:</Label>
        <Input v-model="entry.unitPrice" type="number" min="0" step="0.5" class="text-center font-bold font-mono text-ok" aria-label="Unit price" />
      </div>
      <div class="col-span-1 sm:col-span-2">
        <Label>{{ t('inv.lineTotal') }}:</Label>
        <Input :model-value="formatCurrency(lineTotal, locale)" type="text" readonly class="text-center font-bold font-mono bg-surface-alt text-primary !text-xs" aria-label="Line total" />
      </div>
      <div class="col-span-1 sm:col-span-2">
        <Button variant="primary" size="md" class="w-full h-8 text-xs" @click="addItem">
          <IconPlus class="w-3.5 h-3.5" />
          {{ t('inv.addBtn') }}
        </Button>
      </div>

      <!-- معاينة الصنف -->
      <div class="col-span-2 row-span-2 sm:col-span-2 flex self-stretch rounded border border-border bg-surface-alt p-xs">
        <div class="w-full h-full min-h-[5.5em] bg-surface border border-border rounded p-xs flex items-center justify-center shadow-sm overflow-hidden">
          <img :src="previewImage" alt="Selected item preview" class="w-full h-full object-contain rounded">
        </div>
      </div>

      <div class="col-span-2 sm:col-span-10">
        <Label>{{ t('inv.lineNote') }}</Label>
        <Input v-model="entry.notes" type="text" :placeholder="t('inv.lineNotePlaceholder')" class="text-xs" aria-label="Item line note" />
      </div>
    </div>
  </div>
</template>
