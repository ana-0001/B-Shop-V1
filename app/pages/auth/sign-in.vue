<!-- pages/auth/sign-in.vue — شاشة تسجيل الدخول بمعرّف موحد -->
<script setup lang="ts">
import { UserRoundCheck as IconUserRoundCheck } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import SignInForm from '@/components/auth/SignInForm.vue'
import AppLogo from '@/components/shared/AppLogo.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()

useHead({ title: 'B-Shop — Sign In' })
</script>

<template>
  <section class="erp-card max-w-[28rem] w-full p-xl space-y-md shadow-xl">
    <header class="text-center space-y-xs">
      <div class="flex justify-center">
        <AppLogo size="lg" />
      </div>
      <h1 class="text-xl font-extrabold text-bg-f flex items-center justify-center gap-xs">
        <IconUserRoundCheck class="w-5 h-5 text-primary" />
        {{ t('signin.title') }}
      </h1>
      <p class="text-xs text-muted-f">{{ t('signin.subtitle') }}</p>
    </header>

    <SignInForm />
  </section>
</template>
