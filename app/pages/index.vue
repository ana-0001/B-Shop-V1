<!-- pages/index.vue — شاشة الإقلاع (Splash) بخطوات الفحص الخمسة والتوجيه التلقائي -->
<script setup lang="ts">
import { Cuboid as IconCuboid, RotateCcw as IconRotateCcw, ArrowRight as IconArrowRight } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'
import { resolvePostAuthRoute } from '@/utils/auth-flow'
import { ROUTE_NAMES } from '@/utils/constants'
import BootProgress from '@/components/splash/BootProgress.vue'
import BootStepsList from '@/components/splash/BootStepsList.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()

useHead({ title: 'B-Shop ERP' })

/** مفاتيح خطوات الفحص الخمسة — زي ملف التصميم */
const STEP_KEYS = ['splash.step1', 'splash.step2', 'splash.step3', 'splash.step4', 'splash.step5']

const stepIndex = ref(0)
let bootTimer: ReturnType<typeof setInterval> | null = null
let redirectTimer: ReturnType<typeof setTimeout> | null = null

const percent = computed(() => Math.min(100, Math.round(((stepIndex.value + 1) / STEP_KEYS.length) * 100)))
const currentStepLabel = computed(() => t(STEP_KEYS[Math.min(stepIndex.value, STEP_KEYS.length - 1)]))

const progressProps = computed(() => ({
  currentStepLabel: currentStepLabel.value,
  percent: percent.value,
}))

function stopTimers(): void {
  if (bootTimer) { clearInterval(bootTimer); bootTimer = null }
  if (redirectTimer) { clearTimeout(redirectTimer); redirectTimer = null }
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

function startBootSequence(): void {
  stopTimers()
  stepIndex.value = 0
  bootTimer = setInterval(() => {
    if (stepIndex.value < STEP_KEYS.length - 1) {
      stepIndex.value += 1
    } else {
      stopTimers()
      // تأخير بسيط بعد اكتمال الفحص ثم توجيه تلقائي — زي ملف التصميم
      redirectTimer = setTimeout(() => {
        continueToWorkspace()
      }, 450)
    }
  }, 420)
}

onMounted(startBootSequence)
onBeforeUnmount(stopTimers)
</script>

<template>
  <section class="flex-1 flex flex-col justify-between">
    <div class="flex-1 flex flex-col items-center justify-center p-md">
      <div class="erp-card max-w-[32rem] w-full p-xl text-center space-y-lg shadow-xl">
        <div class="w-16 h-16 mx-auto rounded-xl bg-primary text-primary-f flex items-center justify-center text-2xl font-extrabold shadow-md">
          <IconCuboid class="w-8 h-8" />
        </div>

        <div>
          <Badge variant="primary" class="mb-xs">{{ t('app.versionBadge') }}</Badge>
          <h1 class="text-2xl font-extrabold text-bg-f mt-xs">{{ t('splash.title') }}</h1>
          <p class="text-xs text-muted-f mt-xs">{{ t('splash.subtitle') }}</p>
        </div>

        <BootProgress v-bind="progressProps" />

        <BootStepsList :steps="STEP_KEYS.map(key => t(key))" :current-index="stepIndex" />

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
