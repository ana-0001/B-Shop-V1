/**
 * app/stores/preferences.ts — متجر التفضيلات العامة (اللغة، الثيم، الفرع الحالي).
 * بيتحفظ في localStorage تلقائيًا عبر @pinia-plugin-persistedstate عشان
 * تبديل اللغة والثيم يفضل محفوظ بعد إغلاق التطبيق (معيار القبول رقم 4).
 */
import { defineStore } from 'pinia'
import type { LocaleCode, ThemeMode } from '@/types'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    /** لغة الواجهة — الافتراضية English (en, LTR) */
    const locale = ref<LocaleCode>('en')

    /** وضع الثيم — الافتراضي Light ويدعم Dark و System */
    const theme = ref<ThemeMode>('light')

    /** الفرع الحالي المختار في شريط التنقل (يؤثر على فلتر المخازن) */
    const currentBranchId = ref<string>('ALL')

    function setLocale(next: LocaleCode): void {
      locale.value = next === 'ar' ? 'ar' : 'en'
    }

    function toggleLocale(): LocaleCode {
      locale.value = locale.value === 'en' ? 'ar' : 'en'
      return locale.value
    }

    function setTheme(next: ThemeMode): void {
      theme.value = ['light', 'dark', 'system'].includes(next) ? next : 'light'
    }

    /** تدوير الثيم: Light → Dark → System → Light (سلوك ملف التصميم) */
    function cycleTheme(): ThemeMode {
      const order: ThemeMode[] = ['light', 'dark', 'system']
      const next = order[(order.indexOf(theme.value) + 1) % order.length]
      theme.value = next
      return next
    }

    function setCurrentBranch(branchId: string): void {
      currentBranchId.value = branchId
    }

    return { locale, theme, currentBranchId, setLocale, toggleLocale, setTheme, cycleTheme, setCurrentBranch }
  },
  { persist: true },
)
