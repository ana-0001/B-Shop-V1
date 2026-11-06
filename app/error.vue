<!-- app/error.vue — صفحة الأخطاء العامة (Error Boundary):
     404 للمسارات المفقودة و 500 لأي استثناء غير متوقع. -->
<script setup lang="ts">
import type { NuxtError } from '#app'
import { useI18n } from '@/composables/useI18n'
import AppTitleBar from '@/components/shared/AppTitleBar.vue'
import ErrorState from '@/components/shared/ErrorState.vue'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

const isNotFound = computed(() => props.error.statusCode === 404)

const diagnostic = computed(
  () => props.error.statusMessage || props.error.message || 'Unexpected runtime exception.',
)

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
        <ErrorState :code="isNotFound ? '404' : '500'" :diagnostic="isNotFound ? '' : diagnostic">
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

      <footer class="bg-bg border-t border-border px-md py-xs text-xs text-muted-f flex flex-wrap justify-between items-center gap-sm">
        <span class="flex items-center gap-xs">
          <span class="w-2 h-2 rounded-full bg-err" aria-hidden="true" />
          <span>{{ t('err500.diagnostic') }} · {{ props.error.statusCode }}</span>
        </span>
        <span class="font-mono">{{ t('splash.fiscalBuild') }}</span>
      </footer>
    </div>
  </div>
</template>
