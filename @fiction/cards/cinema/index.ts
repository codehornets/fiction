import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cinema'

export function getBaseConfig(): UserConfig {
  return {
    standard: {
      spacing: {
        contentWidth: 'none',
        verticalSpacing: 'none',
      },
    },
  }
}

export const template = cardTemplate({
  templateId,
  title: 'Cinema Showcase',
  subTitle: 'Create immersive full-screen presentations with background videos and images',
  description: 'Perfect for photography portfolios, event promotion, product launches, or any content that benefits from dramatic full-screen visuals with overlaid text and calls-to-action.',
  category: ['marketing', 'portfolio', 'media'],
  icon: 'i-tabler-movie',
  colorTheme: 'rose',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  getBaseConfig,
})

export type { CinemaItem, UserConfig } from './config'
