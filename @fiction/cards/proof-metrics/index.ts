import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'proofMetrics'

export const template = cardTemplate({
  templateId,
  category: ['stats', 'marketing'],
  title: 'Impact Metrics',
  description: 'Transform raw numbers into compelling stories that showcase your brand\'s success. Features animated counters, customizable styling, and multiple display formats to help visitors instantly grasp your achievements.',
  subTitle: 'Visualize key performance metrics that build trust and credibility',
  icon: 'i-tabler-chart-dots',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElMetrics.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { MetricItem, UserConfig } from './config'
