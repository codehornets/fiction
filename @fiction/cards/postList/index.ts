import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'postList'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  description: 'A versatile posts display card with grid and scroll layouts',
  icon: 'i-tabler-article',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  isPublic: true,
  getBaseConfig: ({ userConfig }) => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId, ...args })
  },
})
