<!-- ui/Select.vue — قائمة اختيار موحدة (select أصلي بستايل erp-input مع سهم اتجاهي) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
}

const props = defineProps<{
  modelValue?: string
  options: SelectOption[]
  class?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <select
    v-bind="$attrs"
    :value="modelValue"
    :class="cn('erp-input', props.class)"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
