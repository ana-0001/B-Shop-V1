<!-- pages/dashboard.vue — لوحة التحكم التنفيذية (بطاقات + شارت أسبوعي + توزيع + آخر الفواتير) -->
<script setup lang="ts">
import {
  Banknote as IconBanknote,
  FileText as IconFileText,
  Boxes as IconBoxes,
  Users as IconUsers,
  Pause as IconPause,
  Plus as IconPlus,
} from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAppData } from '@/composables/useAppData'
import { useInvoicesStore } from '@/stores/invoices'
import { dashboardApi } from '@/services/api/endpoints'
import { formatCurrency, formatNumber } from '@/utils/format'
import type { DashboardSummary } from '@/types'
import PageHeader from '@/components/shared/PageHeader.vue'
import SyncSkeleton from '@/components/shared/SyncSkeleton.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import WeeklyRevenueChart from '@/components/dashboard/WeeklyRevenueChart.vue'
import InvoiceTypeDonut from '@/components/dashboard/InvoiceTypeDonut.vue'
import RecentInvoicesTable from '@/components/dashboard/RecentInvoicesTable.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'

const { t, locale } = useI18n()
const { onDataRefresh } = useAppData()
const invoicesStore = useInvoicesStore()
const router = useRouter()

const summary = ref<DashboardSummary | null>(null)
const isLoading = ref(true)

async function fetchSummary(): Promise<void> {
  isLoading.value = true
  try {
    summary.value = await dashboardApi.summary(invoicesStore.tabs, locale.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSummary)
onDataRefresh(fetchSummary)
watch(locale, fetchSummary)

const heldDialogOpen = useState('bshop:heldDialogOpen', () => false)

function createInvoice(): void {
  router.push('/invoices?new=1')
}
</script>

<template>
  <div>
    <SyncSkeleton v-if="isLoading && !summary" />

    <section v-else-if="summary" class="space-y-md" aria-labelledby="dashboardTitle">
      <PageHeader
        :kicker="t('dash.kicker')"
        kicker-class="text-primary"
        :title="t('dash.title')"
        :subtitle="t('dash.subtitle')"
      >
        <template #actions>
          <Button size="md" @click="heldDialogOpen = true">
            <IconPause class="w-3.5 h-3.5 text-war" />
            <span>{{ t('util.heldInvoices') }}</span>
            <Badge variant="war">{{ summary.heldCount }}</Badge>
          </Button>
          <Button variant="primary" size="md" @click="createInvoice">
            <IconPlus class="w-3.5 h-3.5" />
            <span>{{ t('dash.createBtn') }}</span>
          </Button>
        </template>
      </PageHeader>

      <!-- بطاقات الإحصائيات -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-sm">
        <StatCard
          :title="t('dash.card1Title')"
          :value="formatCurrency(summary.totalNet, locale)"
          :sub="t('dash.card1Sub')"
          :icon="IconBanknote"
          icon-class="text-primary"
        />
        <StatCard
          :title="t('dash.card2Title')"
          :value="formatNumber(summary.invoiceCount, locale)"
          :sub="`${formatNumber(summary.openCount, locale)} ${t('enum.status.OPEN')} · ${formatNumber(summary.postedCount, locale)} ${t('enum.status.POSTED')}`"
          :icon="IconFileText"
          icon-class="text-accent"
        />
        <StatCard
          :title="t('dash.card3Title')"
          :value="formatNumber(summary.itemUnits, locale)"
          :sub="t('dash.card3Sub')"
          :icon="IconBoxes"
          icon-class="text-ok"
        />
        <StatCard
          :title="t('dash.card4Title')"
          :value="formatNumber(summary.customerCount, locale)"
          :sub="t('dash.card4Sub')"
          :icon="IconUsers"
          icon-class="text-war"
        />
      </div>

      <!-- الشارت الأسبوعي + دائرة التوزيع -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-sm">
        <Card class="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>{{ t('dash.chartTitle') }}</CardTitle>
              <CardDescription>{{ t('dash.chartSub') }}</CardDescription>
            </div>
            <Badge variant="primary">{{ t('dash.last7Days') }}</Badge>
          </CardHeader>
          <WeeklyRevenueChart :series="summary.weekSeries" />
        </Card>

        <Card>
          <CardTitle>{{ t('dash.donutTitle') }}</CardTitle>
          <CardDescription>{{ t('dash.donutSub') }}</CardDescription>
          <InvoiceTypeDonut :distribution="summary.typeDistribution" :total-count="summary.invoiceCount" />
        </Card>
      </div>

      <!-- آخر الفواتير -->
      <RecentInvoicesTable :invoices="summary.recentInvoices" />
    </section>
  </div>
</template>
