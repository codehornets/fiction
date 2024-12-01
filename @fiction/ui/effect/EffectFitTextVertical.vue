<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'

const {
  minSize = 16,
  maxSize = 350,
  scale = 1,
  tag = 'div',
} = defineProps<{
  wrapClass?: string
  minSize?: number
  maxSize?: number
  scale?: number
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>()

const textRef = vue.ref<HTMLElement | null>(null)
const containerRef = vue.ref<HTMLElement | null>(null)
const fontSize = vue.ref(minSize)
const isTextVisible = vue.ref(false)
const calculatedSize = vue.ref(minSize)

function calculateFontSize() {
  if (!containerRef.value || !textRef.value)
    return

  const container = containerRef.value
  const text = textRef.value
  const containerHeight = container.clientHeight
  const containerWidth = container.clientWidth

  // Binary search to find the optimal font size
  let low = minSize
  let high = maxSize
  let bestFit = low

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    text.style.fontSize = `${mid}px`

    // Check if text fits within container height and doesn't overflow width too much
    // Allow width to be flexible but don't let it grow more than 20% beyond container
    if (
      text.scrollHeight <= containerHeight
      && text.scrollWidth <= containerWidth * 1.2
    ) {
      bestFit = mid
      low = mid + 1
    }
    else {
      high = mid - 1
    }
  }

  // Store the raw calculated size before scaling
  calculatedSize.value = bestFit

  // Apply scale factor to the best fit size
  const scaledSize = Math.round(bestFit * scale)

  // Ensure scaled size stays within bounds
  fontSize.value = Math.max(minSize, Math.min(maxSize, scaledSize))
  isTextVisible.value = true
}

function refitText() {
  vue.nextTick(async () => {
    await vue.nextTick()
    calculateFontSize()
  })
}

let resizeObserver: ResizeObserver | undefined

vue.onMounted(async () => {
  await waitFor(50)
  calculateFontSize()

  resizeObserver = new ResizeObserver(() => {
    isTextVisible.value = false
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
})

// Watch for scale changes
vue.watch(() => scale, () => {
  const scaledSize = Math.round(calculatedSize.value * scale)
  fontSize.value = Math.max(minSize, Math.min(maxSize, scaledSize))
}, { immediate: true })

// Watch for slot content changes
const observer = vue.ref<MutationObserver>()
vue.onMounted(() => {
  if (textRef.value) {
    observer.value = new MutationObserver(() => {
      isTextVisible.value = false
      refitText()
    })

    observer.value.observe(textRef.value, {
      characterData: true,
      subtree: true,
      childList: true,
    })
  }
})

vue.onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})

// Force recalculation method
function forceRecalculate() {
  isTextVisible.value = false
  vue.nextTick(async () => {
    await waitFor(50)
    refitText()
  })
}

// Expose current font size and recalculate method
defineExpose({
  forceRecalculate,
  fontSize,
  calculatedSize,
})
</script>

<template>
  <component
    :is="tag"
    ref="containerRef"
    class="relative inline-flex items-center"
    :data-scale="scale"
    :data-min-size="minSize"
    :data-max-size="maxSize"
  >
    <div
      ref="textRef"
      class="w-fit transition-opacity duration-300 leading-none"
      :class="{ 'opacity-0': !isTextVisible, 'opacity-100': isTextVisible }"
      :style="{
        fontSize: `${fontSize}px`,
      }"
    >
      <slot />
    </div>
  </component>
</template>
