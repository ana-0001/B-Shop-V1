<!-- shared/ErrorState.vue — شاشة الأخطاء الموحدة (404 / 500) بنفس تصميم الملف المرجعي -->
<script setup lang="ts">
import { Compass as IconCompass, TriangleAlert as IconTriangleAlert, LogIn as IconLogIn, ChartPie as IconChartPie, RotateCcw as IconRotateCcw, Power as IconPower } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import Button from '@/components/ui/Button.vue'

const props = withDefaults(
  defineProps<{
    code: '404' | '500'
    diagnostic?: string
  }>(),
  { diagnostic: '' },
)

const { t } = useI18n()
const router = useRouter()
const isNotFound = computed(() => props.code === '404')
</script>

<template>
  <article :class="['erp-card max-w-[32rem] w-full p-xl text-center space-y-md shadow-xl', !isNotFound && 'border-err']">
    <div
      :class="[
        'w-16 h-16 mx-auto rounded-full bg-surface-alt border flex items-center justify-center text-3xl',
        isNotFound ? 'border-border text-primary' : 'border-err text-err',
      ]"
    >
      <IconCompass v-if="isNotFound" class="w-8 h-8" />
      <IconTriangleAlert v-else class="w-8 h-8" />
    </div>

    <div :class="['text-3xl font-extrabold font-mono', isNotFound ? 'gradient-code-text' : 'text-err']">
      {{ t(`err${props.code}.code`) }}
    </div>

    <h1 class="text-xl font-extrabold text-bg-f">{{ t(`err${props.code}.title`) }}</h1>
    <p class="text-xs text-muted-f">{{ t(`err${props.code}.desc`) }}</p>

    <p v-if="!isNotFound && diagnostic" class="p-sm rounded bg-surface-alt border border-border text-xs font-mono text-err text-start break-all">
      {{ t('err500.diagnostic') }}: {{ diagnostic }}
    </p>

    <div class="flex flex-wrap items-center justify-center gap-sm pt-sm">
      <slot name="actions">
        <template v-if="isNotFound">
          <Button size="md" @click="router.push('/auth/sign-in')">
            <IconLogIn class="w-3.5 h-3.5 icon-directional" />
            <span>{{ t('err404.signin') }}</span>
          </Button>
          <Button variant="primary" size="md" @click="router.push('/dashboard')">
            <IconChartPie class="w-3.5 h-3.5" />
            <span>{{ t('err404.dashboard') }}</span>
          </Button>
        </template>
        <template v-else>
          <Button variant="primary" size="md" @click="router.push('/dashboard')">
            <IconRotateCcw class="w-3.5 h-3.5" />
            <span>{{ t('err500.recover') }}</span>
          </Button>
          <Button size="md" @click="router.push('/')">
            <IconPower class="w-3.5 h-3.5" />
            <span>{{ t('err500.reboot') }}</span>
          </Button>
        </template>
      </slot>
    </div>
  </article>
</template>
