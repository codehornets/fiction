import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'pageNav'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-menu-2',
  title: 'Brand Navigation',
  subTitle: 'Sophisticated navigation for modern websites',
  colorTheme: 'green',
  description: `Create an engaging brand experience with this premium navigation component.
    Features intelligent layouts, mega menus, and contextual user interactions.
    Perfect for modern digital brands that need sophisticated information architecture
    with visual hierarchy and clear user pathways.`,
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Base configuration before user customization
  getBaseConfig: () => ({
    standard: {
      spacing: { verticalSpacing: 'xs' },
    },
  }),

  // Config implementation loaded asynchronously
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})

// Export type for use in other components
export type { UserConfig } from './config'
