<!-- ui/Button.vue — زر النظام الموحد بكل المتغيرات (بنفس هوية erp-btn في التصميم) -->
<script setup lang="ts">
import { cva  } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';
import { cn } from '@/utils/cn'

/**
 * المتغيرات:
 * primary = أزرار التأكيد | success = حفظ/ترحيل | warning = تعليق
 * danger = حذف/رفض | ghost = أزرار شريط الأدوات | outline = افتراضي
 */
const buttonVariants = cva('erp-btn', {
  variants: {
    variant: {
      default: '',
      primary: 'erp-btn-primary',
      success: 'erp-btn-success',
      warning: 'erp-btn-warning',
      danger: 'erp-btn-danger',
      ghost: 'border-transparent bg-transparent shadow-none hover:bg-hover',
    },
    size: {
      xs: 'py-1 px-2 text-xs',
      sm: 'py-0.5 px-2 text-xs',
      md: '',
      lg: 'py-sm px-lg text-sm',
      icon: 'w-7 h-7 p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    class?: string
  }>(),
  { type: 'button' },
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>
