<!-- components/auth/DevCredentialsHint.vue — صندوق تلميح الوضع التجريبي (ملء تلقائي لبيانات bomba) -->
<script setup lang="ts">
import { CodeXml as IconCodeXml, WandSparkles as IconWandSparkles } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits<{
  autofill: [payload: { identifier: string; password: string }]
}>()

const { t } = useI18n()
const { toast } = useSonner()

/** بيانات صانع النظام من الـ Seed (تجريبية للوضع Development فقط) */
function fillDemoCredentials(): void {
  emit('autofill', { identifier: 'bomba000@bomba.com', password: 'bomba000' })
  toast.success(t('notif.fillDemo'))
}
</script>

<template>
  <div class="p-sm rounded-lg border border-dashed border-primary bg-surface-alt space-y-xs text-xs">
    <div class="flex items-center justify-between font-bold text-primary gap-xs flex-wrap">
      <span class="flex items-center gap-xs">
        <IconCodeXml class="w-3.5 h-3.5" />
        <span>{{ t('signin.devTitle') }}</span>
      </span>
      <Button variant="primary" size="sm" @click="fillDemoCredentials">
        <IconWandSparkles class="w-3.5 h-3.5" />
        <span>{{ t('signin.autofill') }}</span>
      </Button>
    </div>
    <p class="text-muted-f">{{ t('signin.devDesc') }}</p>
  </div>
</template>
