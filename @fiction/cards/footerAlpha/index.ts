import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'footerAlpha'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-box-align-bottom',
  colorTheme: 'orange',
  description: 'A simple footer with a few links and a logo',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // New async getConfig implementation
  async getConfig() {
    // Dynamically import configuration module
    const { getFooterConfig } = await import('./config')
    return getFooterConfig({ templateId })
  },
})
