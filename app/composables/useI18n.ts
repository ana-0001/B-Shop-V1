/**
 * app/composables/useI18n.ts — نظام الترجمة المركزي (i18n) للمشروع.
 * - القواميس في app/locales/en.json و ar.json بمفاتيح مسطحة زي ملف التصميم.
 * - اتجاه الصفحة (LTR/RTL) بيتحدث تلقائيًا مع اللغة.
 * - دالة t() بتدعم الاستبدال {param} للقيم الديناميكية.
 */
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'
import type { LocaleCode } from '@/types'

type Dictionary = Record<string, string>

const dictionaries: Record<LocaleCode, Dictionary> = { en, ar }

export function useI18n() {
  const preferences = usePreferencesStore()

  /** اللغة الحالية (reactive) */
  const locale = computed<LocaleCode>(() => preferences.locale)

  /** اتجاه الواجهة حسب اللغة */
  const dir = computed<'ltr' | 'rtl'>(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
  const isRTL = computed(() => dir.value === 'rtl')

  /**
   * ترجمة مفتاح مع دعم الاستبدال — بترجع المفتاح نفسه لو مش موجود (fallback إنجليزي).
   * مثال: t('onboard.stepCounter', { current: 2, total: 4 })
   */
  function t(key: string, params?: Record<string, string | number>): string {
    const dict = dictionaries[locale.value] ?? dictionaries.en
    let text = dict[key] ?? dictionaries.en[key] ?? key
    if (params) {
      for (const [param, value] of Object.entries(params)) {
        text = text.replaceAll(`{${param}}`, String(value))
      }
    }
    return text
  }

  /** تغيير اللغة مع حفظها في التفضيلات */
  function setLocale(next: LocaleCode, notifyUser = false): void {
    preferences.setLocale(next)
    if (notifyUser) {
      const { toast } = useSonner()
      toast.info(t(next === 'ar' ? 'notif.langSetAr' : 'notif.langSetEn'))
    }
  }

  return { locale, dir, isRTL, t, setLocale }
}
