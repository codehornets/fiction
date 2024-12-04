import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'pageArea'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['layout', 'basic'], // Added layout category for better organization
  title: 'Content Area',
  description: 'A flexible container that groups and styles content elements. Perfect for creating distinct sections within your page.',
  subTitle: 'Group and style content elements with custom backgrounds, spacing, and layouts',
  icon: 'i-tabler-layout-board',
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
