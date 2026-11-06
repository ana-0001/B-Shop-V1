/**
 * app/stores/auth.ts — متجر المصادقة (الجلسة، الشروط، الإعداد الأولي).
 * - تسجيل الدخول بيمر على طبقة الـ API (Mock حاليًا — bcrypt في الباك إند لاحقًا).
 * - حالة قبول الشروط واكتمال الإعداد بتتحفظ محليًا عشان بوابات الـ middleware.
 * - nuxt-auth-utils متوفر كواجهة مصادقة رسمية — راجع docs/06-backend-migration.md.
 */
import { defineStore } from 'pinia'
import type { AuthResponse, SessionUser } from '@/types'
import { isSuperBomba } from '@/utils/permissions'
import { authApi } from '@/services/api/endpoints'
import { nowUtcIso } from '@/utils/dates'

export interface OperatorProfile {
  jobTitle: string
  avatarIcon: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    /** المستخدم الحالي — null يعني زائر */
    const user = ref<SessionUser | null>(null)

    /** تاريخ قبول الشروط (UTC) — null يعني لسه ما قبلهمش */
    const termsAcceptedAt = ref<string | null>(null)

    /** هل اكتمل الإعداد الأولي (Onboarding)؟ */
    const onboardingCompleted = ref(false)

    /** بيانات الملف الوظيفي من خطوة الإعداد الثانية */
    const operatorProfile = ref<OperatorProfile>({ jobTitle: '', avatarIcon: 'user-cog' })

    // ===== Getters =====
    const isAuthenticated = computed(() => !!user.value)
    const isSuperBombaUser = computed(() => isSuperBomba(user.value))
    const needsTerms = computed(() => isAuthenticated.value && !termsAcceptedAt.value)
    const needsOnboarding = computed(() => isAuthenticated.value && !!termsAcceptedAt.value && !onboardingCompleted.value)

    // ===== Actions =====
    /** تسجيل الدخول بالمعرّف الموحد — بيرمي ApiRequestError عند الفشل */
    async function signIn(identifier: string, password: string): Promise<AuthResponse> {
      const response = await authApi.signIn({ identifier, password })
      user.value = response.user
      // حالة البوابات بتقرأ من استجابة الـ API (زي الباك إند الحقيقي)
      termsAcceptedAt.value = response.termsAccepted ? (response.termsAcceptedAt ?? nowUtcIso()) : null
      onboardingCompleted.value = response.onboardingCompleted
      if (response.operatorProfile) operatorProfile.value = response.operatorProfile
      return response
    }

    /** تسجيل الخروج وتصفير حالة الجلسة بالكامل */
    async function signOut(): Promise<void> {
      try {
        await authApi.signOut()
      } finally {
        user.value = null
        termsAcceptedAt.value = null
        onboardingCompleted.value = false
        operatorProfile.value = { jobTitle: '', avatarIcon: 'user-cog' }
      }
    }

    /** قبول الشروط والأحكام — بيتخزن على المستخدم في الـ API وبيسجل التوقيت UTC */
    async function acceptTerms(): Promise<void> {
      if (user.value) {
        const res = await authApi.acceptTerms(user.value.id)
        termsAcceptedAt.value = res.termsAcceptedAt
      } else {
        termsAcceptedAt.value = nowUtcIso()
      }
    }

    /** حفظ بيانات الإعداد الأولي وإنهاء الـ Onboarding — بيتخزن على المستخدم في الـ API */
    async function completeOnboarding(profile: OperatorProfile): Promise<void> {
      if (user.value) {
        await authApi.completeOnboarding(user.value.id, profile)
      }
      operatorProfile.value = profile
      onboardingCompleted.value = true
    }

    return {
      user,
      termsAcceptedAt,
      onboardingCompleted,
      operatorProfile,
      isAuthenticated,
      isSuperBombaUser,
      needsTerms,
      needsOnboarding,
      signIn,
      signOut,
      acceptTerms,
      completeOnboarding,
    }
  },
  { persist: true },
)
