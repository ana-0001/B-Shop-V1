<!-- app/error.vue — صفحة الأخطاء العامة (Error Boundary):
     404 للمسارات المفقودة و 500 لأي استثناء غير متوقع
     و 503 لفشل فحص متطلبات الإقلاع (Boot Check) — بإعادة محاولة أوتوماتيكية بفواصل
     + أزرار إعادة المحاولة/التحديث اليدوية (قرار صاحب المشروع).
     شريط الحالة النظامي (SystemStatusBar) ظاهر في كل الشاشات حسب الطلب. -->
<script setup lang="ts">
import type { NuxtError } from '#app'
import { RefreshCw as IconRefreshCw, RotateCcw as IconRotateCcw } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import AppTitleBar from '@/components/shared/AppTitleBar.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import SystemStatusBar from '@/components/system-status-bar/SystemStatusBar.vue'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const isNotFound = computed(() => props.error.statusCode === 404)
/** حالة فشل فحص متطلبات الإقلاع — بيانات مرفقة من شاشة الإقلاع (pages/index.vue) */
const bootFailure = computed<{ failedKey: string; detail: string } | null>(() => {
  const data = props.error.data as { bootFailed?: boolean; failedKey?: string; detail?: string } | undefined
  if (props.error.statusCode === 503 && data?.bootFailed) {
    return { failedKey: data.failedKey ?? 'splash.step1', detail: data.detail ?? '' }
  }
  return null
})

const diagnostic = computed(
  () => props.error.statusMessage || props.error.message || 'Unexpected runtime exception.',
)

// ===== إعادة المحاولة الأوتوماتيكية لفشل فحص المتطلبات — على فترات محددة =====
const AUTO_RETRY_SECONDS = 10
const retryCountdown = ref(AUTO_RETRY_SECONDS)
let retryTimer: ReturnType<typeof setInterval> | null = null

function stopRetryTimer(): void {
  if (retryTimer) { clearInterval(retryTimer); retryTimer = null }
}

/** الرجوع لشاشة الإقلاع لإعادة الفحص من جديد (يدوي أو بعد انتهاء العدّاد) */
function retryBootCheck(): void {
  stopRetryTimer()
  clearError({ redirect: '/' })
}

/** تحديث كامل للتطبيق من الخادم (أقوى من إعادة الفحص فقط) */
function hardRefresh(): void {
  stopRetryTimer()
  window.location.assign('/')
}

watch(bootFailure, (failure) => {
  stopRetryTimer()
  if (!failure) return
  retryCountdown.value = AUTO_RETRY_SECONDS
  retryTimer = setInterval(() => {
    retryCountdown.value -= 1
    if (retryCountdown.value <= 0) retryBootCheck()
  }, 1000)
}, { immediate: true })

onBeforeUnmount(stopRetryTimer)

function recoverToDashboard(): void {
  clearError({ redirect: '/dashboard' })
}

function rebootToSplash(): void {
  clearError({ redirect: '/' })
}

useHead({ title: 'B-Shop — Error' })
</script>

<template>
  <div class="min-h-screen bg-bg p-sm flex">
    <div class="app-shell-frame">
      <AppTitleBar />

      <main class="flex-1 flex flex-col items-center justify-center p-md bg-surface-alt overflow-y-auto">
        <!-- فشل فحص متطلبات الإقلاع: إعادة محاولة أوتوماتيكية بفواصل + أزرار يدوية -->
        <template v-if="bootFailure">
          <ErrorState code="503" :diagnostic="''">
            <template #actions>
              <div class="flex flex-col items-center gap-sm w-full max-w-[26rem]">
                <div class="text-xs text-muted-f text-center font-semibold">
                  {{ t('errBoot.failedCheck') }}:
                  <strong class="text-bg-f">{{ t(bootFailure.failedKey) }}</strong>
                </div>
                <div
                  v-if="bootFailure.detail"
                  class="font-mono text-xs text-muted-f bg-surface border border-border rounded px-sm py-xs w-full text-center break-all"
                >
                  {{ t('errBoot.detail') }}: {{ bootFailure.detail }}
                </div>

                <!-- عدّاد إعادة المحاولة الأوتوماتيكية مع شريط تقدم -->
                <div class="w-full space-y-xs" role="status" aria-live="polite">
                  <div class="flex justify-between items-center text-xs font-bold text-muted-f">
                    <span>{{ t('errBoot.autoRetry', { seconds: retryCountdown }) }}</span>
                    <span class="font-mono">{{ retryCountdown }}s</span>
                  </div>
                  <div class="w-full h-2 bg-surface-alt rounded-full overflow-hidden border border-border">
                    <div
                      class="h-full bg-war transition-all duration-1000 ease-linear"
                      :style="{ inlineSize: `${(retryCountdown / AUTO_RETRY_SECONDS) * 100}%` }"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-center gap-sm">
                  <button type="button" class="erp-btn erp-btn-primary py-xs px-md text-xs" @click="retryBootCheck">
                    <IconRotateCcw class="w-3.5 h-3.5" />
                    <span>{{ t('errBoot.retryNow') }}</span>
                  </button>
                  <button type="button" class="erp-btn py-xs px-md text-xs" @click="hardRefresh">
                    <IconRefreshCw class="w-3.5 h-3.5" />
                    <span>{{ t('errBoot.refresh') }}</span>
                  </button>
                </div>
              </div>
            </template>
          </ErrorState>
        </template>

        <!-- 404 / 500 — السلوك الأصلي كما هو -->
        <ErrorState v-else :code="isNotFound ? '404' : '500'" :diagnostic="isNotFound ? '' : diagnostic">
          <template #actions>
            <template v-if="isNotFound">
              <button type="button" class="erp-btn py-xs px-md text-xs" @click="rebootToSplash">
                {{ t('err404.signin') }}
              </button>
              <button type="button" class="erp-btn erp-btn-primary py-xs px-md text-xs" @click="recoverToDashboard">
                {{ t('err404.dashboard') }}
              </button>
            </template>
            <template v-else>
              <button type="button" class="erp-btn erp-btn-primary py-xs px-md text-xs" @click="recoverToDashboard">
                {{ t('err500.recover') }}
              </button>
              <button type="button" class="erp-btn py-xs px-md text-xs" @click="rebootToSplash">
                {{ t('err500.reboot') }}
              </button>
            </template>
          </template>
        </ErrorState>
      </main>

      <!-- شريط الحالة النظامي في كل الشاشات بما فيها شاشات الأخطاء (قرار صاحب المشروع) -->
      <SystemStatusBar />
    </div>
  </div>
</template>
