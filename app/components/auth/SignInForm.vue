<!-- components/auth/SignInForm.vue — نموذج تسجيل الدخول (VeeValidate + Zod).
     التحقق بالمخططات في schemas/auth.ts، ورسائل الخطأ مفاتيح ترجمة بتترجم عبر t(). -->
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { LogIn as IconLogIn } from 'lucide-vue-next'
import { signInSchema } from '@/schemas/auth'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useAuthStore } from '@/stores/auth'
import { resolvePostAuthRoute } from '@/utils/auth-flow'
import SmartIdentifierInput from '@/components/auth/SmartIdentifierInput.vue'
import PasswordInput from '@/components/auth/PasswordInput.vue'
import DevCredentialsHint from '@/components/auth/DevCredentialsHint.vue'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'

const { t } = useI18n()
const { toast } = useSonner()
const auth = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)

const validationSchema = toTypedSchema(signInSchema)

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema,
  initialValues: { identifier: '', password: '', remember: true },
})

const [identifier] = defineField('identifier')
const [password] = defineField('password')
const [remember] = defineField('remember')

/** رسائل الخطأ المترجمة للحقول (narrowing صريح لنوع vee-validate) */
const identifierErrorMessage = computed(() => {
  const error = errors.value.identifier
  return error ? t(error) : null
})

const passwordErrorMessage = computed(() => {
  const error = errors.value.password
  return error ? t(error) : null
})

/** ملء تلقائي من صندوق التلميح التجريبي */
function handleAutofill(payload: { identifier: string; password: string }): void {
  setValues({ identifier: payload.identifier, password: payload.password, remember: true })
}

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true
  try {
    await auth.signIn(values.identifier, values.password)
    toast.success(t('signin.welcome', { name: auth.user?.displayName ?? '' }))
    router.push(resolvePostAuthRoute(auth.needsTerms, auth.needsOnboarding))
  } catch {
    toast.error(t('signin.errCredentials'))
  } finally {
    isSubmitting.value = false
  }
}, () => {
  toast.error(t('notif.validationErrors'))
})
</script>

<template>
  <form class="space-y-md" novalidate @submit.prevent="onSubmit">
    <SmartIdentifierInput
      v-model="identifier"
      :error-message="identifierErrorMessage"
      :disabled="isSubmitting"
    />

    <PasswordInput
      v-model="password"
      :error-message="passwordErrorMessage"
      :disabled="isSubmitting"
    />

    <!-- تذكرني -->
    <div class="flex items-center justify-between text-xs">
      <label class="flex items-center gap-xs cursor-pointer font-semibold text-bg-f">
        <Checkbox id="authRemember" v-model="remember" />
        <span>{{ t('signin.remember') }}</span>
      </label>
      <span class="text-primary font-bold">v1.0 Dev</span>
    </div>

    <Button type="submit" variant="primary" size="md" class="w-full py-sm shadow-md" :disabled="isSubmitting">
      <IconLogIn class="w-4 h-4 icon-directional" />
      <span>{{ isSubmitting ? t('signin.signingIn') : t('signin.submit') }}</span>
    </Button>

    <DevCredentialsHint @autofill="handleAutofill" />
  </form>
</template>
