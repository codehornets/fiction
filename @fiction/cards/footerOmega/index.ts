import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'footerOmega'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-layout-bottombar',
  title: 'Omega Footer',
  colorTheme: 'slate',
  description: 'Modern personal footer with contact information and useful links',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getFooterConfig } = await import('./config')
    return getFooterConfig({ templateId })
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
