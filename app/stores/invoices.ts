/**
 * app/stores/invoices.ts — متجر مساحة عمل الفواتير (التبويبات، التعليق، الترحيل).
 * - كل تبويب = مسودة فاتورة مفتوحة (status OPEN) بتتحفظ محليًا لتصمد بعد التحديث.
 * - عمليات التعليق (Hold) والترحيل (Post) والاسترجاع بتتم عبر طبقة الـ API (Mock).
 * - الحسابات المالية (الإجماليات والضريبة 14%) بتتم عبر computeInvoiceAmounts الموحدة.
 */
import { defineStore } from 'pinia'
import type { Invoice, InvoiceItem, InvoiceType, PriceTier } from '@/types'
import { computeLineTotal, generateItemId } from '@/utils/invoice'
import { invoicesApi } from '@/services/api/endpoints'
import { nowUtcIso } from '@/utils/dates'
import { DEFAULT_TAX_RATE } from '@/utils/constants'

/** حقول واجهة إضافية على المسودة (مش بتترحل للباك إند) */
export interface InvoiceDraft extends Invoice {
  customerTab?: 'phones' | 'addresses'
  sideTab?: 'preview' | 'notes'
}

export const useInvoicesStore = defineStore(
  'invoices',
  () => {
    /** تبويبات الفواتير المفتوحة */
    const tabs = ref<InvoiceDraft[]>([])

    /** معرّف التبويب النشط */
    const activeTabId = ref<string | null>(null)

    /** وضع تقسيم الشاشة (Split View) */
    const splitView = ref(false)

    /** معرّف التبويب الثانوي في وضع التقسيم */
    const secondaryTabId = ref<string | null>(null)

    // ===== Getters =====
    const activeTab = computed<InvoiceDraft | null>(
      () => tabs.value.find(tab => tab.id === activeTabId.value) ?? tabs.value[0] ?? null,
    )
    const secondaryTab = computed<InvoiceDraft | null>(
      () => tabs.value.find(tab => tab.id === secondaryTabId.value) ?? null,
    )

    function findTab(id: string): InvoiceDraft | undefined {
      return tabs.value.find(tab => tab.id === id)
    }

    // ===== Tab management =====
    /** إنشاء تبويب فاتورة جديد برقم متسلسل من الـ API */
    async function createTab(type: InvoiceType = 'SALE', branchId = 'BR-MAIN'): Promise<InvoiceDraft> {
      const id = await invoicesApi.nextInvoiceId()
      const timestamp = nowUtcIso()
      const draft: InvoiceDraft = {
        id,
        type,
        status: 'OPEN',
        branchId,
        customerName: 'Walk-in Customer',
        customerNameAr: 'عميل نقدي',
        customerPhones: ['01000000000'],
        customerAddresses: [],
        priceTier: 1,
        items: [],
        discount: 0,
        taxRate: DEFAULT_TAX_RATE,
        notes: [],
        customerTab: 'phones',
        sideTab: 'preview',
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      tabs.value.push(draft)
      activeTabId.value = id
      return draft
    }

    function selectTab(id: string): void {
      if (splitView.value && id !== activeTabId.value) {
        secondaryTabId.value = id
      } else {
        activeTabId.value = id
      }
    }

    /** غلق تبويب — لو آخر تبويب بيتعمله استبدال بمسودة جديدة (سلوك ملف التصميم) */
    async function closeTab(id: string): Promise<void> {
      if (tabs.value.length <= 1) {
        const fresh = await createTab('SALE')
        activeTabId.value = fresh.id
        return
      }
      tabs.value = tabs.value.filter(tab => tab.id !== id)
      if (activeTabId.value === id) activeTabId.value = tabs.value[0]?.id ?? null
      if (secondaryTabId.value === id) {
        secondaryTabId.value = tabs.value.find(tab => tab.id !== activeTabId.value)?.id ?? null
      }
    }

    /** تشغيل/إيقاف تقسيم الشاشة — لو مفيش تبويب تاني بيتعمله إنشاء تلقائي */
    async function toggleSplitView(): Promise<void> {
      if (!splitView.value && tabs.value.length < 2) {
        await createTab('SALE')
      }
      splitView.value = !splitView.value
      secondaryTabId.value = splitView.value
        ? tabs.value.find(tab => tab.id !== activeTabId.value)?.id ?? tabs.value[0]?.id ?? null
        : null
    }

    // ===== Draft mutations =====
    function patchTab(id: string, patch: Partial<InvoiceDraft>): void {
      const tab = findTab(id)
      if (!tab) return
      Object.assign(tab, patch, { updatedAt: nowUtcIso() })
    }

    function setPriceTier(id: string, tier: PriceTier): void {
      patchTab(id, { priceTier: tier })
    }

    function addItem(id: string, item: Omit<InvoiceItem, 'id' | 'total'>): void {
      const tab = findTab(id)
      if (!tab) return
      tab.items.push({
        ...item,
        id: generateItemId(),
        total: computeLineTotal(item.qty, item.unitPrice),
      })
      tab.updatedAt = nowUtcIso()
    }

    function updateItemQty(id: string, itemId: string, qty: number): void {
      const tab = findTab(id)
      const item = tab?.items.find(entry => entry.id === itemId)
      if (!item) return
      item.qty = Math.max(1, Number(qty) || 1)
      item.total = computeLineTotal(item.qty, item.unitPrice)
      tab!.updatedAt = nowUtcIso()
    }

    function removeItem(id: string, itemId: string): void {
      const tab = findTab(id)
      if (!tab) return
      tab.items = tab.items.filter(entry => entry.id !== itemId)
      tab.updatedAt = nowUtcIso()
    }

    function addNote(id: string, note: string): void {
      const tab = findTab(id)
      if (!tab || !note.trim()) return
      tab.notes.push(note.trim())
      tab.updatedAt = nowUtcIso()
    }

    function removeNote(id: string, index: number): void {
      const tab = findTab(id)
      if (!tab) return
      tab.notes.splice(index, 1)
      tab.updatedAt = nowUtcIso()
    }

    function addContact(id: string, value: string): void {
      const tab = findTab(id)
      if (!tab || !value.trim()) return
      if (tab.customerTab === 'addresses') tab.customerAddresses.push(value.trim())
      else tab.customerPhones.push(value.trim())
      tab.updatedAt = nowUtcIso()
    }

    function removeContact(id: string, index: number): void {
      const tab = findTab(id)
      if (!tab) return
      if (tab.customerTab === 'addresses') tab.customerAddresses.splice(index, 1)
      else tab.customerPhones.splice(index, 1)
      tab.updatedAt = nowUtcIso()
    }

    // ===== API-backed operations =====
    /** تعليق الفاتورة (Hold) — بتتنقل لقائمة المعلّقين في الـ Mock DB */
    async function holdTab(id: string): Promise<boolean> {
      const tab = findTab(id)
      if (!tab) return false
      if (tab.items.length === 0) return false
      await invoicesApi.hold(tab)
      tabs.value = tabs.value.filter(entry => entry.id !== id)
      // لو آخر تبويب — بنجهز مسودة جديدة فاضية (نفس سلوك غلق آخر تبويب)
      if (tabs.value.length === 0) {
        activeTabId.value = null
        secondaryTabId.value = null
        await createTab(tab.type)
        return true
      }
      if (activeTabId.value === id) activeTabId.value = tabs.value[0]?.id ?? null
      if (secondaryTabId.value === id) secondaryTabId.value = null
      return true
    }

    /** ترحيل الفاتورة (Save) — بتتنقل للفواتير المرحّلة في الـ Mock DB */
    async function postTab(id: string): Promise<boolean> {
      const tab = findTab(id)
      if (!tab) return false
      if (tab.items.length === 0) return false
      await invoicesApi.post(tab)
      tabs.value = tabs.value.filter(entry => entry.id !== id)
      // لو آخر تبويب — بنجهز مسودة جديدة فاضية (نفس سلوك غلق آخر تبويب)
      // عشان مساحة العمل تفضل جاهزة للكاشير بعد كل عملية بيع
      if (tabs.value.length === 0) {
        activeTabId.value = null
        secondaryTabId.value = null
        await createTab(tab.type)
        return true
      }
      if (activeTabId.value === id) activeTabId.value = tabs.value[0]?.id ?? null
      if (secondaryTabId.value === id) secondaryTabId.value = null
      return true
    }

    /** استرجاع فاتورة معلّقة لمساحة العمل */
    async function restoreHeld(id: string): Promise<boolean> {
      const restored = await invoicesApi.restoreHeld(id)
      if (!restored) return false
      const draft: InvoiceDraft = { ...restored, status: 'OPEN', customerTab: 'phones', sideTab: 'preview' }
      tabs.value.push(draft)
      activeTabId.value = draft.id
      return true
    }

    /** تصفير كل التبويبات (يُستخدم مع Reset Mock DB) */
    async function clearAll(): Promise<void> {
      tabs.value = []
      activeTabId.value = null
      secondaryTabId.value = null
      splitView.value = false
      await createTab('SALE')
    }

    return {
      tabs,
      activeTabId,
      secondaryTabId,
      splitView,
      activeTab,
      secondaryTab,
      findTab,
      createTab,
      selectTab,
      closeTab,
      toggleSplitView,
      patchTab,
      setPriceTier,
      addItem,
      updateItemQty,
      removeItem,
      addNote,
      removeNote,
      addContact,
      removeContact,
      holdTab,
      postTab,
      restoreHeld,
      clearAll,
    }
  },
  { persist: true },
)
