// index.ts
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'features'

export const template = cardTemplate({
  templateId,
  category: ['marketing', 'content'],
  title: 'Feature Showcase',
  description: 'Present your product or service features in an engaging, visually appealing layout that highlights benefits and drives conversion.',
  subTitle: 'Transform feature lists into compelling visual stories that connect with your audience',
  icon: 'i-tabler-layout-list',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
})
