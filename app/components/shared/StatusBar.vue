<!-- shared/StatusBar.vue — شريط الحالة السفلي (اتصال، مستخدم، تبويبات، ساعة، عملة) -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useClock } from '@/composables/useClock'
import { useAuthStore } from '@/stores/auth'
import { useInvoicesStore } from '@/stores/invoices'
import { formatTime } from '@/utils/dates'
import Badge from '@/components/ui/Badge.vue'

const { t, locale } = useI18n()
const { now } = useClock()
const auth = useAuthStore()
const invoicesStore = useInvoicesStore()
</script>

<template>
  <footer class="bg-bg text-muted-f px-md py-xs text-xs flex flex-wrap justify-between items-center border-t border-border select-none">
    <div class="flex items-center gap-md flex-wrap">
      <span class="flex items-center gap-xs">
        <span class="w-2 h-2 rounded-full bg-ok" aria-hidden="true" />
        <span>{{ t('status.online') }}</span>
      </span>
      <span class="border-s border-border ps-md flex items-center gap-xs">
        <strong class="text-bg-f">{{ auth.user?.displayName }}</strong>
        <Badge v-if="auth.isSuperBombaUser" variant="primary">{{ t('user.systemCreator') }}</Badge>
      </span>
      <span class="border-s border-border ps-md">
        {{ t('status.openTabs') }}
        <strong class="text-bg-f font-mono">{{ invoicesStore.tabs.length }}</strong>
      </span>
    </div>

    <div class="flex items-center gap-xs font-mono">
      <span>{{ formatTime(now, locale) }}</span>
      <span class="border-s border-border ps-md">{{ t('splash.fiscalBuild') }}</span>
    </div>
  </footer>
</template>
