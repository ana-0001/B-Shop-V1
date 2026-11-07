<!-- shared/AppTitleBar.vue — شريط العنوان العلوي الموحد (العلامة + أفاتار المستخدم بعد الدخول + النافذة).
     زرّا اللغة والثيم اتشالوا بقرار صاحب المشروع — بديلهم أفاتار المستخدم المنسدل،
     وتبديل اللغة والثيم متاح من درج إعدادات شريط الحالة (SsbSettingsTrigger). -->
<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import AppLogo from '@/components/shared/AppLogo.vue'
import UserMenu from '@/components/shared/UserMenu.vue'
import WindowControls from '@/components/shared/WindowControls.vue'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <header class="titlebar bg-bg text-bg-f flex justify-between items-center px-md border-b border-border gap-sm">
    <NuxtLink to="/" class="flex items-center gap-sm font-extrabold text-sm" aria-label="B-Shop Home">
      <AppLogo size="sm" />
      <span class="bg-primary text-primary-f px-sm py-0.5 rounded text-xs tracking-wider">B-SHOP</span>
      <span class="hidden md:inline text-muted-f font-semibold text-xs">{{ t('app.subtitle') }}</span>
    </NuxtLink>

    <div class="titlebar-controls flex items-center gap-xs">
      <!-- أفاتار المستخدم بدل زرّي اللغة والثيم — بيظهر بعد تسجيل الدخول فقط (الشاشات الداخلية) -->
      <UserMenu v-if="auth.user" />
      <WindowControls />
    </div>
  </header>
</template>
