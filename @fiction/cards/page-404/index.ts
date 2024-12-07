import { ActionButtonSchema, superTitleSchema, vue } from '@fiction/core/index.js'
import { cardTemplate } from '@fiction/site/index.js'
import { createOption } from '@fiction/ui/index.js'
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
    createOption({ key: 'superTitle', label: 'Super Title', input: 'InputSuperTitle' }),
    createOption({ key: 'title', label: 'Title', input: 'InputTextarea' }),
    createOption({ key: 'subTitle', label: 'Sub Title', input: 'InputTextarea' }),
    createOption({ key: 'actions', label: 'Actions', input: 'InputActions' }),
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
