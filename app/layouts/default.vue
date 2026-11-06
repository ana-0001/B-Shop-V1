<!-- layouts/default.vue — شل النظام الرئيسي:
     شريط التنقل + الإجراءات السريعة + البحث العام + الفرع + التاريخ + قائمة المستخدم
     + شريط الحالة النظامي (SystemStatusBar) في الفوتر أسفل مساحة العمل -->
<script setup lang="ts">
import {
  ChartPie as IconChartPie,
  FileText as IconFileText,
  Coins as IconCoins,
  Warehouse as IconWarehouse,
  ChartColumn as IconChartColumn,
  FilePlus2 as IconFilePlus2,
  Archive as IconArchive,
  CloudDownload as IconCloudDownload,
  Database as IconDatabase,
  Bug as IconBug,
} from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useAppData } from '@/composables/useAppData'
import { useSystemMeta } from '@/composables/useSystemMeta'
import { useInvoicesStore } from '@/stores/invoices'
import { usePreferencesStore } from '@/stores/preferences'
import { invoicesApi } from '@/services/api/endpoints'
import { onBusEvent } from '@/utils/bus'
import { formatDate } from '@/utils/dates'
import { localizedEntityName } from '@/types'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Select from '@/components/ui/Select.vue'
import GlobalSearch from '@/components/shared/GlobalSearch.vue'
import UserMenu from '@/components/shared/UserMenu.vue'
import HeldInvoicesDialog from '@/components/shared/HeldInvoicesDialog.vue'
import ResetDbDialog from '@/components/shared/ResetDbDialog.vue'
import SyncSkeleton from '@/components/shared/SyncSkeleton.vue'
import SystemStatusBar from '@/components/system-status-bar/SystemStatusBar.vue'

const { t, locale, setLocale } = useI18n()

/** هل نحن في وضع التطوير؟ (زر محاكاة خطأ 500 يظهر في الـ dev فقط) */
const isDev = import.meta.dev
const { toast } = useSonner()
const router = useRouter()
const route = useRoute()
const { isSyncing, refreshMockData } = useAppData()
const { meta, load } = useSystemMeta()
const invoicesStore = useInvoicesStore()
const preferences = usePreferencesStore()

/** عناصر شريط التنقل الرئيسي */
const navItems = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: IconChartPie },
  { to: '/invoices', labelKey: 'nav.invoices', icon: IconFileText },
  { to: '/accounts', labelKey: 'nav.accounts', icon: IconCoins },
  { to: '/inventory', labelKey: 'nav.inventory', icon: IconWarehouse },
  { to: '/reports', labelKey: 'nav.reports', icon: IconChartColumn },
] as const

function isActive(to: string): boolean {
  return route.path === to || route.path.startsWith(`${to}/`)
}

/** حالة النوافذ المشتركة */
const heldDialogOpen = useState('bshop:heldDialogOpen', () => false)
const resetDialogOpen = useState('bshop:resetDialogOpen', () => false)

/** عدد الفواتير المعلّقة لشارة شريط الأدوات — حالة مشتركة بين الـ layout وشريط التبويبات */
const heldCount = useState('bshop:heldCount', () => 0)

async function refreshHeldCount(): Promise<void> {
  try {
    heldCount.value = (await invoicesApi.listHeld()).length
  } catch {
    heldCount.value = 0
  }
}

onMounted(async () => {
  await load()
  await refreshHeldCount()
})

// تحديث الشارة مع كل مزامنة أو تصفير أو رجوع من شاشة الفواتير
watch(() => route.path, () => refreshHeldCount())
onBusEvent('bshop:sync', () => refreshHeldCount())
onBusEvent('bshop:db-reset', () => refreshHeldCount())

/** إجراءات سريعة */
function newInvoice(): void {
  router.push('/invoices?new=1')
}

function openHeldDialog(): void {
  heldDialogOpen.value = true
}

function openResetDialog(): void {
  resetDialogOpen.value = true
}

/** محاكاة خطأ 500 لاختبار الـ Error Boundary (وضع التطوير فقط) */
function simulateCrash(): void {
  throw createError({
    statusCode: 500,
    statusMessage: 'Simulated runtime exception for error-boundary testing.',
    fatal: true,
  })
}

/** خيارات الفرع في شريط الأدوات */
const branchOptions = computed(() => [
  { value: 'ALL', label: t('wh.allBranches') },
  ...(meta.value?.branches ?? []).map(branch => ({
    value: branch.id,
    label: localizedEntityName(branch, locale.value),
  })),
])

/** تاريخ العمليات الحالي من بيانات النظام */
const operationDate = computed(() =>
  meta.value ? formatDate(meta.value.operationDate, locale.value) : '',
)

