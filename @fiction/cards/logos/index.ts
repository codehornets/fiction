import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'logos'

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  title: 'Logo Showcase',
  description: 'Build trust and credibility by showcasing brands that use or endorse your product. Features multiple layout options with hover animations and customizable styling.',
  subTitle: 'Display partner logos, client brands, or featured press mentions',
  icon: 'i-tabler-building-store',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElLogos.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { UserConfig } from './config'
