/**
 * app/utils/dates.ts — دوال التواريخ المعتمدة على date-fns مع دعم اللغتين.
 * أي timestamp بيتخزن UTC، والعرض بيتم بالتوقيت المحلي حسب لغة الواجهة.
 */
import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import type { LocaleCode } from '@/types'

type DateFnsLocale = typeof enUS | typeof ar

function resolveLocale(locale: LocaleCode): DateFnsLocale {
  return locale === 'ar' ? ar : enUS
}

/** تاريخ اليوم بصيغة ISO (YYYY-MM-DD) — بيتخزن في الـ meta */
export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

/** الآن بتوقيت UTC بصيغة ISO كاملة */
export function nowUtcIso(): string {
  return new Date().toISOString()
}

/** تنسيق تاريخ ISO لعرضه في الواجهة (مثال: 5 Nov 2026 / ٥ نوفمبر ٢٠٢٦) */
export function formatDate(iso: string | Date, locale: LocaleCode): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : iso
    return format(date, locale === 'ar' ? 'd MMMM yyyy' : 'd MMM yyyy', { locale: resolveLocale(locale) })
  } catch {
    return String(iso)
  }
}

/** تنسيق تاريخ + وقت لعرضه في الجداول */
export function formatDateTime(iso: string | Date, locale: LocaleCode): string {
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : iso
    return format(date, locale === 'ar' ? 'd MMM yyyy - hh:mm a' : 'd MMM yyyy - hh:mm a', { locale: resolveLocale(locale) })
  } catch {
    return String(iso)
  }
}

/** تنسيق الوقت فقط (للـ status bar والساعة) */
export function formatTime(date: Date, locale: LocaleCode): string {
  return format(date, 'hh:mm:ss a', { locale: resolveLocale(locale) })
}

/** اسم يوم من تاريخ ISO — للشارت الأسبوعي */
export function formatDayLabel(iso: string, locale: LocaleCode): string {
  try {
    return format(parseISO(iso), 'EEE', { locale: resolveLocale(locale) })
  } catch {
    return iso
  }
}

/** إزاحة تاريخ ISO بعدد أيام — لتوليد آخر 7 أيام */
export function addDaysIso(iso: string, days: number): string {
  const date = parseISO(iso)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
