<!-- ui/Badge.vue — شارة موحدة (حالة الفاتورة، نوع المعرّف، المستوى...) -->
<script setup lang="ts">
import { cva  } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';
import { cn } from '@/utils/cn'

const badgeVariants = cva('erp-badge', {
  variants: {
    variant: {
      default: 'bg-surface-alt text-muted-f',
      primary: 'bg-primary text-primary-f',
      secondary: 'bg-secondary text-secondary-f',
      accent: 'bg-accent text-accent-f',
      ok: 'bg-ok text-ok-f',
      err: 'bg-err text-err-f',
      war: 'bg-war text-war-f',
      inf: 'bg-inf text-inf-f',
      outline: 'border border-border text-bg-f',
    },
  },
  defaultVariants: { variant: 'default' },
})

type BadgeVariants = VariantProps<typeof badgeVariants>

const props = defineProps<{
  variant?: BadgeVariants['variant']
  class?: string
}>()
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>
