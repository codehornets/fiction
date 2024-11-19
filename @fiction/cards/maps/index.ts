import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'maps'

export const template = cardTemplate({
  templateId,
  category: ['advanced'],
  title: 'Interactive Map',
  description: 'Customizable map display with markers and location information',
  icon: 'i-tabler-map-2',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
})

// Export types
export type { UserConfig } from './config'
