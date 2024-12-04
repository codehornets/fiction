import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'timeline'

export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  icon: 'i-tabler-timeline',
  title: 'Professional Timeline',
  subTitle: 'Visualize a journey or series of events',
  description: 'Transform your professional journey into an engaging visual story. Perfect for about pages, portfolios, and career highlights.',
  colorTheme: 'blue',
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
})

export type { UserConfig } from './config'
