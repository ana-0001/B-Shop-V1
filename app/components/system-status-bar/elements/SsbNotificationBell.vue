<!-- system-status-bar/elements/SsbNotificationBell.vue — جرس الإشعارات مع Popover (PRD: Notification Popover).
     قائمة إشعارات حية مشتقة من حالة التطبيق (معلّق/مخزون/مزامنة) مع عدّاد غير مقروء،
     تعليم الكل كمقروء عند الفتح، وحذف فردي + تفريغ كامل — القائمة بتفتح لفوق (الفوتر). -->
<script setup lang="ts">
import { PopoverPortal, PopoverContent as RekaPopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui'
import {
  Bell as IconBell,
  PauseCircle as IconHeld,
  PackageX as IconStock,
  RefreshCw as IconSync,
  Database as IconDatabase,
  Inbox as IconInbox,
  X as IconX,
  CheckCheck as IconCheckAll,
  Trash2 as IconTrash,
} from 'lucide-vue-next'
import type { SsbNotification } from '@/components/system-status-bar/types'
import { useI18n } from '@/composables/useI18n'
import { useNotificationCenter } from '@/components/system-status-bar/composables/useNotificationCenter'

const { t, locale } = useI18n()
const router = useRouter()
const {
  notifications,
  unreadCount,
  init,
  markAsRead,
  markAllAsRead,
  dismiss,
  clearAll,
} = useNotificationCenter()

const isOpen = ref(false)

/** تهيئة الإشعارات المشتقة عند أول إدخال */
onMounted(() => init())

/** فتح الـ Popover بيعلّم كل الإشعارات كمقروءة (سلوك مركز الإشعارات المعتاد) */
watch(isOpen, (open) => {
  if (open && unreadCount.value > 0) markAllAsRead()
})

/** أيقونة ولون كل نوع إشعار */
const kindMeta = {
  held: { icon: IconHeld },
  stock: { icon: IconStock },
  sync: { icon: IconSync },
  system: { icon: IconDatabase },
} as const

/** عرض زمني نسبي مبسّط ("منذ 3 دقائق") بدون اعتماديات إضافية */
function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return t('ssb.notif.time.now')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t('ssb.notif.time.minutes', { count: minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('ssb.notif.time.hours', { count: hours })
  return t('ssb.notif.time.days', { count: Math.floor(hours / 24) })
}

/** اسم صنف إشعار المخزون حسب لغة الواجهة */
function stockName(notification: SsbNotification): string {
  return locale.value === 'ar'
    ? String(notification.params?.nameAr ?? notification.params?.name ?? '')
    : String(notification.params?.name ?? '')
}

/** سلوك النقر على الإشعار — تنقل للمسار المرتبط إن وجد */
function handleNotificationClick(notification: SsbNotification): void {
  markAsRead(notification.id)
  if (notification.to) {
    isOpen.value = false
    router.push(notification.to)
  }
}
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="ssb-icon-btn"
        :aria-label="`${t('ssb.aria.notifications')} (${unreadCount})`"
        :title="t('ssb.aria.notifications')"
        data-testid="ssb-bell"
      >
        <IconBell aria-hidden="true" />
        <span v-if="unreadCount > 0" class="ssb-count-badge" data-testid="ssb-bell-count">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <RekaPopoverContent class="ssb-pop-content ssb-notif-content" side="top" :side-offset="8" align="end">
        <!-- ترويسة مركز الإشعارات -->
        <div class="ssb-notif-head">
          <span class="ssb-notif-head-title">{{ t('ssb.notif.title') }}</span>
          <div class="ssb-notif-actions">
            <button type="button" class="ssb-notif-action-btn" :title="t('ssb.notif.markAll')" @click="markAllAsRead">
              <IconCheckAll aria-hidden="true" />
            </button>
            <button type="button" class="ssb-notif-action-btn" :title="t('ssb.notif.clearAll')" @click="clearAll">
              <IconTrash aria-hidden="true" />
            </button>
          </div>
        </div>

        <!-- القائمة أو حالة الفراغ -->
        <div v-if="notifications.length" class="ssb-notif-list" role="list">
          <button
            v-for="notification in notifications"
            :key="notification.id"
            type="button"
            role="listitem"
            class="ssb-notif-item"
            :data-read="notification.read"
            @click="handleNotificationClick(notification)"
          >
            <span v-if="!notification.read" class="ssb-notif-unread-dot" aria-hidden="true" />
            <span class="ssb-notif-item-icon" :data-kind="notification.kind" aria-hidden="true">
              <component :is="kindMeta[notification.kind].icon" />
            </span>
            <span class="ssb-notif-item-main">
              <span class="ssb-notif-item-title">{{ t(notification.titleKey) }}</span>
              <span class="ssb-notif-item-body">
                {{ t(notification.bodyKey, notification.kind === 'stock'
                  ? { ...notification.params, name: stockName(notification) }
                  : notification.params) }}
              </span>
              <span class="ssb-notif-item-time">{{ timeAgo(notification.createdAt) }}</span>
            </span>
            <span
              class="ssb-notif-item-dismiss"
              role="button"
              :aria-label="t('common.delete')"
              :title="t('common.delete')"
              @click.stop="dismiss(notification.id)"
            >
              <IconX aria-hidden="true" />
            </span>
          </button>
        </div>

        <div v-else class="ssb-notif-empty">
          <IconInbox aria-hidden="true" />
          <span>{{ t('ssb.notif.empty') }}</span>
        </div>
      </RekaPopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
