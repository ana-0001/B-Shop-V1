<!-- pages/terms.vue — شاشة الشروط والأحكام (5 بنود إلزامية + checkbox لتفعيل القبول) -->
<script setup lang="ts">
import { ArrowRight as IconArrowRight, LogOut as IconLogOut } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useAuthStore } from '@/stores/auth'
import { resolvePostAuthRoute } from '@/utils/auth-flow'
import { ROUTE_NAMES } from '@/utils/constants'
import AppLogo from '@/components/shared/AppLogo.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { toast } = useSonner()
const auth = useAuthStore()
const router = useRouter()

useHead({ title: 'B-Shop — Terms & Conditions' })

const hasAgreed = ref(false)

/** البنود الخمسة — نصوصها في ملفات الترجمة (en/ar) */
const clauses = computed(() =>
  [1, 2, 3, 4, 5].map(index => ({
    title: t(`terms.clause${index}Title`),
    body: t(`terms.clause${index}Body`),
  })),
)

/** قبول الشروط والتوجيه حسب بوابات الـ Onboarding */
function acceptTerms(): void {
  auth.acceptTerms()
  toast.success(t('notif.termsAccepted'))
  router.push(resolvePostAuthRoute(false, auth.needsOnboarding))
}

/** رفض الشروط = تسجيل خروج كامل */
async function declineTerms(): Promise<void> {
  await auth.signOut()
  toast.warning(t('notif.termsDeclined'))
  router.push(ROUTE_NAMES.signIn)
}
</script>

<template>
  <section class="erp-glass-card max-w-[42rem] w-full space-y-md">
    <header class="flex items-center justify-between border-b border-border pb-sm gap-sm">
      <div class="flex items-center gap-sm">
        <span class="w-10 h-10 rounded-lg bg-primary text-primary-f flex items-center justify-center text-lg">
          <AppLogo size="sm" />
        </span>
        <div>
          <h1 class="text-xl font-extrabold text-bg-f">{{ t('terms.title') }}</h1>
          <p class="text-xs text-muted-f">{{ t('terms.subtitle') }}</p>
        </div>
      </div>
      <Badge variant="war">{{ t('terms.badge') }}</Badge>
    </header>

    <!-- البنود الخمسة -->
    <div class="max-h-64 overflow-y-auto space-y-sm p-sm rounded-lg border border-border bg-surface text-xs">
      <article v-for="clause in clauses" :key="clause.title" class="p-sm rounded border border-border bg-surface-alt space-y-xs">
        <h3 class="font-extrabold text-primary">{{ clause.title }}</h3>
        <p class="text-muted-f leading-relaxed">{{ clause.body }}</p>
      </article>
    </div>

    <!-- مربع الموافقة الإلزامي -->
    <label class="flex items-center gap-sm p-sm rounded border border-border bg-surface-alt cursor-pointer text-xs font-bold text-bg-f">
      <Checkbox id="termsAgreeCheckbox" v-model="hasAgreed" />
      <span>{{ t('terms.agreeLabel') }}</span>
    </label>

    <div class="flex items-center justify-between gap-sm pt-xs flex-wrap">
      <Button variant="danger" size="md" @click="declineTerms">
        <IconLogOut class="w-3.5 h-3.5 icon-directional" />
        <span>{{ t('terms.decline') }}</span>
      </Button>
      <Button variant="primary" size="lg" :disabled="!hasAgreed" @click="acceptTerms">
        <span>{{ t('terms.accept') }}</span>
        <IconArrowRight class="w-3.5 h-3.5 icon-directional" />
      </Button>
    </div>
  </section>
</template>
