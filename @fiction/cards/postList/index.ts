import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'postList'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  subTitle: 'A versatile posts display card with grid and scroll layouts',
  description: 'Display your blog posts and articles in a clean, organized list format. Choose from grid or scroll layouts to showcase your content effectively, with customizable display options for titles, excerpts, dates, and featured images.',
  icon: 'i-tabler-article',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  isPublic: true,
  getBaseConfig: () => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId, ...args })
  },
})
