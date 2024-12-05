import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'contentTimeline'

export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  icon: 'i-tabler-timeline',
  title: 'Milestone Timeline',
  subTitle: 'Visualize a journey or series of events',
  description: 'Transform your professional journey into an engaging visual story. Perfect for about pages, portfolios, and career highlights.',
  colorTheme: 'green',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})

export type { UserConfig } from './config'
