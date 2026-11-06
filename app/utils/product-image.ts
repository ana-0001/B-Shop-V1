/**
 * app/utils/product-image.ts — توليد صورة SVG بديلة للأصناف (Data URI).
 * نفس فكرة DEFAULT_PRODUCT_SVG في ملف التصميم، لكن بلون مميز لكل فئة
 * عشان المعاينة تبقى واضحة بدون الحاجة لصور خارجية.
 * الألوان من لوحة خطة شريط الحالة الموحّدة (كحلي 220 / أخضر 142 / ذهبي 45 / دافي 30).
 */
const CATEGORY_TINTS: Record<string, string> = {
  'CAT-ELEC': 'hsl(220 60% 45%)',
  'CAT-GROC': 'hsl(142 71% 42%)',
  'CAT-HOME': 'hsl(45 85% 62%)',
  'CAT-OFFC': 'hsl(30 85% 50%)',
}

const DEFAULT_TINT = 'hsl(220 60% 45%)'

/** يرجع Data URI بصورة SVG رمزية بلون الفئة */
export function productImage(categoryId?: string): string {
  const tint = (categoryId && CATEGORY_TINTS[categoryId]) || DEFAULT_TINT
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <rect width="120" height="120" rx="12" fill="hsl(30, 20%, 94%)"/>
    <path d="M36 78 L52 58 L66 72 L76 60 L88 78 Z" fill="${tint}" opacity="0.65"/>
    <circle cx="46" cy="44" r="7" fill="${tint}" opacity="0.65"/>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
