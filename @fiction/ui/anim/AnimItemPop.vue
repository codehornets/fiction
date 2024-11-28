<script lang="ts" setup>
import { shortId, vue } from '@fiction/core'
import { useElementVisible } from '.'

defineOptions({ name: 'AnimItemPop' })

const props = defineProps<{
  // Type of pop animation to apply
  effect?: 'scale' | 'bounce' | 'fade' | 'slide' | 'none'
  // Direction for slide effect
  direction?: 'up' | 'down' | 'left' | 'right'
  // Delay in ms before animation starts after entering viewport
  delay?: number
  // Duration of the animation in ms
  duration?: number
  // Whether to use a stagger effect for child items with .pop-item class
  stagger?: boolean
  // Delay between each staggered item
  staggerDelay?: number
  // Enable custom easing
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'bounce'
  // Unique identifier for tracking
  caller: string
}>()

const {
  effect = 'scale',
  direction = 'up',
  delay = 0,
  duration = 600,
  stagger = false,
  staggerDelay = 100,
  easing = 'ease-out',
  caller,
} = props

const randomId = shortId()
const isVisible = vue.ref(false)
const elementRef = vue.ref<HTMLElement>()

// Map of animation effects with their starting and ending states
const effectMap = {
  scale: {
    start: 'opacity-0 scale-75',
    end: 'opacity-100 scale-100',
  },
  bounce: {
    start: 'opacity-0 scale-95 translate-y-4',
    end: 'opacity-100 scale-100 translate-y-0',
  },
  fade: {
    start: 'opacity-0',
    end: 'opacity-100',
  },
  slide: {
    start: () => {
      const translations = {
        up: 'translate-y-8',
        down: '-translate-y-8',
        left: 'translate-x-8',
        right: '-translate-x-8',
      }
      return `opacity-0 ${translations[direction]}`
    },
    end: 'opacity-100 translate-y-0 translate-x-0',
  },
  none: {
    start: '',
    end: '',
  },
}

function getEasingClass(easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'bounce'): string {
  const easingMap = {
    'linear': 'ease-linear',
    'ease': 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'bounce': 'ease-[cubic-bezier(.17,.67,.83,.67)]',
  }
  return easingMap[easing] || 'ease-out'
}

// Compute animation classes
const animationClass = vue.computed(() => {
  if (!effect || effect === 'none')
    return ''

  const effectStyle = effectMap[effect]
  const startClass = typeof effectStyle.start === 'function' ? effectStyle.start() : effectStyle.start

  return [
    'transform-gpu',
    'transition-all',
    getEasingClass(easing),
    isVisible.value ? effectStyle.end : startClass,
  ].join(' ')
})

// Handle staggered children
async function handleStaggeredChildren() {
  if (!elementRef.value || !stagger)
    return

  const items = elementRef.value.querySelectorAll('.pop-item')
  items.forEach((item, index) => {
    const itemDelay = delay + (index * staggerDelay)
    const el = item as HTMLElement
    el.style.transitionDelay = `${itemDelay}ms`
    el.style.transitionDuration = `${duration}ms`

    vue.nextTick(() => {
      el.classList.remove('opacity-0', 'translate-y-4', 'scale-95')
      el.classList.add('opacity-100', 'translate-y-0', 'scale-100')
    })
  })
}

// Initialize visibility tracking
vue.onMounted(async () => {
  await useElementVisible({
    caller: `animPop-${caller}`,
    selector: `#${randomId}`,
    onVisible: () => {
      isVisible.value = true
      if (stagger) {
        handleStaggeredChildren()
      }
    },
  })
})

// Apply transition styles
const transitionStyle = vue.computed(() => ({
  transitionDuration: `${duration}ms`,
  transitionDelay: stagger ? '0ms' : `${delay}ms`,
}))
</script>

<template>
  <div
    :id="randomId"
    ref="elementRef"
    :class="animationClass"
    :style="transitionStyle"
  >
    <slot />
  </div>
</template>

<style lang="less">
.pop-item {
  @apply opacity-0 translate-y-4 scale-95;
  transition-property: all;
  transform-origin: center;
}
</style>
