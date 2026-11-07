/**
 * components/splash/useBootChecks.ts — فاحص متطلبات النظام الحقيقي للشاشة الافتتاحية.
 * بدل التسلسل المحاكى القديم (مؤقّت بصري فقط)، بنفحص المتطلبات الخمسة فحصًا فعليًا
 * واحدًا تلو الآخر (قرار صاحب المشروع: الدخول للشاشة التالية بعد نجاح الفحص،
 * وعند عدم التوافق → شاشة الأخطاء مع إعادة محاولة أوتوماتيكية بفواصل + زر يدوي):
 *  1. وحدات النظام والمكتبات        — جولات localStorage + Intl + crypto + JSON.
 *  2. قاعدة البيانات المالية وAPI   — نداء systemApi.meta() فعلي والتحقق من الفروع والكتالوج.
 *  3. اللغة والسمة البصرية          — كتالوجات i18n محمّلة + قيم locale/theme سليمة + سمات html.
 *  4. محرك الرسوميات والطباعة       — اختبار رسم Canvas 2D وقراءة بكسل وتوليد DataURL.
 *  5. الجاهزية والإطلاق             — تجميع النتائج + إمكانية حلّ مسارات التوجيه.
 * كل خطوة لها حد أدنى للعرض (380ms) عشان تسلسل الإقلاع يفضل مقروء للمستخدم.
 */
import { useI18n } from '@/composables/useI18n'
import { usePreferencesStore } from '@/stores/preferences'
import { systemApi } from '@/services/api/endpoints'
import { ROUTE_NAMES } from '@/utils/constants'

export type BootStepState = 'pending' | 'running' | 'passed' | 'failed'

export interface BootStep {
  key: string
  state: BootStepState
  /** تفصيل فني عند الفشل (يظهر في شاشة الأخطاء) */
  detail?: string
}

export const BOOT_STEP_KEYS = [
  'splash.step1',
  'splash.step2',
  'splash.step3',
  'splash.step4',
  'splash.step5',
] as const

/** الحد الأدنى لمدة عرض كل خطوة (حتى يبقى تسلسل الإقلاع واضحًا للعين) */
const MIN_STEP_MS = 380

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** فحص 1: الوحدات الأساسية — تخزين محلي، تنسيق دولي، عشوائية مشفّرة، JSON */
function checkCoreModules(): void {
  const probeKey = 'bshop:boot-probe'
  window.localStorage.setItem(probeKey, 'ok')
  const stored = window.localStorage.getItem(probeKey)
  window.localStorage.removeItem(probeKey)
  if (stored !== 'ok') {
    throw new Error('localStorage read/write failed')
  }
  const sample = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(new Date())
  if (!sample || sample.length < 6) {
    throw new Error('Intl.DateTimeFormat unavailable')
  }
  const randoms = new Uint8Array(8)
  crypto.getRandomValues(randoms)
  if (randoms.every(value => value === 0)) {
    throw new Error('crypto.getRandomValues unavailable')
  }
  if (JSON.parse(JSON.stringify({ ok: true })).ok !== true) {
    throw new Error('JSON serialization failed')
  }
}

/** فحص 2: قاعدة البيانات المالية وواجهة الـ API — نداء /meta حقيقي عبر طبقة الـ Mock */
async function checkFiscalDatabase(): Promise<void> {
  const meta = await systemApi.meta()
  if (!meta || !Array.isArray(meta.branches) || meta.branches.length === 0) {
    throw new Error('meta/branches empty or invalid')
  }
  if (!Array.isArray(meta.products) || meta.products.length === 0) {
    throw new Error('meta/products catalog empty')
  }
  if (typeof meta.defaultTaxRate !== 'number' || meta.defaultTaxRate < 0) {
    throw new Error('meta/taxRate invalid')
  }
}

/** فحص 3: اللغة والسمة البصرية — الكتالوجات والقيم وسمات وسم html */
function checkLocalizationTheme(): void {
  const { t, locale } = useI18n()
  const preferences = usePreferencesStore()

  const sample = t('splash.title')
  if (!sample || sample === 'splash.title') {
    throw new Error('i18n catalog not loaded')
  }
  if (locale.value !== 'en' && locale.value !== 'ar') {
    throw new Error(`invalid locale: ${locale.value}`)
  }
  if (!['light', 'dark', 'system'].includes(preferences.theme)) {
    throw new Error(`invalid theme: ${preferences.theme}`)
  }
  const html = document.documentElement
  if (!html.getAttribute('lang') || !html.getAttribute('dir')) {
    throw new Error('html lang/dir attributes missing')
  }
}

