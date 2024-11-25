<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps<{
  optimizeLineLength?: boolean
  applyProseStyles?: boolean
  maxCharsPerLine?: number
  minCharsPerLine?: number
  baseSize?: number
  minFontSize?: number
  maxFontSize?: number
}>()

const {
  optimizeLineLength = false,
  applyProseStyles = false,
  maxCharsPerLine = 75,
  minCharsPerLine = 45,
  baseSize = 16,
  minFontSize = 14,
  maxFontSize = 80,
} = props

const containerRef = vue.ref<HTMLElement>()
const fontSize = vue.ref<number>(baseSize)

function calculateAverageCharsPerLine(): number {
  if (!containerRef.value)
    return 0

  const textNodes = Array.from(containerRef.value.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
  if (!textNodes.length)
    return 0

  let totalChars = 0
  let totalLines = 0

  textNodes.forEach((node) => {
    const text = node.textContent || ''
    const words = text.split(' ')
    let currentLine = ''

    words.forEach((word) => {
      if ((`${currentLine} ${word}`).length > maxCharsPerLine) {
        totalChars += currentLine.length
        totalLines++
        currentLine = word
      }
      else {
        currentLine += (currentLine ? ' ' : '') + word
      }
    })

    if (currentLine) {
      totalChars += currentLine.length
      totalLines++
    }
  })

  return totalLines ? totalChars / totalLines : 0
}

function adjustFontSize() {
  if (!optimizeLineLength || !containerRef.value)
    return

  const containerWidth = containerRef.value.offsetWidth
  const avgChars = calculateAverageCharsPerLine()

  if (avgChars === 0)
    return

  // Adjust font size based on average characters per line
  if (avgChars > maxCharsPerLine) {
    fontSize.value = Math.max(
      minFontSize,
      fontSize.value * (maxCharsPerLine / avgChars),
    )
  }
  else if (avgChars < minCharsPerLine) {
    fontSize.value = Math.min(
      maxFontSize,
      fontSize.value * (minCharsPerLine / avgChars),
    )
  }
}

// Watch for container size changes
vue.onMounted(() => {
  if (!optimizeLineLength)
    return

  const resizeObserver = new ResizeObserver(() => {
    vue.nextTick(adjustFontSize)
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  vue.onBeforeUnmount(() => {
    resizeObserver.disconnect()
  })

  // Initial adjustment
  vue.nextTick(adjustFontSize)
})
</script>

<template>
  <div
    ref="containerRef"
    class="prose-container"
    :class="[
      applyProseStyles && 'prose-styles',
    ]"
    :style="{
      '--prose-font-size': `${fontSize}px`,
    }"
  >
    <slot />
  </div>
</template>

<style lang="less">
.prose-container {
  font-size: var(--prose-font-size);
  transition: font-size 0.2s ease;
  width: 100%;
}

.prose-styles {
  /* Typography */
  @apply text-gray-700 dark:text-gray-300;

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold leading-tight text-gray-900 dark:text-gray-100;
    margin-top: 2em;
    margin-bottom: 1em;
  }

  h1 { @apply text-4xl; }
  h2 { @apply text-3xl; }
  h3 { @apply text-2xl; }
  h4 { @apply text-xl; }
  h5 { @apply text-lg; }
  h6 { @apply text-base; }

  /* Paragraphs and spacing */
  p {
    @apply leading-relaxed;
    margin-bottom: 1.5em;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Lists */
  ul, ol {
    @apply my-6 ml-6;

    li {
      @apply my-2;
    }
  }

  ul {
    @apply list-disc;
  }

  ol {
    @apply list-decimal;
  }

  /* Links */
  a {
    @apply text-blue-600 dark:text-blue-400 hover:underline;
  }

  /* Blockquotes */
  blockquote {
    @apply pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic my-8;
  }

  /* Code blocks */
  pre {
    @apply bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-6 overflow-x-auto;
  }

  code {
    @apply bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm;
  }

  pre code {
    @apply bg-transparent p-0;
  }

  /* Tables */
  table {
    @apply w-full my-6;

    th {
      @apply bg-gray-100 dark:bg-gray-800 font-bold p-2 text-left;
    }

    td {
      @apply border-t border-gray-200 dark:border-gray-700 p-2;
    }
  }

  /* Images */
  img {
    @apply max-w-full rounded-lg my-6;
  }

  /* Horizontal rule */
  hr {
    @apply my-8 border-gray-200 dark:border-gray-700;
  }
}
</style>
