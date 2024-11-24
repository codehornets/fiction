import type { ConfigResponse } from '@fiction/site/card.js'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'quotes'

// Move the template definition to be more concise
export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  title: 'Elegant Quotes',
  description: 'Transform customer testimonials into compelling social proof that builds trust and drives conversions. Perfect for showcasing client success stories, expert endorsements, and team perspectives.',
  subTitle: 'Watch your results soar with beautifully designed quotes that capture attention and inspire action',
  icon: 'i-tabler-quote',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),

  async getConfig(args): Promise<ConfigResponse> {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { UserConfig } from './config'
