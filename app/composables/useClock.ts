/**
 * app/composables/useClock.ts — ساعة حية لشريط الحالة السفلي.
 * بتحدّث الوقت كل ثانية وتتنظم تلقائيًا مع دورة حياة المكون.
 */
export function useClock() {
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })

  return { now }
}
