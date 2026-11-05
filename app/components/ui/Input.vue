<!-- ui/Input.vue — حقل إدخال موحد (بنفس هوية erp-input في التصميم) -->
<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    class?: string
  }>(),
  { type: 'text', modelValue: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    v-bind="$attrs"
    :type="type"
    :value="modelValue"
    :class="cn('erp-input', props.class)"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
