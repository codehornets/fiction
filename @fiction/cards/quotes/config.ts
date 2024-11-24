import type { ConfigResponse } from '@fiction/site/card.js'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { ActionButtonSchema, colorThemeUser, MediaDisplaySchema, navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema Definitions
const QuoteSchema = z.object({
  text: z.string().optional(),
  author: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    image: MediaDisplaySchema.optional(),
    href: z.string().optional(),
  }).optional(),
  org: z.object({
    name: z.string().optional(),
    image: MediaDisplaySchema.optional(),
    href: z.string().optional(),
  }).optional(),
  theme: z.enum(colorThemeUser).optional(),
  actions: z.array(ActionButtonSchema).optional(),
  layout: z.enum(['standard', 'compact', 'featured']).optional(),
})

const schema = z.object({
  quotes: z.array(QuoteSchema).optional(),
  display: z.object({
    style: z.enum(['grid', 'carousel', 'stack']).optional(),
    columns: z.number().min(1).max(4).optional(),
    showDividers: z.boolean().optional(),
    highlightActive: z.boolean().optional(),
  }).optional(),
})

// Type exports
export type Quote = z.infer<typeof QuoteSchema>
export type UserConfig = z.infer<typeof schema>

// Input Configuration
const options: InputOption[] = [
  new InputOption({
    key: 'display',
    label: 'Display Settings',
    input: 'InputControl',
    options: [
      new InputOption({
        key: 'style',
        label: 'Display Style',
        input: 'InputSelect',
        props: { list: ['grid', 'carousel', 'stack'] },
      }),
      new InputOption({
        key: 'columns',
        label: 'Grid Columns',
        input: 'InputSelect',
        props: { list: [1, 2, 3, 4] },
      }),
      new InputOption({
        key: 'showDividers',
        label: 'Show Dividers',
        input: 'InputToggle',
      }),
      new InputOption({
        key: 'highlightActive',
        label: 'Highlight Active',
        input: 'InputToggle',
      }),
    ],
  }),
  new InputOption({
    key: 'quotes',
    label: 'Testimonials',
    input: 'InputList',
    options: [
      new InputOption({
        key: 'text',
        label: 'Quote Text',
        input: 'InputTextarea',
        props: { rows: 3, placeholder: 'Share your customer\'s transformative experience...' },
      }),
      new InputOption({
        key: 'layout',
        label: 'Quote Layout',
        input: 'InputSelect',
        props: { list: ['standard', 'compact', 'featured'] },
      }),
      new InputOption({
        key: 'theme',
        label: 'Color Theme',
        input: 'InputSelect',
        props: { list: colorThemeUser },
      }),
      new InputOption({
        key: 'author',
        label: 'Author Details',
        input: 'InputControl',
        options: [
          new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
          new InputOption({ key: 'title', label: 'Title/Role', input: 'InputText' }),
          new InputOption({ key: 'image', label: 'Photo', input: 'InputMedia' }),
          new InputOption({ key: 'href', label: 'Profile Link', input: 'InputUrl' }),
        ],
      }),
      new InputOption({
        key: 'organization',
        label: 'Organization',
        input: 'InputControl',
        options: [
          new InputOption({ key: 'name', label: 'Company Name', input: 'InputText' }),
          new InputOption({ key: 'image', label: 'Logo', input: 'InputMedia' }),
          new InputOption({ key: 'href', label: 'Website', input: 'InputUrl' }),
        ],
      }),
      new InputOption({ key: 'actions', label: 'Actions', input: 'InputActions' }),
    ],
  }),
]

// Default Configuration
export async function getUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    display: {
      style: 'grid',
      columns: 2,
      showDividers: true,
      highlightActive: true,
    },
    quotes: [{
      text: 'Notice how a well-crafted testimonial can instantly build trust?',
      layout: 'featured',
      theme: 'emerald',
      author: {
        name: 'Sarah Chen',
        title: 'Marketing Director',
        image: stock.getRandomByTags(['woman']),
      },
      org: {
        name: 'GrowthMetrics',
        image: stock.getLocalMedia({ key: 'lorem1' }),
      },
      actions: [
        { label: 'View Case Study', href: '#' },
      ],
    }],
  }
}

// Demo Configurations
export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  return {
    display: {
      style: 'grid',
      columns: 3,
      showDividers: true,
      highlightActive: true,
    },
    quotes: [
      {
        text: 'Feel the impact of strategic positioning. This featured testimonial commands attention through its prominent placement and bold design.',
        layout: 'featured',
        theme: 'blue',
        author: {
          name: 'Michael Foster',
          title: 'CEO',
          image: stock.getRandomByTags(['man']),
        },
        org: {
          name: 'TechForward',
          image: stock.getLocalMedia({ key: 'logoBBC' }),
        },
        actions: [
          { label: 'Watch Video', href: '#' },
        ],
      },
      {
        text: 'Visualize how multiple testimonials create a pattern of trust. Each voice adds to your story\'s credibility.',
        layout: 'standard',
        theme: 'violet',
        author: {
          name: 'Elena Rodriguez',
          title: 'Lead Designer',
          image: stock.getRandomByTags(['woman']),
        },
        org: {
          name: 'DesignCraft',
          image: stock.getLocalMedia({ key: 'logoTesla' }),
        },
      },
      {
        text: 'Experience the power of social proof in action. Short, impactful quotes catch attention and drive engagement.',
        layout: 'compact',
        theme: 'amber',
        author: {
          name: 'James Wilson',
          title: 'Product Manager',
          image: stock.getRandomByTags(['man']),
        },
        org: {
          name: 'ProductLabs',
          image: stock.getLocalMedia({ key: 'logoNewspaper' }),
        },
      },
      {
        text: 'See how variety in layout and design keeps your testimonials fresh and engaging.',
        layout: 'standard',
        theme: 'emerald',
        author: {
          name: 'Sophia Lee',
          title: 'Customer Success',
          image: stock.getRandomByTags(['woman']),
        },
        org: {
          name: 'CustomerFirst',
          image: stock.getLocalMedia({ key: 'logoOmega' }),
        },
      },
    ],
  }
}

export async function getDemo(args: { factory: CardFactory, templateId: string, stock: StockMedia }) {
  const { templateId, stock } = args
  return { cards: [
    { templateId, userConfig: await getDemoUserConfig({ ...args, stock }) },
    { templateId, userConfig: await getUserConfig({ ...args, stock }) },
  ] }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }): Promise<ConfigResponse> {
  const stock = await args.factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig({ ...args, stock }),
    demoPage: await getDemo({ ...args, stock }),
  }
}
