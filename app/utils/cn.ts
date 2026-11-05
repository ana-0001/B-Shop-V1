/**
 * app/utils/cn.ts — دالة دمج كلاسات Tailwind بشكل آمن (نمط shadcn-vue).
 * بتستخدم clsx للشروط + tailwind-merge لحل تعارض الكلاسات.
 */
import {  clsx } from 'clsx'
import type {ClassValue} from 'clsx';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
