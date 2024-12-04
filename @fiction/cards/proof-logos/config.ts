import type { MediaObject } from '@fiction/core'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { colorThemeUser, NavListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const logoSchema = NavListItemSchema.pick({
  label: true,
  href: true,
  media: true,
  theme: true,
})

// Schema
export const schema = z.object({
  label: z.string().optional(),
  layout: z.enum(['inline', 'stacked']).optional(),
  items: z.array(logoSchema).optional(),
})

export type LogoConfig = z.infer<typeof logoSchema>
export type UserConfig = z.infer<typeof schema>

export const options: InputOption[] = [
  new InputOption({
    key: 'label',
    label: 'Label Text',
    input: 'InputText',
    props: {
      placeholder: 'e.g. Trusted By Industry Leaders',
    },
  }),
  new InputOption({
    key: 'layout',
    label: 'Layout Style',
    input: 'InputRadioButton',
    props: {
      options: [
        { label: 'Inline', value: 'inline' },
        { label: 'Stacked', value: 'stacked' },
      ],
    },
  }),
  new InputOption({
    key: 'items',
    label: 'Logos',
    input: 'InputList',
    options: [
      new InputOption({
        key: 'name',
        label: 'Company Name',
        input: 'InputText',
      }),
      new InputOption({
        key: 'href',
        label: 'Link URL',
        input: 'InputUrl',
      }),
      new InputOption({
        key: 'media',
        label: 'Logo',
        input: 'InputMedia',
      }),
      new InputOption({
        key: 'theme',
        label: 'Theme',
        input: 'InputSelect',
        props: {
          list: colorThemeUser,
        },
      }),
    ],
  }),
]

// Default configuration
export function getUserConfig(args: { stock: StockMedia, withColor: boolean }): UserConfig {
  const { stock, withColor = false } = args
  return {
    label: 'Trusted By Industry Leaders',
    items: [
      {
        label: 'Coke',
        media: stock.getLocalMedia({ key: 'logoCoke' }),
        href: '#',
        theme: withColor ? 'red' : undefined,
      },
      {
        label: 'Tesla',
        media: stock.getLocalMedia({ key: 'logoTesla' }),
        href: '#',
        theme: withColor ? 'blue' : undefined,
      },
      {
        label: 'Roblox',
        media: stock.getLocalMedia({ key: 'logoRoblox' }),
        href: '#',
        theme: withColor ? 'green' : undefined,
      },
      {
        label: 'Balenciaga',
        media: stock.getLocalMedia({ key: 'logoBalenciaga' }),
        href: '#',
        theme: withColor ? 'pink' : undefined,
      },
      {
        label: 'SpaceX',
        media: stock.getLocalMedia({ key: 'logoSpaceX' }),
        href: '#',
        theme: withColor ? 'indigo' : undefined,
      },

    ],
  }
}

// Demo configurations
export function getDemoConfigs(args: { templateId: string, stock: StockMedia }): Record<string, { templateId: string, userConfig: UserConfig }> {
  const { templateId } = args
  return {
    inline: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: false }),
        layout: 'inline',
      },
    },
    inlineColor: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: true }),
        layout: 'inline',
      },
    },
    stacked: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: false }),
        layout: 'stacked',
      },
    },
    stackedColor: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: true }),
        layout: 'stacked',
      },
    },

  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args
  const stock = await factory.getStockMedia()

  return {
    schema,
    options,
    userConfig: getUserConfig({ ...args, stock, withColor: false }),
    demoPage: {
      cards: Object.values(getDemoConfigs({ ...args, stock })),
    },
  }
}
