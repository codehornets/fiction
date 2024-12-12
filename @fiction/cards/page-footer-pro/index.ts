// index.ts
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'cardFooterProV1'

export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-box-align-bottom',
  title: 'Footer Pro',
  colorTheme: 'blue',
  subTitle: 'Professional footer for modern digital brands',
  description: `Create a premium brand experience with this advanced footer component.
    Features a sophisticated layout with brand messaging, column-based navigation, trust badges,
    and social proof elements. Perfect for SaaS, enterprise, and digital-first brands.
    Includes animated reveals, smart content organization, and comprehensive brand elements.`,
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})

export type { UserConfig } from './config'
