import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'numberedList'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  title: 'Numbered List',
  subTitle: 'Engaging list of key points with optional media',
  description: 'Transform complex ideas into clear, sequential steps with rich media support. Perfect for tutorials, processes, or feature highlights. Each point can include images and custom styling to boost engagement.',
  icon: 'i-tabler-list-numbers',
  colorTheme: 'rose',

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
