<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { DataCompared, DataPointChart } from '@fiction/analytics/types'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import XNumber from '@fiction/ui/common/XNumber.vue'
import { ref } from 'vue'
import SuperChart from './SuperChart.vue'

const { widget } = defineProps<{
  widget: Widget
}>()

// Helper to generate realistic looking time series data
function generateTimeSeriesData(args: {
  days: number
  baseValue: number
  volatility: number
  trend: number
  hasIntraday?: boolean
}) {
  const { days, baseValue, volatility, trend, hasIntraday = false } = args
  const data = []
  let currentValue = baseValue

  for (let i = 0; i < days; i++) {
    // Add daily trend
    currentValue = currentValue * (1 + trend) + (Math.random() - 0.5) * volatility * currentValue

    // Round to whole numbers for counts
    const value = Math.max(0, Math.round(currentValue))

    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    data.push({
      date: date.toISOString().split('T')[0],
      count: value,
      tense: i < days - 3 ? 'past' : i === days - 3 ? 'present' : 'future' as ('past' | 'present' | 'future'),
    })
  }

  return data
}

// Metrics data with their charts
const metrics = ref([
  {
    title: 'Site Traffic',
    value: 14423,
    change: 2000,
    period: '30 day avg',
    icon: 'i-tabler-world',
    chart: {
      main: generateTimeSeriesData({
        days: 30,
        baseValue: 14000,
        volatility: 0.15,
        trend: 0.005,
      }),
      mainTotals: { count: 14423 },
    } satisfies DataCompared<DataPointChart>,
  },
  {
    title: 'Words Published',
    value: 24500,
    change: 2100,
    period: 'This week',
    icon: 'i-tabler-file-text',
    chart: {
      main: generateTimeSeriesData({
        days: 30,
        baseValue: 22000,
        volatility: 0.08,
        trend: 0.003,
      }),
      mainTotals: { count: 24500 },
    } satisfies DataCompared<DataPointChart>,
  },
])

// Main audience chart data
const chartData = ref<DataCompared<DataPointChart>>({
  main: generateTimeSeriesData({
    days: 60,
    baseValue: 2500,
    volatility: 0.05,
    trend: 0.008,
  }),
  mainTotals: { count: 2847 },
})

// Growth platforms data with more realistic numbers
const platforms = ref([
  {
    name: 'X Platform',
    followers: 2837,
    growth: 27.0,
    icon: 'i-tabler-brand-x',
    chart: {
      main: generateTimeSeriesData({
        days: 30,
        baseValue: 2200,
        volatility: 0.12,
        trend: 0.009,
      }),
      mainTotals: { count: 2847 },
    } satisfies DataCompared<DataPointChart>,
  },
  {
    name: 'LinkedIn',
    followers: 1234,
    growth: 12.7,
    icon: 'i-tabler-brand-linkedin',
    chart: {
      main: generateTimeSeriesData({
        days: 30,
        baseValue: 1100,
        volatility: 0.06,
        trend: 0.004,
      }),
      mainTotals: { count: 1234 },
    } satisfies DataCompared<DataPointChart>,
  },
  {
    name: 'Email List',
    followers: '492',
    growth: 31.3,
    icon: 'i-tabler-mail',
    chart: {
      main: generateTimeSeriesData({
        days: 30,
        baseValue: 375,
        volatility: 0.15,
        trend: 0.01,
      }),
      mainTotals: { count: 492 },
    } satisfies DataCompared<DataPointChart>,
  },
])
</script>

<template>
  <WidgetWrap :widget>
    <div class="space-y-4">
      <!-- Main Stats Card -->
      <div class="rounded-2xl">
        <!-- Audience Stats -->
        <div class="flex justify-between items-center">
          <div>
            <div class="flex items-center gap-2 text-theme-500 dark:text-theme-400 mb-2">
              <i class="i-tabler-users text-lg opacity-80" />
              <span>Total Audience</span>
            </div>
            <div class="flex items-baseline gap-2">
              <XNumber
                format="number"
                :animate="true"
                class="text-5xl font-medium tracking-tight x-font-title"
                :model-value="+(chartData.mainTotals?.count || 0)"
              />
              <span class="text-theme-500 dark:text-theme-400">followers</span>
            </div>
          </div>

          <!-- Sparkline Chart -->
          <div class="relative w-[200px] aspect-[4/1]">
            <SuperChart
              v-if="chartData"
              :data="chartData"
              line-color="var(--primary-400)"
              area-color="var(--primary-400)"
              date-format="MMM D"
            />
          </div>
        </div>
      </div>

      <!-- Metrics -->
      <div class="divide-y divide-theme-200/80 dark:divide-theme-700/50">
        <div
          v-for="metric in metrics"
          :key="metric.title"
          class="rounded-xl py-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-lg flex items-center justify-center bg-primary-500/10">
              <i class="text-primary-400 text-lg" :class="[metric.icon]" />
            </div>
            <div>
              <div class="text-sm text-theme-500 dark:text-theme-400">
                {{ metric.title }}
              </div>
              <XNumber
                format="number"
                :animate="true"
                class="text-2xl text-white font-medium x-font-title"
                :data-value="metric.value"
                :model-value="+(metric.value || 0)"
              />
            </div>
          </div>
          <div class="text-right flex justify-end items-center gap-6">
            <!-- Small Sparkline -->
            <div class="aspect-[4/1] h-[20px]">
              <SuperChart
                v-if="metric.chart"
                :data="metric.chart"
                line-color="var(--primary-400)"
                area-color="var(--primary-400)"
                date-format="MMM D"
              />
            </div>
            <div class=" space-y-1">
              <XNumber class="text-green-400 text-lg x-font-title" :model-value="metric.change" :animate="true" prefix="+" />
              <div class="text-sm text-theme-500 dark:text-theme-400">
                {{ metric.period }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Growth Platforms -->
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="platform in platforms"
          :key="platform.name"
          class="p-4 rounded-xl"
        >
          <div class="flex items-center space-x-2 mb-1">
            <i class="text-lg text-primary-400" :class="[platform.icon]" />
            <span class="text-sm text-theme-500">{{ platform.name }}</span>
          </div>
          <XNumber
            class="text-xl font-medium x-font-title"
            :model-value="+(platform.followers || 0)"
            :animate="true"
            format="number"
          />
          <XNumber
            class="text-sm text-green-400 "
            :model-value="+(platform.growth || 0)"
            :animate="true"
            prefix="↑"
            suffix="%"
          />
          <!-- Platform Sparkline -->
          <div class="h-[20px] w-full mt-2">
            <SuperChart
              v-if="platform.chart"
              :data="platform.chart"
              line-color="var(--primary-400)"
              area-color="var(--primary-400)"
              date-format="MMM D"
            />
          </div>
        </div>
      </div>
    </div>
  </WidgetWrap>
</template>
