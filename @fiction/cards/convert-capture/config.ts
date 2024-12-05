import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, MediaBasicSchema, superTitleSchema, vue } from '@fiction/core'
import { createOption } from '@fiction/ui/index.js'
import { z } from 'zod'

const schema = z.object({
  superTitle: superTitleSchema.describe('Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"').optional(),
  title: z.string().describe('Newsletter hook header 5 words or so').optional(),
  subTitle: z.string().describe('Specific benefits of subscribing').optional(),
  media: MediaBasicSchema.optional().describe('Image or video for the form'),
  action: ActionAreaSchema.optional(),
  presentationMode: z.enum(['inline', 'onScroll', 'onLoad']).optional(),
  _editorPreview: z.enum(['modal', 'load']).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options = [
  createOption({
    schema,
    key: 'settingsGroup',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'presentationMode',
        label: 'Display Mode',
        input: 'InputRadioButton',
        list: ['inline', 'onScroll', 'onLoad'],
        description: 'Choose how to show your form: within content, as a scroll popup, or immediately on page load',
      }),
      createOption({
        schema,
        key: '_editorPreview',
        label: 'Preview Modal View',
        subLabel: 'Preview the modals for this card',
        input: 'InputRadioButton',
        list: [{ label: 'Capture Modal', value: 'modal' }, { label: 'Loading Screen', value: 'load' }],
      }),
    ],
  }),

  createOption({
    schema,
    key: 'contentGroup',
    label: 'Content',
    icon: { class: 'i-tabler-highlight' },
    input: 'group',
    options: [

      createOption({
        schema,
        key: 'title',
        label: 'Header',
        input: 'InputText',
        description: 'Newsletter hook header 5 words or so',
      }),
      createOption({
        schema,
        key: 'subTitle',
        label: 'Sub Header',
        input: 'InputText',
        description: 'Specific benefits of subscribing',
      }),
      createOption({
        schema,
        key: 'superTitle',
        label: 'Super Title',
        input: 'InputSuperTitle',
      }),
      createOption({
        schema,
        key: 'media',
        label: 'Featured Media',
        input: 'InputMedia',
      }),
    ],
  }),

  createOption({
    schema,
    key: 'action',
    input: 'InputActionArea',
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
    action: {
      variant: 'subscribe',
      subscribe: {
        button: { label: 'Join The List' },
        success: { title: 'Welcome aboard!', content: 'Check your inbox for your guide.' },
      },
    },
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
      },
      {
        templateId,
        userConfig: {
          ...baseConfig,
          presentationMode: 'onLoad',
          superTitle: { text: 'Limited Time Offer' },
          title: 'Get Our 2024 Growth Guide',
          subTitle: 'Download our proven framework for scaling startups to 7-figures. Available free for a limited time.',
          action: {
            variant: 'subscribe',
            subscribe: {
              button: { label: 'Join The List' },
              success: { title: 'You did it!', content: 'Check your inbox for your guide.' },
            },
          },
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
          action: {
            variant: 'subscribe',
            subscribe: {
              button: { label: 'Let\'s do it!' },
              success: { title: 'Nice!', content: 'Check your inbox for your guide.' },
            },
          },
        },
      },
    ],
  }
}

export async function getConfig(args: { factory: CardFactory, templateId: string }) {
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
