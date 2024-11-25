import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'textEffects'

export const template = cardTemplate({
  templateId,
  category: ['typography'],
  title: 'Dynamic Text Effects',
  subTitle: 'Enhance your content with eye-catching text animations',
  description: 'Add visual interest to your headlines and text with customizable animations, transforms, and effects. Perfect for creating engaging headlines, CTAs, or emphasizing key messages.',
  icon: 'i-tabler-text-size',
  colorTheme: 'indigo',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId, ...args })
  },

  onSiteLoad: (args) => {
    const { site } = args
    site.shortcodes.addShortcode('text_effect', ({ content, attributes }) => {
      const type = attributes?.type || 'squiggle'
      const theme = attributes?.theme || 'primary'
      return `<span data-text-effect data-effect-type="${type}" data-effect-theme="${theme}">${content}</span>`
    })
  },
})
