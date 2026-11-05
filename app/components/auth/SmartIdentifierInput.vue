<!-- components/auth/SmartIdentifierInput.vue — حقل المعرّف الموحد الذكي.
     بيكشف النوع أثناء الكتابة (بريد / موبايل / اسم مستخدم) ويعرض Badge وأيقونة مناسبة،
     بنفس سلوك ملف التصميم المرجعي حرفيًا. -->
<script setup lang="ts">
import { Mail as IconMail, Smartphone as IconSmartphone, UserCheck as IconUserCheck, UserRound as IconUserRound } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import {
  detectIdentifierType,
  identifierBadgeClass,
  identifierBadgeKey,
  identifierFeedbackKey,
} from '@/utils/identifier'
import Label from '@/components/ui/Label.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    id?: string
    /** رسالة خطأ جاهزة (مترجمة) من مستوى النموذج — بتلغي رسالة الفحص اللحظي */
    errorMessage?: string | null
    disabled?: boolean
  }>(),
  { id: 'authIdentifier', errorMessage: null, disabled: false, modelValue: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { t } = useI18n()

const detectedType = computed(() => detectIdentifierType(props.modelValue))
const isInvalid = computed(() => detectedType.value === 'invalid' || detectedType.value === 'empty')
const hasError = computed(() => !!props.errorMessage || isInvalid.value)
const isValid = computed(() => !props.errorMessage && (detectedType.value === 'email' || detectedType.value === 'phone' || detectedType.value === 'username'))

const feedbackText = computed(() => {
  if (props.errorMessage) return props.errorMessage
  return t(identifierFeedbackKey(detectedType.value))
})

const trailingIcon = computed(() => {
  switch (detectedType.value) {
    case 'email': return IconMail
    case 'phone': return IconSmartphone
    case 'username': return IconUserCheck
    default: return IconUserRound
  }
})

const iconClass = computed(() => (isValid.value ? 'text-ok' : 'text-muted-f'))
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-xs">
      <Label :for="props.id" class="!mb-0">{{ t('signin.idLabel') }}</Label>
      <span class="erp-badge" :class="identifierBadgeClass(detectedType)">
        {{ t(identifierBadgeKey(detectedType)) }}
      </span>
    </div>

    <div class="relative">
      <input
        :id="props.id"
        type="text"
        autocomplete="off"
        :value="modelValue"
        :disabled="disabled"
        class="erp-input pe-8"
        :placeholder="t('signin.idPlaceholder')"
        :aria-invalid="hasError"
        :aria-describedby="`${props.id}-feedback`"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <component :is="trailingIcon" class="w-3.5 h-3.5 absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" :class="iconClass" />
    </div>

    <p :id="`${props.id}-feedback`" class="text-xs mt-xs font-semibold" :class="hasError ? 'text-err' : isValid ? 'text-ok' : 'text-muted-f'">
      {{ feedbackText }}
    </p>
  </div>
</template>
