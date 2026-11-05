<!-- shared/WindowControls.vue — أزرار التحكم في النافذة (تظهر فقط داخل Tauri) -->
<script setup lang="ts">
import { Minus as IconMinus, Square as IconSquare, X as IconX } from 'lucide-vue-next'

const isTauri = ref(false)

onMounted(() => {
  isTauri.value = '__TAURI_INTERNALS__' in window
})

async function controlWindow(action: 'minimize' | 'maximize' | 'close'): Promise<void> {
  if (!isTauri.value) return
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window')
    const currentWindow = getCurrentWindow()
    if (action === 'minimize') await currentWindow.minimize()
    if (action === 'maximize') await currentWindow.toggleMaximize()
    if (action === 'close') await currentWindow.close()
  } catch {
    // فشل التحكم في النافذة — بنتجاهله بهدوء في وضع الويب
  }
}
</script>

<template>
  <template v-if="isTauri">
    <button class="titlebar-btn w-7 h-7 flex items-center justify-center rounded hover:bg-hover text-muted-f" aria-label="Minimize" @click="controlWindow('minimize')">
      <IconMinus class="w-3 h-3" />
    </button>
    <button class="titlebar-btn w-7 h-7 flex items-center justify-center rounded hover:bg-hover text-muted-f" aria-label="Maximize" @click="controlWindow('maximize')">
      <IconSquare class="w-3 h-3" />
    </button>
    <button class="titlebar-btn titlebar-close-btn w-7 h-7 flex items-center justify-center rounded text-muted-f transition-colors" aria-label="Close" @click="controlWindow('close')">
      <IconX class="w-3.5 h-3.5" />
    </button>
  </template>
</template>
