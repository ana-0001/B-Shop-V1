<!-- components/dashboard/WeeklyRevenueChart.vue — شارت المبيعات الأسبوعي (Chart.js + vue-chartjs)
     الألوان بتتبع الثيم الحالي (light/dark) من توكنز النظام. -->
<script setup lang="ts">
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend  } from 'chart.js'
import type {ChartOptions} from 'chart.js';
import { Line } from 'vue-chartjs'
import { useI18n } from '@/composables/useI18n'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface WeekPoint {
  label: string
  sales: number
  purchases: number
}

const props = defineProps<{
  series: WeekPoint[]
}>()

const { t } = useI18n()

const resolvedTheme = useState<'light' | 'dark'>('bshop:resolvedTheme', () => 'light')

/** ألوان الشارت من لوحة PRD الموحّدة (ذهبي/أخضر + محايدات كحلية) — محسومة لكل ثيم لتفادي قراءات DOM متكررة */
const chartPalette = computed(() => {
  const dark = resolvedTheme.value === 'dark'
  return {
    primary: dark ? 'hsl(45 85% 62%)' : 'hsl(45 85% 48%)',
    primaryFill: dark ? 'hsla(45 85% 62% / 0.16)' : 'hsla(45 85% 48% / 0.14)',
    ok: dark ? 'hsl(142 71% 46%)' : 'hsl(142 71% 38%)',
    grid: dark ? 'hsla(220 15% 24% / 0.9)' : 'hsla(220 15% 83% / 0.8)',
    tick: dark ? 'hsl(220 10% 62%)' : 'hsl(220 15% 30%)',
  }
})

const chartData = computed(() => ({
  labels: props.series.map(point => point.label),
  datasets: [
    {
      label: t('dash.legendSales'),
      data: props.series.map(point => point.sales),
      borderColor: chartPalette.value.primary,
      backgroundColor: chartPalette.value.primaryFill,
      fill: true,
      tension: 0.35,
      borderWidth: 2.5,
      pointRadius: 3.5,
      pointBackgroundColor: chartPalette.value.primary,
    },
    {
      label: t('dash.legendPurchases'),
      data: props.series.map(point => point.purchases),
      borderColor: chartPalette.value.ok,
      backgroundColor: 'transparent',
      tension: 0.35,
      borderWidth: 2,
      borderDash: [6, 4],
      pointRadius: 2.5,
      pointBackgroundColor: chartPalette.value.ok,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      labels: { color: chartPalette.value.tick, boxWidth: 12, font: { size: 11 } },
    },
    tooltip: { rtl: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: chartPalette.value.tick, font: { size: 10 } } },
    y: {
      beginAtZero: true,
      grid: { color: chartPalette.value.grid },
      ticks: { color: chartPalette.value.tick, font: { size: 10 }, maxTicksLimit: 5 },
    },
  },
}))
</script>

<template>
  <div class="w-full overflow-hidden h-56">
    <Line :data="chartData" :options="chartOptions" role="img" aria-label="Weekly revenue trend chart" />
  </div>
</template>