// ===== اختصارات لوحة المفاتيح (نفس ملف التصميم) =====
function handleKeydown(event: KeyboardEvent): void {
  if (!event.altKey) return
  const key = event.key.toLowerCase()
  if (key === 'l') {
    event.preventDefault()
    setLocale(locale.value === 'en' ? 'ar' : 'en', true)
  }
  if (key === 't') {
    event.preventDefault()
    const next = preferences.cycleTheme()
    toast.info(t('notif.themeSet', { mode: next.toUpperCase() }))
  }
  if (key === 'n') {
    event.preventDefault()
    newInvoice()
  }
  if (key === 's') {
    event.preventDefault()
    invoicesStore.toggleSplitView()
    router.push('/invoices')
  }
  if (key === 'h') {
    event.preventDefault()
    openHeldDialog()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- شريط التنقل والإجراءات السريعة -->
    <nav class="bg-surface-alt border-b border-border px-md py-xs flex flex-wrap justify-between items-center gap-md" aria-label="Utility Navigation">
      <div class="flex items-center gap-xs text-xs font-bold text-bg-f flex-wrap" role="tablist">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          role="tab"
          :aria-selected="isActive(item.to)"
          class="px-md py-xs rounded font-bold text-xs flex items-center gap-sm border transition-all"
          :class="isActive(item.to)
            ? 'bg-primary text-primary-f border-primary shadow-sm'
            : 'bg-surface text-bg-f border-border hover:bg-hover'"
        >
          <component :is="item.icon" class="w-3.5 h-3.5" />
          <span>{{ t(item.labelKey) }}</span>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-sm flex-wrap">
        <!-- إجراءات سريعة -->
        <div class="flex items-center gap-xs text-xs font-bold flex-wrap">
          <Button variant="ghost" size="sm" :title="'Shortcut: Alt+N'" @click="newInvoice">
            <IconFilePlus2 class="w-3.5 h-3.5 text-primary" />
            <span class="hidden lg:inline">{{ t('util.newInvoice') }}</span>
          </Button>
          <Button variant="ghost" size="sm" :title="'Held Invoices (Alt+H)'" aria-haspopup="dialog" @click="openHeldDialog">
            <IconArchive class="w-3.5 h-3.5 text-war" />
            <span class="hidden lg:inline">{{ t('util.heldInvoices') }}</span>
            <Badge variant="war">{{ heldCount }}</Badge>
          </Button>
          <Button variant="ghost" size="sm" :title="'Sync Mock API'" @click="refreshMockData">
            <IconCloudDownload class="w-3.5 h-3.5 text-accent" />
            <span class="hidden lg:inline">{{ t('util.syncApi') }}</span>
          </Button>
          <Button variant="ghost" size="sm" @click="openResetDialog">
            <IconDatabase class="w-3.5 h-3.5 text-ok" />
            <span class="hidden lg:inline">{{ t('util.resetDb') }}</span>
          </Button>
          <Button v-if="isDev" variant="ghost" size="sm" class="text-err" @click="simulateCrash">
            <IconBug class="w-3.5 h-3.5" />
            <span class="hidden lg:inline">{{ t('util.test500') }}</span>
          </Button>
        </div>

        <!-- البحث العام -->
        <div class="flex items-center gap-sm flex-1 min-w-[12rem] max-w-[26rem]">
          <GlobalSearch />
        </div>

        <!-- الفرع الحالي + تاريخ العمليات -->
        <div class="flex items-center gap-xs text-xs font-bold text-bg-f">
          <Select
            :model-value="preferences.currentBranchId"
            :options="branchOptions"
            class="!w-48"
            aria-label="Current branch"
            @update:model-value="preferences.setCurrentBranch($event)"
          />
          <span v-if="operationDate" class="hidden xl:flex items-center gap-xs border border-border rounded px-sm py-1 bg-surface">
            {{ t('nav.opDate') }}
            <strong class="font-mono">{{ operationDate }}</strong>
          </span>
        </div>

        <UserMenu />
      </div>
    </nav>

    <!-- محتوى الصفحة مع غلاف الـ Skeleton أثناء المزامنة -->
    <SyncSkeleton v-if="isSyncing" />
    <main v-else class="erp-section space-y-md">
      <slot />
    </main>

    <!-- شريط الحالة النظامي (PRD) — فوتر مساحة العمل: صحة النظام + الإصدار + البيئة
         + الساعة الحية مع التقويم + الإشعارات + إعدادات النظام -->
    <SystemStatusBar />

    <HeldInvoicesDialog />
    <ResetDbDialog />
  </div>
</template>
