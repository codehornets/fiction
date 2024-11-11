<script lang="ts" setup>
import type { ComparePeriods, DataCompared, DataPointChart, TimeLineInterval } from '@fiction/analytics/types'
import type { NumberFormats } from '@fiction/platform'
import { computed, onMounted, ref } from 'vue'

const {
  data,
  valueKey = 'count',
  valueFormat = 'number',
  interval = 'day',
  comparePeriod = 'period',
  colors = {},
  showDots = true,
} = defineProps<{
  data: DataCompared<DataPointChart>
  valueKey?: string
  valueFormat?: NumberFormats
  interval?: TimeLineInterval
  comparePeriod?: ComparePeriods
  colors?: Partial<{
    line: string
    area: string
    dots: string
  }>
  showDots?: boolean
}>()

const container = ref<HTMLDivElement>()
const chartRef = ref<SVGElement>()
const dimensions = ref({ width: 0, height: 0 })

const defaultColors = {
  line: '#2151F5',
  area: '#2151F5',
  dots: '#1E2025',
}

const chartColors = computed(() => ({
  ...defaultColors,
  ...colors,
}))

const margin = { top: 2, right: 2, bottom: 2, left: 2 }

const points = computed(() => data?.main || [])

// Generate unique IDs for patterns and gradients
const uniqueId = Math.random().toString(36).substr(2, 9)
const patternId = `sparklineDots-${uniqueId}`
const gradientId = `sparklineGradient-${uniqueId}`

const pathData = computed(() => {
  const values = points.value.map(p => Number(p[valueKey] || 0))
  if (!values.length)
    return {}

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  const xScale = (i: number) =>
    margin.left + (i / (points.value.length - 1)) * (dimensions.value.width - margin.left - margin.right)

  const yScale = (v: number) =>
    margin.top + (1 - ((v - min) / (range || 1))) * (dimensions.value.height - margin.top - margin.bottom)

  const path = points.value
    .map((point, i) => {
      const x = xScale(i)
      const y = yScale(Number(point[valueKey] || 0))
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  return {
    line: path,
    area: `${path} L${dimensions.value.width - margin.right},${dimensions.value.height - margin.bottom} L${margin.left},${dimensions.value.height - margin.bottom} Z`,
  }
})

// Resize observer to make the chart responsive
onMounted(() => {
  if (!container.value)
    return

  const resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      dimensions.value = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }
    }
  })

  resizeObserver.observe(container.value)

  // Initial dimensions
  dimensions.value = {
    width: container.value.clientWidth,
    height: container.value.clientHeight,
  }
})

// Expose the SVG element for external manipulation if needed
defineExpose({
  chartElement: chartRef,
})
</script>

<template>
  <div ref="container" class="relative h-full w-full">
    <svg
      ref="chartRef"
      :width="dimensions.width"
      :height="dimensions.height"
      class="absolute inset-0"
      :viewBox="`0 0 ${dimensions.width} ${dimensions.height}`"
      preserveAspectRatio="none"
    >
      <!-- Background pattern -->
      <defs>
        <pattern
          :id="patternId"
          :width="4"
          :height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect :width="4" :height="4" fill="transparent" />
          <circle
            cx="1"
            cy="1"
            r="1"
            :fill="chartColors.dots"
            fill-opacity="0.3"
          />
        </pattern>

        <!-- Area gradient -->
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="chartColors.area" stop-opacity="0.2" />
          <stop offset="100%" :stop-color="chartColors.area" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Background pattern -->
      <rect
        v-if="showDots"
        width="100%"
        height="100%"
        :fill="`url(#${patternId})`"
      />

      <!-- Area fill -->
      <path
        v-if="pathData.area"
        :d="pathData.area"
        :fill="`url(#${gradientId})`"
      />

      <!-- Line -->
      <path
        v-if="pathData.line"
        :d="pathData.line"
        :stroke="chartColors.line"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  </div>
</template>
