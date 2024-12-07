<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import { twMerge } from 'tailwind-merge'
import { Fitty } from './utilFitText.js'

const { wrapClass = '', minSize = 16, maxSize = 350, multiLine = true, lines = 1, observeMutations = true, content = '', tag = 'div' } = defineProps<{
  wrapClass?: string
  minSize?: number
  maxSize?: number
  multiLine?: boolean
  lines?: number
  observeMutations?: boolean | { subtree: boolean, childList: boolean, characterData: boolean }
  content: string
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>()

const fittyRef = vue.ref<HTMLElement | null>(null)
const containerRef = vue.ref<HTMLElement | null>(null)
const fitty = vue.ref<Fitty | null>(null)
const isTextVisible = vue.ref(false)

function getFittyOptions() {
  return { minSize, maxSize, multiLine, lines }
}

function initFitty() {
  if (fittyRef.value) {
    fitty.value = new Fitty({ debug: false })
    fitty.value.fit(fittyRef.value, {
      ...getFittyOptions(),
      observeMutations: observeMutations === true
        ? { subtree: true, childList: true, characterData: true }
        : observeMutations,
    })
  }
}

function refitText() {
  vue.nextTick(async () => {
    await vue.nextTick() // Wait for DOM update
    fitty.value?.fitAll(getFittyOptions())
    isTextVisible.value = true // Show text after fitting
  })
}

let resizeObserver: ResizeObserver | undefined = undefined
vue.onMounted(async () => {
  await waitFor(50)
  initFitty()
  refitText()

  // Use ResizeObserver to detect container size changes
  resizeObserver = new ResizeObserver(() => {
    refitText()
  })
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

vue.onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  if (fitty.value) {
    fitty.value.destroy()
  }
})

vue.watch(
  () => [content, minSize, maxSize, multiLine, lines],
  () => {
    isTextVisible.value = false // Hide text before refitting
    refitText()
  },
  { deep: true, immediate: true },
)

const cls = vue.computed(() => twMerge(wrapClass))

// Expose a method to force recalculation
function forceRecalculate() {
  isTextVisible.value = false // Hide text before refitting
  vue.nextTick(async () => {
    await waitFor(50)
    refitText()
  })
}

defineExpose({ forceRecalculate })

// Compute an initial font size based on container size
const initialFontSize = vue.computed(() => {
  if (!containerRef.value)
    return `${minSize}px`
  const containerWidth = containerRef.value.clientWidth
  const containerHeight = containerRef.value.clientHeight
  const initialSize = Math.min(containerWidth / 10, containerHeight / 2, maxSize)
  return `${Math.max(initialSize, minSize)}px`
})
</script>

<template>
  <component :is="tag" ref="containerRef" :class="cls">
    <div
      ref="fittyRef"
      class="w-full h-full transition-opacity duration-300"
      :class="{ 'opacity-0': !isTextVisible }"
      :style="{
        fontSize: initialFontSize,
        maxWidth: '100%',
        maxHeight: '100%',
      }"
    >
      <slot />
    </div>
  </component>
</template>
