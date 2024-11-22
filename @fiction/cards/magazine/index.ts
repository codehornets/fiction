import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'magazine'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  icon: 'i-tabler-notebook',
  title: 'Magazine',
  subTitle: 'Create dynamic blog layouts with featured posts and immersive content',
  description: 'Transform your blog into a visually stunning magazine with customizable layouts, featured posts, and rich media integration. Perfect for showcasing editorial content, news articles, and thought leadership pieces with style.',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElMagazine.vue')),
  isPublic: true,
  getBaseConfig: () => {
    return { standard: { handling: { showOnSingle: true } } }
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { UserConfig } from './config'
