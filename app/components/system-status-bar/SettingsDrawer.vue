<!-- system-status-bar/SettingsDrawer.vue — درج الإعدادات الجانبي (PRD: Settings Drawer).
     بيفتح من زر الترس في منطقة النهاية، وبيحتوي:
     المظهر (ثيم) + اللغة + الفرع الحالي + المنطقة والتوقيت (القاهرة — جاهز للربط بـ RegionSettings)
     + بطاقة "عن النسخة". الاتجاه بيتقلب حسب RTL تلقائيًا (inset-inline-end). -->
<script setup lang="ts">
import {
  DrawerRoot,
  DrawerPortal,
  DrawerOverlay as RekaDrawerOverlay,
  DrawerContent as RekaDrawerContent,
  DrawerTitle,
  DrawerDescription,
} from 'reka-ui'
import {
  Settings2 as IconSettings,
  Sun as IconSun,
  Moon as IconMoon,
  Monitor as IconMonitor,
  Languages as IconLanguages,
  MapPin as IconMapPin,
  Building2 as IconBuilding,
  Info as IconInfo,
  Hash as IconHash,
  BadgeCheck as IconBadgeCheck,
  Coins as IconCoins,
  X as IconX,
} from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import type { LocaleCode, ThemeMode } from '@/types'
import { localizedEntityName } from '@/types'
import { useSystemMeta } from '@/composables/useSystemMeta'
import Select from '@/components/ui/Select.vue'

const { t, locale, setLocale } = useI18n()
const preferences = usePreferencesStore()
const { meta } = useSystemMeta()
const config = useRuntimeConfig()

/** حالة الفتح المشتركة مع زر الترس */
const settingsOpen = useState('bshop:ssbSettingsOpen', () => false)

/** اتجاه سحب الإغلاق حسب اتجاه الواجهة */
const swipeDirection = computed(() => (locale.value === 'ar' ? 'left' : 'right') as 'left' | 'right')

/** أوضاع الثيم الثلاثة */
const themeOptions: Array<{ value: ThemeMode; labelKey: string; icon: typeof IconSun }> = [
  { value: 'light', labelKey: 'theme.light', icon: IconSun },
  { value: 'dark', labelKey: 'theme.dark', icon: IconMoon },
  { value: 'system', labelKey: 'theme.system', icon: IconMonitor },
]

/** خيارات اللغة */
const languageOptions: Array<{ value: LocaleCode; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
]

/** خيارات الفرع — نفس مصدر شريط الأدوات */
const branchOptions = computed(() => [
  { value: 'ALL', label: t('wh.allBranches') },
  ...(meta.value?.branches ?? []).map(branch => ({
    value: branch.id,
    label: localizedEntityName(branch, locale.value),
  })),
])

/** بيئة التشغيل للعرض */
const envLabel = computed(() => (import.meta.dev ? t('ssb.env.dev') : t('ssb.env.prod')))
</script>

