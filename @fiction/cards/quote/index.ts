import type { SiteUserConfig } from '@fiction/site/schema'
import { MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'quotes'

const QuoteSchema = z.object({
  text: z.string(),
  author: z.object({
    name: z.string(),
    title: z.string().optional(),
    image: MediaBasicSchema.optional(),
    href: z.string().optional(),
  }).optional(),
  org: z.object({
    name: z.string().optional(),
    image: MediaBasicSchema.optional(),
    href: z.string().optional(),
  }).optional(),
}).optional()

export type Quote = z.infer<typeof QuoteSchema>

const UserConfigSchema = z.object({
  quotes: z.array(QuoteSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema> & SiteUserConfig

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A quote card with author and organization information',
  icon: 'i-tabler-quote',
  colorTheme: 'green',
  el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),
  isPublic: true,
  options: [
    new InputOption({
      input: 'InputList',
      key: `quotes`,
      options: [
        new InputOption({ key: 'text', label: 'Quote Text', input: 'InputText' }),
        new InputOption({ key: 'author.name', label: 'Author', input: 'InputText' }),
        new InputOption({ key: 'author.title', label: 'Title', input: 'InputText' }),
        new InputOption({ key: 'author.image', label: 'Author Image', input: 'InputMedia' }),
        new InputOption({ key: 'author.href', label: 'Author Link', input: 'InputUrl' }),
        new InputOption({ key: 'org.name', label: 'Organization', input: 'InputText' }),
        new InputOption({ key: 'org.image', label: 'Organization Image', input: 'InputMedia' }),
        new InputOption({ key: 'org.href', label: 'Organization Link', input: 'InputUrl' }),
      ],
    }),
  ],
  schema: UserConfigSchema,
  getUserConfig: async (args) => {
    const { getUserConfig } = await import('./config')
    return getUserConfig({ ...args, templateId })
  },
  demoPage: async (args) => {
    const { getDemo } = await import('./config')
    return getDemo({ templateId, ...args })
  },
})
