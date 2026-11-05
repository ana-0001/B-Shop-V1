<!-- shared/GlobalSearch.vue — البحث العام (فلاتر الفواتير في لوحة التحكم زي التصميم) -->
<script setup lang="ts">
import { Search as IconSearch } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'
import Input from '@/components/ui/Input.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const query = ref((route.query.q as string) ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

/** بحث حي مع مهلة — بيوصل الفلتر للوحة التحكم عبر query string */
function handleSearch(value: string): void {
  query.value = value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const target = { path: '/dashboard', query: value.trim() ? { q: value.trim() } : {} }
    if (route.path === '/dashboard') {
      router.replace(target)
    } else {
      router.push(target)
    }
  }, 250)
}

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="relative w-full">
    <Input
      type="search"
      :model-value="query"
      :placeholder="t('util.searchPlaceholder')"
      class="pe-8"
      aria-label="Global search"
      @update:model-value="handleSearch"
    />
    <IconSearch class="w-3.5 h-3.5 text-muted-f absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
</template>
