<!-- components/onboarding/StepProfile.vue — الخطوة 2: الملف الشخصي والمسمى الوظيفي والأيقونة -->
<script setup lang="ts">
import { UserCog as IconUserCog, Calculator as IconCalculator, Store as IconStore, Warehouse as IconWarehouse } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'

const props = defineProps<{
  jobTitle: string
  avatarIcon: string
}>()

const emit = defineEmits<{
  'update:jobTitle': [value: string]
  'update:avatarIcon': [value: string]
}>()

const { t } = useI18n()

/** الأيقونات الرمزية المتاحة للمشغل */
const avatarOptions = [
  { key: 'user-cog', icon: IconUserCog },
  { key: 'calculator', icon: IconCalculator },
  { key: 'store', icon: IconStore },
  { key: 'warehouse', icon: IconWarehouse },
] as const
</script>

<template>
  <div class="space-y-md">
    <h2 class="text-lg font-extrabold text-bg-f">{{ t('onboard.step2Title') }}</h2>

    <div>
      <Label for="onboardJobTitle">{{ t('onboard.jobTitleLabel') }}</Label>
      <Input
        id="onboardJobTitle"
        :model-value="props.jobTitle"
        :placeholder="t('onboard.jobTitlePlaceholder')"
        @update:model-value="emit('update:jobTitle', $event)"
      />
    </div>

    <div>
      <span class="block text-xs font-bold text-bg-f mb-xs">{{ t('onboard.avatarLabel') }}</span>
      <div class="flex items-center gap-sm flex-wrap">
        <button
          v-for="option in avatarOptions"
          :key="option.key"
          type="button"
          class="w-12 h-12 rounded-lg border flex items-center justify-center text-lg transition-all"
          :class="props.avatarIcon === option.key
            ? 'bg-primary text-primary-f border-primary shadow-md'
            : 'bg-surface-alt text-bg-f border-border hover:bg-hover'"
          :aria-pressed="props.avatarIcon === option.key"
          @click="emit('update:avatarIcon', option.key)"
        >
          <component :is="option.icon" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>
