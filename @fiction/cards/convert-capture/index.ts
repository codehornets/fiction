import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'convertCapture'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  title: 'Conversion Capture',
  category: ['marketing', 'conversion'],
  description: 'Convert visitors into subscribers with a versatile email capture form. Features multiple display modes (inline, scroll trigger, exit intent), customizable messaging, and social proof elements. Perfect for building email lists, delivering lead magnets, or growing newsletter subscriptions. Optimized for high conversion rates with A/B tested layouts.',
  subTitle: 'High-converting email capture form with multiple display modes and customizable messaging.',
  icon: 'i-tabler-mail',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  templates: [
    cardTemplate({ templateId: 'demoProse', el: vue.defineAsyncComponent(async () => import('./DemoProse.vue')) }),
  ],
  isDetached: (args) => {
    const mode = args.card.userConfig.value.presentationMode

    return !!((mode === 'onLoad' || mode === 'onScroll'))
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config.js')
    return getConfig({ ...args, templateId })
  },

  getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'sm' } } }),
})
