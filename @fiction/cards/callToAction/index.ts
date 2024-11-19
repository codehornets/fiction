import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'callToAction'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-layout-bottombar',
  title: 'Call To Action',
  colorTheme: 'red',
  description: 'A call-to-action card bullets and persuasion techniques to drive user action.',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
