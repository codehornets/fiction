import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'numberedList'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'Engaging list of key points with optional media',
  icon: 'i-tabler-list-numbers',
  colorTheme: 'rose',
  title: 'Numbered List',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId, ...args })
  },
})

// Export type for use in other components
export type { UserConfig } from './config'
