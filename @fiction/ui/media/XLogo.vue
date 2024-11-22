<script lang="ts" setup>
import type { MediaObject } from '@fiction/core'
import { determineMediaFormat, vue } from '@fiction/core'
import { googleFontsUtility } from '@fiction/core/utils/fonts'
import { twMerge } from 'tailwind-merge'
import EffectFitText from '../effect/EffectFitText.vue'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'XLogo' })

const props = defineProps<{
  media: MediaObject
  alt?: string
  wrapClass?: string
  width?: number
  height?: number
}>()

const containerRef = vue.ref<HTMLElement | null>(null)
const imageRef = vue.ref<HTMLImageElement | null>(null)
const svgRef = vue.ref<SVGElement | null>(null)

const mediaFormat = vue.computed(() => determineMediaFormat(props.media))

// Load Google Fonts for typography format
vue.watch(
  () => props.media.typography?.font,
  async (font) => {
    if (font) {
      await googleFontsUtility.loadFont(font)
    }
  },
  { immediate: true },
)

// Handle container classes
const containerClass = vue.computed(() => {
  const classes = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'overflow-hidden',
  ]
  return twMerge(classes.join(' '), props.wrapClass)
})

// Handle content classes for different formats
const contentClass = vue.computed(() => {
  const classes = [
    'max-w-full',
    'max-h-full',
    'object-contain',
    'transition-all',
    'duration-200',
  ]

  // Add format-specific classes
  if (mediaFormat.value === 'image' || mediaFormat.value === 'url') {
    classes.push('w-auto h-auto')
  }

  return classes.join(' ')
})

// Handle SVG specific sizing and scaling
function handleSvgContent() {
  if (mediaFormat.value === 'html' && svgRef.value) {
    const svg = svgRef.value
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    // Remove fixed dimensions if present
    svg.removeAttribute('width')
    svg.removeAttribute('height')
  }
}

// Image load handler to ensure proper sizing
function handleImageLoad() {
  if (imageRef.value && containerRef.value) {
    const img = imageRef.value
    const container = containerRef.value
    const imgRatio = img.naturalWidth / img.naturalHeight
    const containerRatio = container.clientWidth / container.clientHeight

    if (imgRatio > containerRatio) {
      // Image is wider than container
      img.style.width = '100%'
      img.style.height = 'auto'
    }
    else {
      // Image is taller than container
      img.style.width = 'auto'
      img.style.height = '100%'
    }
  }
}

// Typography styles based on media config
const typographyStyle = vue.computed(() => {
  const typography = props.media.typography
  if (!typography)
    return {}

  return {
    fontFamily: typography.font,
    fontWeight: typography.weight,
    lineHeight: typography.lineHeight || '1.2',
    letterSpacing: typography.letterSpacing,
  }
})

// ResizeObserver for container size changes
let resizeObserver: ResizeObserver | undefined
vue.onMounted(() => {
  handleSvgContent()

  resizeObserver = new ResizeObserver(() => {
    if (mediaFormat.value === 'image' || mediaFormat.value === 'url') {
      handleImageLoad()
    }
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

vue.onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    class="xlogo"
    :class="containerClass"
    :style="{
      width: width ? `${width}px` : undefined,
      height: height ? `${height}px` : undefined,
    }"
  >
    <!-- Image/URL Format -->
    <img
      v-if="(mediaFormat === 'image' || mediaFormat === 'url') && media.url"
      ref="imageRef"
      :src="media.url"
      :alt="alt || media.alt || ''"
      :class="contentClass"
      @load="handleImageLoad"
    >

    <!-- HTML/SVG Format -->
    <div
      v-else-if="mediaFormat === 'html'"
      class="w-full h-full flex items-center justify-center"
    >
      <div
        ref="svgRef"
        class="svg-wrapper w-full h-full"
        v-html="media.html"
      />
    </div>

    <!-- Typography Format -->
    <EffectFitText
      v-else-if="mediaFormat === 'typography'"
      :content="media.typography?.text || ''"
      class="w-full h-full"
      :style="typographyStyle"
    >
      {{ media.typography?.text }}
    </EffectFitText>

    <!-- Icon Format -->
    <XIcon
      v-else-if="mediaFormat === 'iconId'"
      :media="media"
      class="w-full h-full"
    />

    <!-- Component Format -->
    <component
      :is="media.el"
      v-else-if="mediaFormat === 'component'"
      v-bind="media"
      :class="contentClass"
    />

    <!-- Fallback -->
    <span
      v-else
      class="text-theme-500 dark:text-theme-400 text-sm"
    >
      Invalid Media Format
    </span>
  </div>
</template>

<style scoped>
.xlogo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.svg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-wrapper :deep(svg) {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
</style>
