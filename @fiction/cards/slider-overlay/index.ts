import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'sliderOverlay'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['marketing', 'portfolio'],
  title: 'Overlay Slider',
  subTitle: 'Create an engaging visual journey with this dynamic slider',
  description: 'Create an engaging visual journey with this dynamic slider featuring overlaid text and smooth transitions. Perfect for showcasing team members, services, or key offerings with impact.',
  icon: 'i-tabler-layers-intersect',
  colorTheme: 'teal',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  getBaseConfig: () => ({
    standard: {
      spacing: { verticalSpacing: 'sm' },
    },
  }),
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
