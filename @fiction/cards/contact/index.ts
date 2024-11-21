import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'contact'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['form', 'marketing'],
  icon: 'i-tabler-mail-fast',
  title: 'Contact & Support',
  colorTheme: 'blue',
  description: `Create professional contact pages with integrated forms and multiple contact methods.
Features customizable layouts, notification settings, and social media integration. Perfect for
customer support, sales inquiries, or general contact information.`,
  subTitle: 'Connect with visitors through customizable contact forms and support channels',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
