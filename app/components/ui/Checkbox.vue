<!-- ui/Checkbox.vue — مربع اختيار موحد فوق reka-ui (وصولية كاملة) -->
<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { cn } from '@/utils/cn'

const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
  id?: string
  class?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <CheckboxRoot
    :id="props.id"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :class="cn('erp-checkbox', props.class)"
    :aria-checked="props.modelValue"
    @update:model-value="emit('update:modelValue', Boolean($event))"
  >
    <CheckboxIndicator>
      <slot />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
