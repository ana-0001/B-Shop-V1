<!-- pages/onboarding.vue — معالج الإعداد الأولي (4 خطوات: ترحيب → ملف → ثيم/لغة → إكمال) -->
<script setup lang="ts">
import { ArrowLeft as IconArrowLeft, ArrowRight as IconArrowRight } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/utils/constants'
import OnboardingStepper from '@/components/onboarding/OnboardingStepper.vue'
import StepWelcome from '@/components/onboarding/StepWelcome.vue'
import StepProfile from '@/components/onboarding/StepProfile.vue'
import StepAppearance from '@/components/onboarding/StepAppearance.vue'
import StepComplete from '@/components/onboarding/StepComplete.vue'
import Button from '@/components/ui/Button.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { toast } = useSonner()
const auth = useAuthStore()
const router = useRouter()

useHead({ title: 'B-Shop — Onboarding' })

const TOTAL_STEPS = 4
const currentStep = ref(1)

/** بيانات الملف الشخصي — بتتربط بمتجر المصادقة */
const jobTitle = ref(auth.operatorProfile.jobTitle)
const avatarIcon = ref(auth.operatorProfile.avatarIcon)

const isLastStep = computed(() => currentStep.value === TOTAL_STEPS)

function nextStep(): void {
  // آخر خطوة: حفظ الإعدادات وفتح النظام الرئيسي
  if (isLastStep.value) {
    void finishOnboarding()
    return
  }
  currentStep.value = Math.min(TOTAL_STEPS, currentStep.value + 1)
}

/** حفظ الإعداد في الـ API أولًا ثم فتح لوحة التحكم */
async function finishOnboarding(): Promise<void> {
  await auth.completeOnboarding({ jobTitle: jobTitle.value.trim(), avatarIcon: avatarIcon.value })
  toast.success(t('notif.onboardingDone'))
  router.push(ROUTE_NAMES.dashboard)
}

function previousStep(): void {
  currentStep.value = Math.max(1, currentStep.value - 1)
}
</script>

<template>
  <section class="erp-card bg-glass max-w-[40rem] w-full p-xl space-y-lg shadow-xl">
    <OnboardingStepper :current="currentStep" :total="TOTAL_STEPS" />

    <!-- محتوى الخطوة الديناميكي -->
    <div class="min-h-[15rem] flex flex-col justify-center">
      <StepWelcome v-if="currentStep === 1" />
      <StepProfile
        v-else-if="currentStep === 2"
        v-model:job-title="jobTitle"
        v-model:avatar-icon="avatarIcon"
      />
      <StepAppearance v-else-if="currentStep === 3" />
      <StepComplete
        v-else
        :display-name="auth.user?.displayName ?? ''"
        :job-title="jobTitle"
      />
    </div>

    <!-- أزرار التنقل -->
    <div class="flex items-center justify-between border-t border-border pt-md">
      <Button size="md" :disabled="currentStep === 1" @click="previousStep">
        <IconArrowLeft class="w-3.5 h-3.5 icon-directional" />
        <span>{{ t('onboard.prev') }}</span>
      </Button>
      <Button variant="primary" size="md" @click="nextStep">
        <span>{{ isLastStep ? t('onboard.finish') : t('onboard.next') }}</span>
        <IconArrowRight class="w-3.5 h-3.5 icon-directional" />
      </Button>
    </div>
  </section>
</template>
