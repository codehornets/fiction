import { ActionButtonSchema, vue } from '@fiction/core/index.js'
import { cardTemplate, type ConfigResponse } from '@fiction/site/index.js'
import { InputOption } from '@fiction/ui/index.js'
import { z } from 'zod'

export const schema = z.object({
  superHeading: z.string().optional(),
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  actions: z.array(ActionButtonSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

async function getConfig(): Promise<ConfigResponse> {
  const options = [
    new InputOption({ key: 'superHeading', label: 'Super Heading', input: 'InputTextarea' }),
    new InputOption({ key: 'heading', label: 'Heading', input: 'InputTextarea' }),
    new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputTextarea' }),
    new InputOption({ key: 'actions', label: 'Actions', input: 'InputActions' }),
  ]

  return {
    schema,
    options,
    userConfig: {},
  }
}

export const template = cardTemplate({
  templateId: '404',
  subTitle: 'A simple yet effective not-found page.',
  category: ['special'],
  icon: 'i-tabler-error-404',
  colorTheme: 'red',
  el: vue.defineAsyncComponent(async () => import('./El404.vue')),
  isPublic: false,
  getConfig,
})
