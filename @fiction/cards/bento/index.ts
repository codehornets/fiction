import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'bento'

export const template = cardTemplate({
  templateId,
  category: ['layout', 'content'],
  description: 'Create a dynamic bento grid layout',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'violet',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElBento.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})
