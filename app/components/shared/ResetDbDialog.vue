<!-- shared/ResetDbDialog.vue — نافذة تأكيد تصفير قاعدة البيانات الافتراضية -->
<script setup lang="ts">
import { DialogRoot, DialogClose } from 'reka-ui'
import { TriangleAlert as IconTriangleAlert, X as IconX } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useAppData } from '@/composables/useAppData'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const { resetMockDb } = useAppData()

const open = useState('bshop:resetDialogOpen', () => false)

async function confirmReset(): Promise<void> {
  open.value = false
  await resetMockDb()
}
</script>

<template>
  <DialogRoot :open="open" @update:open="open = $event">
    <DialogContent class="max-w-[26rem]">
      <DialogHeader>
        <div class="flex items-center gap-xs">
          <IconTriangleAlert class="w-5 h-5 text-war" />
          <DialogTitle class="text-base">{{ t('common.confirmResetTitle') }}</DialogTitle>
        </div>
        <DialogClose class="erp-btn text-xs py-xs px-sm" aria-label="Close dialog">
          <IconX class="w-3.5 h-3.5" />
        </DialogClose>
      </DialogHeader>

      <DialogDescription class="text-xs leading-relaxed">
        {{ t('common.confirmResetDesc') }}
      </DialogDescription>

      <DialogFooter>
        <DialogClose as-child>
          <Button size="sm">{{ t('common.cancel') }}</Button>
        </DialogClose>
        <Button variant="danger" size="sm" @click="confirmReset">
          {{ t('common.confirm') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
</template>
