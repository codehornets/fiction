import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'tour'
// Define the tour card template
export const template = cardTemplate({
  templateId: 'tour',
  category: ['marketing', 'content'],
  title: 'Visual Tour',
  subTitle: 'Guide viewers through your story with immersive visual narratives',
  description: `Create immersive visual narratives that guide viewers through your story.
Perfect for product showcases, case studies, or multi-step journeys where each section
builds compelling momentum toward your goals.`,
  icon: 'i-tabler-compass',
  colorTheme: 'cyan',
  isPublic: true,

  // Load component and config asynchronously
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Export types for use in other components
export type { HeroConfig, UserConfig } from './config'
