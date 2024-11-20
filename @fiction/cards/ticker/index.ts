import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'ticker'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['marketing', 'content'],
  icon: 'i-tabler-arrow-autofit-width',
  title: 'Ticker',
  description: 'Animated scrolling text for announcements, news, and promotions.',
  colorTheme: 'blue',
  isPublic: true,

  // Async component loading
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
})

// Export types for use in other components
export type { UserConfig } from './config'
