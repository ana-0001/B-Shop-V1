<!-- system-status-bar/elements/SsbLiveClock.vue — الساعة الحية 12 ساعة مع Tooltip احترافي (PRD).
     Tooltip يعرض: 24 ساعة بتوقيت القاهرة + التاريخ الميلادي + الهجري (أم القرى).
     بيفتح عند التحويم أو التركيز بلوحة المفاتيح (Popover من reka-ui) — لفوق لأن الشريط في الفوتر. -->
<script setup lang="ts">
import { PopoverPortal, PopoverContent as RekaPopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { Clock3 as IconClock, MapPin as IconMapPin, CalendarDays as IconCalendar, MoonStar as IconMoonStar } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useLiveClock } from '@/components/system-status-bar/composables/useLiveClock'

const { t } = useI18n()
const { time12, cairo24, gregorian, hijri } = useLiveClock()

/** حالة الفتح اليدوية — للتحويليم (hover) والتركيز معًا */
const isOpen = ref(false)

/** إغلاق مؤجل عند مغادرة المؤشر عشان النقر داخل الـ Popover ما يقفلش فجأة */
let closeTimer: ReturnType<typeof setTimeout> | null = null

function scheduleClose(): void {
  closeTimer = setTimeout(() => {
    isOpen.value = false
  }, 180)
}

function cancelClose(): void {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="ssb-icon-btn ssb-clock"
        :aria-label="t('ssb.aria.clock')"
        :title="t('ssb.aria.clock')"
        data-testid="ssb-clock"
        @mouseenter="isOpen = true"
        @mouseleave="scheduleClose"
        @focus="isOpen = true"
        @blur="scheduleClose"
      >
        <IconClock aria-hidden="true" />
        <span>{{ time12 }}</span>
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <RekaPopoverContent
        class="ssb-pop-content"
        side="top"
        :side-offset="8"
        align="end"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <!-- عنوان البطاقة -->
        <p class="ssb-pop-title">
          <IconCalendar aria-hidden="true" />
          <span>{{ t('ssb.clock.tooltipTitle') }}</span>
        </p>

        <!-- 24 ساعة بتوقيت القاهرة -->
        <div class="ssb-pop-row">
          <span class="ssb-pop-row-label">
            <IconMapPin aria-hidden="true" />
            <span>{{ t('ssb.clock.cairo24') }}</span>
          </span>
          <span class="ssb-pop-row-value" data-testid="ssb-cairo24">{{ cairo24 }}</span>
        </div>

        <!-- التاريخ الميلادي -->
        <div class="ssb-pop-row">
          <span class="ssb-pop-row-label">
            <IconCalendar aria-hidden="true" />
            <span>{{ t('ssb.clock.gregorian') }}</span>
          </span>
          <span class="ssb-pop-row-value">{{ gregorian }}</span>
        </div>

        <!-- التاريخ الهجري (أم القرى) -->
        <div class="ssb-pop-row">
          <span class="ssb-pop-row-label">
            <IconMoonStar aria-hidden="true" />
            <span>{{ t('ssb.clock.hijri') }}</span>
          </span>
          <span class="ssb-pop-row-value" data-testid="ssb-hijri">{{ hijri }}</span>
        </div>
      </RekaPopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
