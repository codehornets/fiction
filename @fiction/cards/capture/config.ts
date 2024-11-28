import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { MediaBasicSchema, superTitleSchema, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui/index.js'
import { z } from 'zod'

const schema = z.object({
  superTitle: superTitleSchema.describe('Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"').optional(),
  title: z.string().describe('Newsletter hook header 5 words or so').optional(),
  subTitle: z.string().describe('Specific benefits of subscribing').optional(),
  media: MediaBasicSchema.optional().describe('Image or video for the form'),
  presentationMode: z.enum(['inline', 'onScroll', 'onLoad']).optional(),
  buttonText: z.string().optional().describe('Text on the subscribe button'),
  thanksText: z.string().optional().describe('Text on the thank you message'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'presentationMode',
    label: 'Display Mode',
    input: 'InputSelect',
    list: ['inline', 'onScroll', 'onLoad'],
    description: 'Choose how to show your form: within content, as a scroll popup, or immediately on page load',
  }),
  new InputOption({
    key: 'superTitle.text',
    label: 'Super Title',
    input: 'InputText',
    description: 'Metric or KPI for the newsletter, e.g. "22,300+ subscribers"',
  }),
  new InputOption({
    key: 'title',
    label: 'Header',
    input: 'InputText',
    description: 'Newsletter hook header 5 words or so',
  }),
  new InputOption({
    key: 'subTitle',
    label: 'Sub Header',
    input: 'InputText',
    description: 'Specific benefits of subscribing',
  }),
  new InputOption({
    key: 'media',
    label: 'Featured Media',
    input: 'InputMedia',
  }),
  new InputOption({
    key: 'buttonText',
    label: 'Sign Up Button Text',
    input: 'InputText',
    placeholder: 'Get the Guide',
    description: 'Compelling call-to-action for your submit button',
  }),
  new InputOption({
    key: 'thanksText',
    label: 'Success Message',
    input: 'InputText',
    placeholder: 'Welcome aboard! Check your inbox.',
    description: 'Confirmation message after successful signup',
  }),
]

type ConfigHelpers = { factory: CardFactory, templateId: string, stock: StockMedia }

export async function getUserConfig(args: ConfigHelpers) {
  const { stock } = args
  const demoUserConfig: UserConfig = {
    superTitle: { text: 'Join 10k+ Subscribers' },
    title: 'Exclusive Subscriber-Only Resources',
    subTitle: 'Subscribers get exclusive tips, reports and strategies every week.',
    media: stock.getLocalMedia({ key: 'lorem1' }),
    buttonText: 'Join The List',
    thanksText: 'Welcome aboard! Check your inbox for your guide.',
  } as const

  return demoUserConfig
}

export async function getDemo(args: ConfigHelpers) {
  const { templateId } = args
  const baseConfig = await getUserConfig(args)

  return {
    cards: [
      // Inline form example
      {
        templateId,
        userConfig: {
          ...baseConfig,
          presentationMode: 'inline',
          title: 'Subscribe to Our Weekly Insights',
          subTitle: 'Join thousands of marketers getting actionable tips every Tuesday',
        },
      },
      // Content separator for demo
      {
        templateId: 'demoProse',
        el: vue.defineAsyncComponent(async () => import('./DemoProse.vue')),
      },
      {
        templateId,
        userConfig: {
          ...baseConfig,
          presentationMode: 'onLoad',
          superTitle: { text: 'Limited Time Offer' },
          title: 'Get Our 2024 Growth Guide',
          subTitle: 'Download our proven framework for scaling startups to 7-figures. Available free for a limited time.',
          buttonText: 'Download Free Guide',
          thanksText: 'Your guide is on its way! Check your inbox in the next 2 minutes.',
        },
      },
      // Scroll trigger example
      {
        templateId,
        userConfig: {
          ...baseConfig,
          presentationMode: 'onScroll',
          title: 'Want More Growth Tips?',
          subTitle: 'Get weekly insights from industry experts',
          buttonText: 'Join the Community',
        },
      },
    ],
  }
}

export async function getConfig(args: { factory: CardFactory, templateId: string }): Promise<ConfigResponse> {
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()

  const a = { ...args, stock }
  const userConfig = await getUserConfig(a)
  const demoPage = await getDemo(a)
  return {
    schema,
    options,
    userConfig,
    demoPage,
  }
}
