/**
 * app/composables/useSystemMeta.ts — بيانات النظام المشتركة (فروع، فئات، كتالوج).
 * بتتحمل مرة واحدة وتتشارك بين كل الصفحات عبر useState —
 * وبترجع تاني لما يحصل Reset أو Sync من شريط الأدوات.
 */
import { systemApi } from '@/services/api/endpoints'
import type { Branch, Category, Manufacturer, Product } from '@/types'

export interface SystemMeta {
  currency: 'EGP'
  defaultTaxRate: number
  operationDate: string
  branches: Branch[]
  categories: Category[]
  manufacturers: Manufacturer[]
  products: Product[]
  lowStockThreshold: number
}

export function useSystemMeta() {
  const meta = useState<SystemMeta | null>('bshop:meta', () => null)

  /** تحميل بيانات النظام — بيتجاهل التحميل لو موجودة بالفعل */
  async function load(force = false): Promise<SystemMeta> {
    if (meta.value && !force) return meta.value
    meta.value = await systemApi.meta()
    return meta.value
  }

  /** بحث منتج بالباركود */
  function productByBarcode(barcode: string): Product | undefined {
    return meta.value?.products.find(product => product.barcode === barcode)
  }

  return { meta, load, productByBarcode }
}
