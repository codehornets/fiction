import type { SiteUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'magazine'

const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Posts used in the magazine'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

const options: InputOption[] = [
  new InputOption({ key: 'posts', label: 'Posts', input: 'InputPosts' }),
]

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  description: 'A magazine cards for displaying posts in a grid layout.',
  icon: 'i-tabler-box-padding',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElMagazine.vue')),
  getUserConfig: async (args) => {
    const { getUserConfig } = await import('./config.js')

    return getUserConfig({ ...args, templateId })
  },
  isPublic: true,
  options,
  schema,
  demoPage: async (args) => {
    const { getDemo } = await import('./config.js')
    return await getDemo({ ...args, templateId })
  },
})
