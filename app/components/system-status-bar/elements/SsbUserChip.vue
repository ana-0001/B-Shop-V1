<!-- system-status-bar/elements/SsbUserChip.vue — رقاقة المستخدم الحالي.
     محتوى منقول من الفوتر القديم (shared/StatusBar.vue) جوه الشريط الجديد زي ما صاحب المشروع طلب:
     اسم المستخدم المعروض + شارة "منشئ النظام" لو الحساب هو bomba الأصلي.
     رقاقة عرض فقط (span مش زرار) — كل الأبعاد em نسبية لمرساة --ssb-em. -->
<script setup lang="ts">
import { UserRound as IconUser, ShieldCheck as IconShield } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <span
    v-if="auth.user"
    class="ssb-chip ssb-user-chip"
    :aria-label="t('ssb.user.aria')"
    :title="t('ssb.user.aria')"
    data-testid="ssb-user"
  >
    <IconUser aria-hidden="true" />
    <strong class="ssb-chip-value ssb-user-name">{{ auth.user.displayName }}</strong>
    <span v-if="auth.isSuperBombaUser" class="ssb-system-badge">
      <IconShield aria-hidden="true" />
      <span>{{ t('user.systemCreator') }}</span>
    </span>
  </span>
</template>
