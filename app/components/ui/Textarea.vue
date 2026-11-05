<!-- ui/Textarea.vue — منطقة نص موحدة (ملاحظات الفواتير) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  modelValue?: string
  class?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <textarea
    v-bind="$attrs"
    :value="modelValue"
    :class="cn('erp-input min-h-[4.5em]', props.class)"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
