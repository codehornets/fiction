import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'cardFooterPersonalV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-layout-bottombar',
  title: 'Personal Footer',
  colorTheme: 'violet',
  subTitle: 'Create a lasting impression with a thoughtfully designed footer',
  description: `Transform your site's footer into a powerful navigation hub and brand anchor.
    This versatile footer adapts to various brand personalities - from corporate polish to creative flair.
    Features animated reveal effects, smart content sections, and seamless dark mode support.
    Perfect for multi-section navigation, contact information, and legal requirements.`,
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
