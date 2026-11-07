<!-- pages/index.vue — شاشة الإقلاع (Splash) بفحص المتطلبات الخمسة الحقيقي والتوجيه الشرطي.
     قرار صاحب المشروع: الدخول للشاشة التالية (تسجيل الدخول أو الرئيسية) بعد نجاح الفحص فقط،
     وعند عدم التوافق → شاشة الأخطاء (503) مع إعادة محاولة أوتوماتيكية بفواصل + زر يدوي. -->
<script setup lang="ts">
import { createError, showError } from '#app'
import { Cuboid as IconCuboid, RotateCcw as IconRotateCcw, ArrowRight as IconArrowRight } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import { resolvePostAuthRoute } from '@/utils/auth-flow'
import { ROUTE_NAMES } from '@/utils/constants'
import { useBootChecks } from '@/components/splash/useBootChecks'
import BootProgress from '@/components/splash/BootProgress.vue'
import BootStepsList from '@/components/splash/BootStepsList.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

useHead({ title: 'B-Shop ERP' })

const {
  steps,
  currentStepIndex,
  percent,
  currentStepLabel,
  failedStep,
  runChecks,
} = useBootChecks()

/** تأخير بسيط بعد اكتمال الفحص قبل التوجيه — زي ملف التصميم */
const REDIRECT_DELAY_MS = 450
/** مهلة إظهار الخطوة الفاشلة قبل الانتقال لشاشة الأخطاء (حتى يراها المستخدم) */
const FAIL_PAUSE_MS = 900

let redirectTimer: ReturnType<typeof setTimeout> | null = null
let failTimer: ReturnType<typeof setTimeout> | null = null

function stopTimers(): void {
  if (redirectTimer) { clearTimeout(redirectTimer); redirectTimer = null }
  if (failTimer) { clearTimeout(failTimer); failTimer = null }
}

/** التوجيه حسب حالة الجلسة: دخول → شروط → إعداد → لوحة التحكم */
function continueToWorkspace(): void {
  stopTimers()
  if (!auth.isAuthenticated) {
    router.push(ROUTE_NAMES.signIn)
    return
  }
  router.push(resolvePostAuthRoute(auth.needsTerms, auth.needsOnboarding))
}

/** الانتقال إلى شاشة الأخطاء بحالة فشل فحص المتطلبات (كود 503 + بيانات الفحص)
     — شاشة الأخطاء فيها إعادة محاولة أوتوماتيكية بفواصل + زر إعادة يدوي */
function failToErrorScreen(): void {
  const failed = failedStep.value
  showError(createError({
    statusCode: 503,
    statusMessage: 'B-Shop system requirements check failed',
    fatal: true,
    data: {
      bootFailed: true,
      failedKey: failed?.key ?? 'splash.step1',
      detail: failed?.detail ?? '',
    },
  }))
}

/** تشغيل تسلسل الإقلاع: فحص فعلي → نجاح: توجيه تلقائي / فشل: شاشة الأخطاء */
const isBooting = ref(false)

async function startBootSequence(): Promise<void> {
  if (isBooting.value) return // حماية من التشغيل المتزامن (نقر مكرر على إعادة الفحص)
  isBooting.value = true
  stopTimers()
  try {
    const passed = await runChecks()
    if (passed) {
      redirectTimer = setTimeout(continueToWorkspace, REDIRECT_DELAY_MS)
      return
    }
    failTimer = setTimeout(failToErrorScreen, FAIL_PAUSE_MS)
  } finally {
    isBooting.value = false
  }
}

onMounted(startBootSequence)
onBeforeUnmount(stopTimers)
</script>

<template>
  <section class="flex-1 flex flex-col justify-between">
    <div class="flex-1 flex flex-col items-center justify-center p-md">
      <div class="erp-card bg-glass max-w-[32rem] w-full p-xl text-center space-y-lg shadow-xl">
        <div class="w-16 h-16 mx-auto rounded-xl bg-primary text-primary-f flex items-center justify-center text-2xl font-extrabold shadow-md">
          <IconCuboid class="w-8 h-8" />
        </div>

        <div>
          <Badge variant="primary" class="mb-xs">{{ t('app.versionBadge') }}</Badge>
          <h1 class="text-2xl font-extrabold text-bg-f mt-xs">{{ t('splash.title') }}</h1>
          <p class="text-xs text-muted-f mt-xs">{{ t('splash.subtitle') }}</p>
        </div>

        <BootProgress :current-step-label="currentStepLabel" :percent="percent" />

        <BootStepsList
          :steps="steps.map(step => t(step.key))"
          :states="steps.map(step => step.state)"
          :current-index="currentStepIndex"
        />

        <div class="flex items-center justify-center gap-sm pt-xs">
          <Button size="md" @click="startBootSequence">
            <IconRotateCcw class="w-3.5 h-3.5" />
            <span>{{ t('splash.replay') }}</span>
          </Button>
          <Button variant="primary" size="md" @click="continueToWorkspace">
            <span>{{ t('splash.skip') }}</span>
            <IconArrowRight class="w-3.5 h-3.5 icon-directional" />
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>
