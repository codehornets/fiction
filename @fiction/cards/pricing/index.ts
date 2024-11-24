import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'pricing'

export const template = cardTemplate({
  templateId,
  category: ['marketing', 'conversion'],
  title: 'Pricing Plans',
  description: 'Create compelling pricing tables that convert visitors into customers. Features interactive toggles for monthly/annual pricing, customizable tiers, and visual hierarchy to highlight your best plans.',
  subTitle: 'Design strategic pricing tables that guide customers to the perfect plan',
  icon: 'i-tabler-report-money',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})