<template>
  <DrawerRoot v-model:open="settingsOpen" :swipe-direction="swipeDirection" :modal="true">
    <DrawerPortal>
      <RekaDrawerOverlay class="erp-modal-overlay" />
      <RekaDrawerContent class="ssb-drawer-content" data-testid="ssb-drawer">
        <!-- ترويسة الدرج -->
        <div class="ssb-drawer-header">
          <DrawerTitle class="ssb-drawer-title">
            <IconSettings aria-hidden="true" />
            <span>{{ t('ssb.settings.title') }}</span>
          </DrawerTitle>
          <button
            type="button"
            class="ssb-icon-btn"
            :aria-label="t('common.close')"
            @click="settingsOpen = false"
          >
            <IconX aria-hidden="true" />
          </button>
        </div>
        <DrawerDescription class="sr-only">{{ t('ssb.settings.title') }}</DrawerDescription>

        <!-- جسم الدرج -->
        <div class="ssb-drawer-body">
          <!-- المظهر -->
          <section>
            <h3 class="ssb-drawer-section-title">{{ t('ssb.settings.appearance') }}</h3>
            <div class="ssb-option-row" role="radiogroup" :aria-label="t('ssb.settings.appearance')">
              <button
                v-for="option in themeOptions"
                :key="option.value"
                type="button"
                role="radio"
                class="ssb-option-chip"
                :data-active="preferences.theme === option.value"
                :aria-checked="preferences.theme === option.value"
                @click="preferences.setTheme(option.value)"
              >
                <component :is="option.icon" aria-hidden="true" />
                <span>{{ t(option.labelKey) }}</span>
              </button>
            </div>
          </section>

          <!-- اللغة -->
          <section>
            <h3 class="ssb-drawer-section-title">{{ t('ssb.settings.language') }}</h3>
            <div class="ssb-option-row" role="radiogroup" :aria-label="t('ssb.settings.language')">
              <button
                v-for="option in languageOptions"
                :key="option.value"
                type="button"
                role="radio"
                class="ssb-option-chip"
                :data-active="locale === option.value"
                :aria-checked="locale === option.value"
                @click="setLocale(option.value)"
              >
                <IconLanguages aria-hidden="true" />
                <span>{{ option.label }}</span>
              </button>
            </div>
          </section>

          <!-- الفرع الحالي -->
          <section>
            <h3 class="ssb-drawer-section-title">{{ t('ssb.settings.branch') }}</h3>
            <div class="flex items-center gap-2">
              <IconBuilding class="w-3.5 h-3.5 text-muted-f" aria-hidden="true" />
              <Select
                :model-value="preferences.currentBranchId"
                :options="branchOptions"
                class="flex-1"
                :aria-label="t('ssb.settings.branch')"
                @update:model-value="preferences.setCurrentBranch($event)"
              />
            </div>
          </section>

          <!-- المنطقة والتوقيت -->
          <section>
            <h3 class="ssb-drawer-section-title">{{ t('ssb.settings.region') }}</h3>
            <div class="ssb-drawer-info-grid">
              <div class="ssb-drawer-info-row">
                <span class="ssb-drawer-info-label">
                  <IconMapPin aria-hidden="true" />
                  <span>{{ t('ssb.settings.timezone') }}</span>
                </span>
                <span class="ssb-drawer-info-value">Africa/Cairo</span>
              </div>
            </div>
            <p class="ssb-drawer-note mt-2">{{ t('ssb.settings.timezoneNote') }}</p>
          </section>

          <!-- عن النسخة -->
          <section>
            <h3 class="ssb-drawer-section-title">{{ t('ssb.settings.about') }}</h3>
            <div class="ssb-drawer-info-grid">
              <div class="ssb-drawer-info-row">
                <span class="ssb-drawer-info-label">
                  <IconHash aria-hidden="true" />
                  <span>{{ t('ssb.settings.version') }}</span>
                </span>
                <span class="ssb-drawer-info-value">v{{ config.public.appVersion }}</span>
              </div>
              <div class="ssb-drawer-info-row">
                <span class="ssb-drawer-info-label">
                  <IconBadgeCheck aria-hidden="true" />
                  <span>{{ t('ssb.settings.environment') }}</span>
                </span>
                <span class="ssb-drawer-info-value">{{ envLabel }}</span>
              </div>
              <div class="ssb-drawer-info-row">
                <span class="ssb-drawer-info-label">
                  <IconCoins aria-hidden="true" />
                  <span>{{ t('ssb.settings.fiscal') }}</span>
                </span>
                <span class="ssb-drawer-info-value">{{ t('splash.fiscalBuild') }}</span>
              </div>
              <div class="ssb-drawer-info-row">
                <span class="ssb-drawer-info-label">
                  <IconInfo aria-hidden="true" />
                  <span>{{ t('app.subtitle') }}</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        <!-- تذييل الدرج -->
        <footer class="ssb-drawer-footer">
          B-Shop ERP — v{{ config.public.appVersion }} · {{ envLabel }}
        </footer>
      </RekaDrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
