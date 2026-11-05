<!-- shared/EmptyState.vue — حالة فارغة موحدة للجداول والقوائم -->
<script setup lang="ts">
import { Inbox as IconInbox } from 'lucide-vue-next'

defineProps<{
  message: string
}>()
</script>

<template>
  <div class="p-lg text-center text-muted-f text-xs flex flex-col items-center gap-sm" role="status">
    <IconInbox class="w-6 h-6 opacity-60" />
    <span class="font-semibold">{{ message }}</span>
  </div>
</template>
