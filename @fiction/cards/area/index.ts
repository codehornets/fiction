import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'area'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['basic'],
  description: 'Container for other elements',
  icon: 'i-tabler-box-padding',
  colorTheme: 'blue',
  isContainer: true, // ui drawer
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElArea.vue')),

  // Base configuration
  getBaseConfig: () => ({
    standard: { spacing: { verticalSpacing: 'none' } },
  }),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Export type for use in other components
export type { UserConfig } from './config'
