/**
 * app/types/print-js.d.ts — تعريف أنواع مكتبة print-js (مفيش أنواع رسمية مع الباكدج).
 * بنغطي فقط الخيارات المستخدمة في المشروع (طباعة قالب HTML للفاتورة).
 */
declare module 'print-js' {
  interface PrintJSOptions {
    printable: string
    type: 'html' | 'text' | 'image' | 'pdf' | 'json'
    targetStyles?: string[]
    targetStyle?: string[]
    documentTitle?: string
    [key: string]: unknown
  }

  function printJS(options: PrintJSOptions): void
  export default printJS
}
