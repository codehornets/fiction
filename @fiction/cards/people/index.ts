import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'people'

export const template = cardTemplate({
  templateId,
  category: ['content'],
  description: 'Showcase your team members with photos, bios and social links',
  icon: 'i-tabler-users-group',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  isPublic: true,

  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})
