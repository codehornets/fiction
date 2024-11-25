import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'statement'

export type { Statement, UserConfig } from './config'

export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  title: 'Dynamic Statements',
  description: 'Transform your key messages into captivating statements that command attention. Perfect for showcasing testimonials, company values, or product benefits in an engaging, interactive format.',
  subTitle: 'Create a sequence of powerful messages that guide your audience and drive action',
  icon: 'i-tabler-message-circle-2',
  colorTheme: 'indigo',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})
