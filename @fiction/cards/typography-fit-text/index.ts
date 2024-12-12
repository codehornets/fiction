import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'cardResponsiveTextV1'

export const template = cardTemplate({
  templateId,
  category: ['content', 'typography'],
  title: 'Responsive Text',
  description: 'Create attention-grabbing headlines and text displays that automatically fit their container while maintaining perfect proportions. Perfect for hero sections, impact statements, and brand messaging.',
  subTitle: 'Transform your message into a perfectly-sized visual statement that commands attention',
  icon: 'i-tabler-text-size',
  colorTheme: 'indigo',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Export user config type for component usage
export type { UserConfig } from './config'
