<!-- layouts/auth.vue — شل صفحات ما قبل الدخول (Splash / تسجيل الدخول / الشروط / الإعداد).
     شريط الحالة النظامي (SystemStatusBar) في الفوتر — ظاهر في كل الشاشات
     بقرار صاحب المشروع (استبدل تذييل حالة الزائر القديم). -->
<script setup lang="ts">
import SystemStatusBar from '@/components/system-status-bar/SystemStatusBar.vue'
</script>

<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <main class="flex-1 flex flex-col items-center justify-center p-md bg-surface-alt overflow-y-auto">
      <slot />
    </main>

    <!-- شريط الحالة النظامي (PRD): صحة النظام + الإصدار + البيئة + الساعة الحية
         + الإشعارات + الإعدادات — بدون تكرار للهيدر -->
    <SystemStatusBar />
  </div>
</template>
