import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'contentHero'

export const template = cardTemplate({
  templateId,
  title: 'Hero Section',
  subTitle: 'Create impactful first impressions with a visually striking hero section.',
  category: ['basic', 'marketing'],
  isPublic: true,
  icon: 'i-tabler-presentation',
  colorTheme: 'violet',
  description: 'Create compelling hero sections that combine headlines, imagery, and calls-to-action to engage visitors. Perfect for homepages, product launches, and landing pages. The hero should communicate your core value proposition within seconds, using persuasive headlines (5-7 words), supporting text (10-30 words), and strategic imagery that reinforces your message. Include clear calls-to-action that guide visitors toward your primary conversion goals.',

  // Async load the component for better performance
  el: vue.defineAsyncComponent(async () => import('./ElHero.vue')),

  // Async load configuration
  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Export type for component usage
export type { UserConfig } from './config'
