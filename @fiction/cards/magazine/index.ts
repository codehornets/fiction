import type { UserConfig } from './config'
// index.ts
import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'magazine'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  icon: 'i-tabler-notebook',
  title: 'Magazine',
  description: 'Display blog posts in an elegant magazine-style layout',
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

export type { UserConfig }
