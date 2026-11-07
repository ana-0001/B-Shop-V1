<!-- shared/UserMenu.vue — قائمة المستخدم المنسدلة (المستوى، الصانع، تسجيل الخروج) -->
<script setup lang="ts">
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'reka-ui'
import { LogOut as IconLogOut, ShieldCheck as IconShieldCheck, UserRound as IconUserRound } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { useSonner } from '@/composables/useSonner'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/utils/constants'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const { toast } = useSonner()
const router = useRouter()
const auth = useAuthStore()

/** تسجيل الخروج مع إشعار والرجوع لشاشة الدخول */
async function handleSignOut(): Promise<void> {
  await auth.signOut()
  toast.info(t('notif.termsDeclined'))
  router.push(ROUTE_NAMES.signIn)
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="h-7 px-sm flex items-center gap-xs rounded border border-border bg-surface hover:bg-hover text-xs font-bold text-bg-f transition-colors"
      :aria-label="t('user.menuAria')"
    >
      <span class="w-5 h-5 rounded-full bg-primary text-primary-f grid place-items-center text-xs font-extrabold">
        {{ auth.user?.avatarLetter ?? 'B' }}
      </span>
      <span class="hidden sm:inline">{{ auth.user?.displayName }}</span>
      <Badge v-if="auth.isSuperBombaUser" variant="war" class="hidden md:inline-flex">
        <IconShieldCheck class="w-3 h-3" />
        {{ t('user.systemCreator') }}
      </Badge>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="8"
        class="z-modal min-w-[16rem] bg-surface border border-border rounded-lg shadow-lg p-sm space-y-xs"
      >
        <div class="px-xs py-1 space-y-0.5">
          <p class="text-xs font-extrabold text-bg-f flex items-center gap-xs">
            <IconUserRound class="w-3.5 h-3.5 text-primary" />
            {{ auth.user?.displayName }}
          </p>
          <p class="text-xs text-muted-f">{{ t('user.levelBadge', { level: auth.user?.level ?? 0 }) }}</p>
        </div>

        <DropdownMenuSeparator class="h-px bg-border" />

        <DropdownMenuItem
          as-child
          class="outline-none"
        >
          <Button variant="danger" size="sm" class="w-full" @click="handleSignOut">
            <IconLogOut class="w-3.5 h-3.5 icon-directional" />
            <span>{{ t('util.signOut') }}</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
