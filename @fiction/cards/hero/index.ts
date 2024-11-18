import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'hero'

export const template = cardTemplate({
  templateId,
  category: ['basic'],
  isPublic: true,
  description: 'standard hero section',
  icon: 'i-tabler-layout-bottombar-collapse-filled',
  colorTheme: 'orange',
  el: vue.defineAsyncComponent(async () => import('./ElHero.vue')),

  // New async getConfig implementation
  async getConfig(args) {
    const { getHeroConfig } = await import('./config')
    return getHeroConfig({ templateId, ...args })
  },
})
