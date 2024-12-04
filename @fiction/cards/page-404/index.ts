import { ActionButtonSchema, superTitleSchema, vue } from '@fiction/core/index.js'
import { cardTemplate, type ConfigResponse } from '@fiction/site/index.js'
import { InputOption } from '@fiction/ui/index.js'
import { z } from 'zod'

export const schema = z.object({
  superTitle: superTitleSchema.optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  actions: z.array(ActionButtonSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

async function getConfig() {
  const options = [
    new InputOption({ key: 'superTitle.text', label: 'Super Title', input: 'InputTextarea' }),
    new InputOption({ key: 'title', label: 'Title', input: 'InputTextarea' }),
    new InputOption({ key: 'subTitle', label: 'Sub Title', input: 'InputTextarea' }),
    new InputOption({ key: 'actions', label: 'Actions', input: 'InputActions' }),
  ]

  return {
    schema,
    options,
    userConfig: {},
  }
}

export const template = cardTemplate({
  templateId: 'page404',
  subTitle: 'A simple yet effective not-found page.',
  category: ['special'],
  icon: 'i-tabler-error-404',
  colorTheme: 'red',
  el: vue.defineAsyncComponent(async () => import('./El404.vue')),
  isPublic: false,
  getConfig,
})
