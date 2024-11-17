import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'footerPro'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-box-align-bottom',
  colorTheme: 'green',
  description: 'A professional and customizable footer for your website',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  title: 'Footer Pro',

  // New async getConfig implementation
  async getConfig() {
    // Dynamically import configuration module
    const { getFooterConfig } = await import('./config')
    return getFooterConfig({ templateId })
  },
})
