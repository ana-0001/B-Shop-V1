<!-- ui/dialog/DialogContent.vue — جسم نافذة المودال (بنفس هوية erp-modal في التصميم) -->
<script setup lang="ts">
import { DialogPortal, DialogOverlay, DialogContent as RekaDialogContent } from 'reka-ui'
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string }>()
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="erp-modal-overlay" />
    <RekaDialogContent
      :class="cn('erp-modal-dialog fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-modal space-y-md', props.class)"
    >
      <slot />
    </RekaDialogContent>
  </DialogPortal>
</template>
