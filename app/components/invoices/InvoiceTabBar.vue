<!-- components/invoices/InvoiceTabBar.vue — شريط تبويبات الفواتير (فتح/غلق/تقسيم/تعليق) -->
<script setup lang="ts">
import { X as IconX, FileText as IconFileText, Pause as IconPause, Columns2 as IconColumns2, Plus as IconPlus } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import { useInvoicesStore } from '@/stores/invoices'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n()
const invoicesStore = useInvoicesStore()

const heldDialogOpen = useState('bshop:heldDialogOpen', () => false)
const heldCount = useState('bshop:heldCount', () => 0)
</script>

<template>
  <div class="bg-bg border-b border-border p-xs flex items-center justify-between overflow-x-auto select-none gap-sm">
    <!-- التبويبات المفتوحة -->
    <div class="flex items-center gap-xs overflow-x-auto" role="tablist" aria-label="Open Invoice Tabs">
      <button
        v-for="tab in invoicesStore.tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="tab.id === invoicesStore.activeTab?.id"
        class="flex items-center gap-xs px-md py-xs rounded-t font-bold text-xs border-t-2 transition-all"
        :class="tab.id === invoicesStore.activeTab?.id
          ? 'bg-surface text-primary border-primary shadow-sm'
          : tab.id === invoicesStore.secondaryTabId && invoicesStore.splitView
            ? 'bg-surface-alt text-secondary border-secondary'
            : 'bg-bg text-muted-f border-transparent hover:bg-hover'"
        @click="invoicesStore.selectTab(tab.id)"
      >
        <span class="flex items-center gap-xs">
          <IconFileText class="w-3 h-3" :class="tab.id === invoicesStore.activeTab?.id ? 'text-primary' : 'text-muted-f'" />
          {{ tab.id }}
          <span class="text-muted-f font-normal">({{ t(`enum.type.${tab.type}`) }})</span>
        </span>
        <span
          role="button"
          tabindex="0"
          class="text-muted-f hover:text-err px-xs rounded text-xs"
          :aria-label="`Close ${tab.id}`"
          @click.stop="invoicesStore.closeTab(tab.id)"
          @keydown.enter.stop="invoicesStore.closeTab(tab.id)"
        >
          <IconX class="w-3 h-3" />
        </span>
      </button>
    </div>

    <!-- أدوات مساحة العمل -->
    <div class="flex items-center gap-xs ps-md border-s border-border">
      <Button variant="ghost" size="sm" @click="heldDialogOpen = true">
        <IconPause class="w-3.5 h-3.5 text-war" />
        <span class="hidden md:inline">{{ t('inv.holdBtn') }}</span>
        <Badge variant="war">{{ heldCount }}</Badge>
      </Button>
      <Button variant="ghost" size="sm" @click="invoicesStore.toggleSplitView()">
        <IconColumns2 class="w-3.5 h-3.5 text-accent" />
        <span class="hidden md:inline">{{ t('inv.splitBtn') }}</span>
      </Button>
      <Button variant="primary" size="sm" @click="invoicesStore.createTab()">
        <IconPlus class="w-3.5 h-3.5" />
        <span>{{ t('util.newInvoice') }}</span>
      </Button>
    </div>
  </div>
</template>
