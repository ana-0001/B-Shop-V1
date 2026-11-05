<!-- components/invoices/CustomerCard.vue — بطاقة بيانات العميل (الاسم + الهواتف/العناوين) -->
<script setup lang="ts">
import { UserRound as IconUserRound, Plus as IconPlus, X as IconX } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import type { InvoiceDraft } from '@/stores/invoices'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  draft: InvoiceDraft
}>()

const { t } = useI18n()
const invoicesStore = useInvoicesStore()

const contactValue = ref('')

function updateCustomerName(value: string): void {
  invoicesStore.patchTab(props.draft.id, { customerName: value.trim() || 'Walk-in Customer' })
}

function setContactTab(tab: 'phones' | 'addresses'): void {
  invoicesStore.patchTab(props.draft.id, { customerTab: tab })
}

function addContact(): void {
  invoicesStore.addContact(props.draft.id, contactValue.value)
  contactValue.value = ''
}

const activeContacts = computed(() =>
  props.draft.customerTab === 'addresses' ? props.draft.customerAddresses : props.draft.customerPhones,
)
</script>

<template>
  <div class="bg-surface-alt p-sm rounded border border-border flex flex-col gap-sm">
    <!-- اسم العميل -->
    <div class="flex items-center gap-xs pb-xs border-b border-border">
      <label class="font-bold text-bg-f text-xs whitespace-nowrap flex items-center gap-xs">
        <IconUserRound class="w-3.5 h-3.5 text-primary" />
        {{ t('inv.customerName') }}:
      </label>
      <Input
        type="text"
        :model-value="draft.customerName"
        class="flex-1 font-bold text-primary"
        aria-label="Customer name"
        @update:model-value="updateCustomerName"
      />
    </div>

    <!-- تبويب الهواتف / العناوين -->
    <div class="flex items-center gap-xs border-b border-border bg-surface p-xs rounded text-xs font-bold">
      <button
        type="button"
        class="px-sm py-xs rounded flex-1"
        :class="draft.customerTab !== 'addresses' ? 'bg-surface-alt text-primary shadow-sm' : 'text-muted-f'"
        @click="setContactTab('phones')"
      >
        {{ t('inv.phones') }} ({{ draft.customerPhones.length }})
      </button>
      <button
        type="button"
        class="px-sm py-xs rounded flex-1"
        :class="draft.customerTab === 'addresses' ? 'bg-surface-alt text-primary shadow-sm' : 'text-muted-f'"
        @click="setContactTab('addresses')"
      >
        {{ t('inv.addresses') }} ({{ draft.customerAddresses.length }})
      </button>
    </div>

    <!-- إضافة وعرض جهات الاتصال -->
    <div class="space-y-xs flex-1 flex flex-col justify-between">
      <div class="flex gap-xs">
        <Input v-model="contactValue" type="text" :placeholder="t('inv.contactPlaceholder')" class="flex-1 text-xs" aria-label="Add customer contact" @keydown.enter="addContact" />
        <Button variant="primary" size="sm" aria-label="Save contact" @click="addContact">
          <IconPlus class="w-3.5 h-3.5" />
        </Button>
      </div>

      <div class="max-h-20 overflow-y-auto border border-border rounded bg-surface p-xs text-xs font-mono space-y-xs">
        <div
          v-for="(entry, index) in activeContacts"
          :key="`${entry}-${index}`"
          class="flex justify-between items-center py-xs border-b border-border last:border-b-0"
        >
          <span class="truncate pe-xs">{{ entry }}</span>
          <button type="button" class="text-err px-xs" aria-label="Delete contact" @click="invoicesStore.removeContact(draft.id, index)">
            <IconX class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
