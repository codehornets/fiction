import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cardProfileV1'

export const template = cardTemplate({
  templateId,
  category: ['marketing', 'content'],
  title: 'Profile & Bio Card',
  description: 'Create compelling personal profiles with dynamic layouts combining professional photos, bio content, and social connections. Perfect for team pages, speaker bios, or personal websites.',
  subTitle: 'Transform your personal brand into an engaging visual story',
  icon: 'i-tabler-user-circle',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
