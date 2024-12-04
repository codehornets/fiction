import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'contentStory'

export const template = cardTemplate({
  templateId,
  category: ['content'],
  title: 'Scrolling Story',
  description: 'Create engaging narratives that unfold as users scroll, combining captivating media with elegantly revealed text. Perfect for case studies, company histories, or feature presentations.',
  subTitle: 'Transform your narrative into an immersive scrolling experience',
  icon: 'i-tabler-book-2',
  colorTheme: 'fuchsia',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { UserConfig } from './config'
