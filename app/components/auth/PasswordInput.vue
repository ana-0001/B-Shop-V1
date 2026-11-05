<!-- components/auth/PasswordInput.vue — حقل كلمة المرور مع زر إظهار/إخفاء ورسالة تحقق -->
<script setup lang="ts">
import { Eye as IconEye, EyeOff as IconEyeOff } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import Label from '@/components/ui/Label.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    /** رسالة خطأ جاهزة (مترجمة) من مستوى النموذج */
    errorMessage?: string | null
    disabled?: boolean
  }>(),
  { id: 'authPassword', errorMessage: null, disabled: false, modelValue: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()

const isVisible = ref(false)

const hasError = computed(() => !!props.errorMessage || (props.modelValue.length > 0 && props.modelValue.length < 6))
const isValid = computed(() => !props.errorMessage && props.modelValue.length >= 6)

const feedbackText = computed(() => {
  if (props.errorMessage) return props.errorMessage
  if (isValid.value) return t('signin.okPass')
  if (props.modelValue.length > 0) return t('signin.errPassShort')
  return ''
})
</script>

<template>
  <div>
    <Label :for="props.id">{{ t('signin.passLabel') }}</Label>

    <div class="relative">
      <input
        :id="props.id"
        :type="isVisible ? 'text' : 'password'"
        autocomplete="new-password"
        :value="modelValue"
        :disabled="disabled"
        class="erp-input pe-8"
        placeholder="••••••••"
        :aria-invalid="hasError"
        :aria-describedby="`${props.id}-feedback`"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        type="button"
        class="absolute end-2 top-1/2 -translate-y-1/2 text-muted-f hover:text-bg-f px-xs"
        :aria-label="isVisible ? 'Hide password' : 'Show password'"
        @click="isVisible = !isVisible"
      >
        <IconEye v-if="!isVisible" class="w-3.5 h-3.5" />
        <IconEyeOff v-else class="w-3.5 h-3.5" />
      </button>
    </div>

    <p
      v-if="feedbackText"
      :id="`${props.id}-feedback`"
      class="text-xs mt-xs font-semibold"
      :class="hasError ? 'text-err' : 'text-ok'"
    >
      {{ feedbackText }}
    </p>
  </div>
</template>