/** فحص 4: محرك الرسوميات والطباعة الحرارية — رسم Canvas 2D وقراءة نتيجة فعلية */
function checkGraphicsEngine(): void {
  const canvas = document.createElement('canvas')
  canvas.width = 160
  canvas.height = 120
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas 2D context unavailable')
  }
  context.fillStyle = 'hsl(45 85% 62%)'
  context.fillRect(0, 0, 80, 60)
  const pixel = context.getImageData(10, 10, 1, 1).data
  if (pixel[3] !== 255) {
    throw new Error('canvas rasterization failed')
  }
  const dataUrl = canvas.toDataURL('image/png')
  if (!dataUrl.startsWith('data:image/png') || dataUrl.length < 512) {
    throw new Error('canvas toDataURL failed (thermal print pipeline)')
  }
}

export function useBootChecks() {
  const router = useRouter()
  const { t } = useI18n()

  /** حالة الخطوات الخمس — مصدر الحقيقة الوحيد للعرض */
  const steps = ref<BootStep[]>(
    BOOT_STEP_KEYS.map(key => ({ key, state: 'pending' as BootStepState })),
  )

  const currentStepIndex = computed(() => {
    const index = steps.value.findIndex(step => step.state === 'running')
    return index === -1 ? steps.value.length : index
  })

  const percent = computed(() => {
    const passed = steps.value.filter(step => step.state === 'passed').length
    const running = currentStepIndex.value < steps.value.length ? 0.5 : 0
    return Math.min(100, Math.round(((passed + running) / steps.value.length) * 100))
  })

  /** أول خطوة فشلت (لشاشة الأخطاء) — null لو كله تمام */
  const failedStep = computed<BootStep | null>(
    () => steps.value.find(step => step.state === 'failed') ?? null,
  )

  const currentStepLabel = computed(() => {
    // عند الفشل نعرض تسمية الخطوة الفاشلة نفسها بدل الخطوة التالية
    if (failedStep.value) return t(failedStep.value.key)
    return t(BOOT_STEP_KEYS[Math.min(currentStepIndex.value, BOOT_STEP_KEYS.length - 1)])
  })

  /** فحص 5: الجاهزية — تجميع النتائج + حلّ مسارات ما بعد الإقلاع */
  function checkReady(): void {
    for (const step of steps.value) {
      if (step.state === 'failed') {
        throw new Error(`previous check failed: ${step.key}`)
      }
    }
    for (const route of [ROUTE_NAMES.signIn, ROUTE_NAMES.dashboard]) {
      if (!router.resolve(route)) {
        throw new Error(`route unresolved: ${String(route)}`)
      }
    }
  }

  /** تشغيل الفحص الكامل — يرجع true عند النجاح الكامل و false عند أول فشل */
  async function runChecks(): Promise<boolean> {
    steps.value = BOOT_STEP_KEYS.map(key => ({ key, state: 'pending' as BootStepState }))

    const checks: Array<{ key: string; run: () => void | Promise<void> }> = [
      { key: BOOT_STEP_KEYS[0], run: () => checkCoreModules() },
      { key: BOOT_STEP_KEYS[1], run: () => checkFiscalDatabase() },
      { key: BOOT_STEP_KEYS[2], run: () => checkLocalizationTheme() },
      { key: BOOT_STEP_KEYS[3], run: () => checkGraphicsEngine() },
      { key: BOOT_STEP_KEYS[4], run: () => checkReady() },
    ]

    for (const [index, item] of checks.entries()) {
      steps.value[index] = { key: item.key, state: 'running' }
      try {
        // الفحص الفعلي + حد أدنى للعرض حتى يبقى التسلسل مقروءًا
        await Promise.all([Promise.resolve(item.run()), delay(MIN_STEP_MS)])
        steps.value[index] = { key: item.key, state: 'passed' }
      } catch (error) {
        steps.value[index] = {
          key: item.key,
          state: 'failed',
          detail: error instanceof Error ? error.message : String(error),
        }
        return false
      }
    }
    return true
  }

  return {
    steps,
    currentStepIndex,
    percent,
    currentStepLabel,
    failedStep,
    runChecks,
  }
}
