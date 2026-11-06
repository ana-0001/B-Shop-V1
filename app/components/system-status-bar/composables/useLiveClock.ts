/**
 * system-status-bar/composables/useLiveClock.ts — محرك الساعة الحية للشريط النظامي.
 * وفقًا لـ PRD:
 * - العرض الرئيسي 12 ساعة (hh:mm A) — بأرقام عربية "٠٢:٣٠ م" في الواجهة العربية.
 * - كل العروض مثبتة على توقيت القاهرة (Africa/Cairo) لدقة البيانات المالية —
 *   الساعة الرئيسية والتواريخ والـ 24 ساعة نفس المنطقة عشان ما يحصلش تناقض عرض.
 * - Tooltip احترافي عند التحويم يعرض:
 *     1) 24 ساعة بتوقيت القاهرة (Africa/Cairo — hardcoded مؤقتًا حسب خارطة الطريق).
 *     2) التاريخ الميلادي بصيغة "Tuesday : 12 - (05 - May) - 2026 AD".
 *     3) التاريخ الهجري بتقويم أم القرى (islamic-umalqura) بصيغة "Tuesday : 25 - (11 - Dhu al-Qi'dah) - 1447 AH".
 * كل التنسيقات عبر Intl.DateTimeFormat مع كاش للمنسّقات عشان ما نعملش instance كل ثانية.
 */
import type { LocaleCode } from '@/types'

/** المنطقة الزمنية المثبتة حاليًا (PRD: تُستبدل مستقبلًا من سياق RegionSettings العام) */
export const SSB_TIMEZONE = 'Africa/Cairo'

/** كاش منسّقات Intl — المفتاح `${tag}|${options-hash}` */
const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(tag: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${tag}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(tag, options)
    formatterCache.set(key, formatter)
  }
  return formatter
}

/** وسم الـ locale الكامل حسب لغة الواجهة */
function localeTag(locale: LocaleCode): string {
  return locale === 'ar' ? 'ar-EG' : 'en-US'
}

/**
 * بناء سطر التاريخ بصيغة PRD: "Tuesday : 12 - (05 - May) - 2026 AD".
 * بنستخدم formatToParts عشان نركّب الصيغة يدويًا بأسماء الأيام والشهور المحلية.
 */
function formatPrdDate(date: Date, tag: string, withCalendar?: 'gregory' | 'islamic-umalqura', timeZone?: string): string {
  const fullTag = withCalendar ? `${tag}-u-ca-${withCalendar}` : tag
  const parts = getFormatter(fullTag, {
    timeZone,
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    era: 'short',
  }).formatToParts(date)

  const pick = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find(part => part.type === type)?.value ?? ''

  // اسم الشهر الكامل — منسّق منفصل لأن Intl لا يسمح بدمج month: 'long' مع '2-digit'
  const monthName = getFormatter(fullTag, { timeZone, month: 'long' }).format(date)

  return `${pick('weekday')} : ${pick('day')} - (${pick('month')} - ${monthName}) - ${pick('year')} ${pick('era')}`
}

export function useLiveClock() {
  const { locale } = useI18n()

  /** اللحظة الحالية — تتحدث كل ثانية */
  const now = ref<Date>(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  /** العرض الرئيسي — 12 ساعة hh:mm A بتوقيت القاهرة (مثال: 02:30 PM / ٠٢:٣٠ م) */
  const time12 = computed<string>(() => {
    try {
      return getFormatter(localeTag(locale.value), {
        timeZone: SSB_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(now.value)
    } catch {
      return now.value.toISOString()
    }
  })

  /** وقت القاهرة 24 ساعة مع الثواني — للـ Tooltip */
  const cairo24 = computed<string>(() => {
    try {
      return getFormatter(localeTag(locale.value), {
        timeZone: SSB_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }).format(now.value)
    } catch {
      return '—'
    }
  })

  /** التاريخ الميلادي بصيغة PRD — بتوقيت القاهرة عشان تاريخ العمليات المالي يتطابق */
  const gregorian = computed<string>(() => {
    try {
      return formatPrdDate(now.value, localeTag(locale.value), undefined, SSB_TIMEZONE)
    } catch {
      return '—'
    }
  })

  /** التاريخ الهجري بتقويم أم القرى (Umm al-Qura) بصيغة PRD — بتوقيت القاهرة */
  const hijri = computed<string>(() => {
    try {
      return formatPrdDate(now.value, localeTag(locale.value), 'islamic-umalqura', SSB_TIMEZONE)
    } catch {
      return '—'
    }
  })

  return { now, time12, cairo24, gregorian, hijri }
}
