import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { ActionAreaSchema, colorThemeUser, NavListItemSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const AuthorSchema = NavListItemSchema.pick({
  label: true,
  subLabel: true,
  href: true,
  media: true,
})

const OrganizationSchema = NavListItemSchema.pick({
  label: true,
  subLabel: true,
  href: true,
  media: true,
})

// Schema Definitions
const QuoteSchema = z.object({
  text: z.string().optional(),
  author: AuthorSchema.optional(),
  org: OrganizationSchema.optional(),
  theme: z.enum(colorThemeUser).optional(),
  action: ActionAreaSchema.optional(),
  layout: z.enum(['standard', 'compact', 'featured']).optional(),
})

const schema = z.object({
  quotes: z.array(QuoteSchema).optional(),
})

export type Quote = z.infer<typeof QuoteSchema>
export type UserConfig = z.infer<typeof schema>

// Input Configuration
const options = [
  createOption({
    schema,
    input: 'group',
    key: 'group.quotes',
    label: 'Quotes',
    icon: { class: 'i-tabler-quotes' },
    options: [
      createOption({
        schema,
        key: 'quotes',
        input: 'InputList',
        props: {
          itemName: 'Quote',
          itemLabel: args => (args?.item as Quote)?.text ?? 'Untitled',
        },
        options: [
          createOption({
            schema,
            key: 'quotes.0.text',
            label: 'Quote Text',
            input: 'InputProse',
          }),
          createOption({
            schema,
            key: 'quotes.0.layout',
            label: 'Quote Layout',
            input: 'InputSelect',
            props: { list: ['standard', 'compact', 'featured'] },
          }),
          createOption({
            schema,
            key: 'quotes.0.theme',
            label: 'Color Theme',
            input: 'InputColorTheme',
          }),
          createOption({
            schema,
            key: 'quotes.0.author',
            label: 'Author Details',
            input: 'group',
            options: [
              createOption({
                schema,
                key: 'quotes.0.author.label',
                label: 'Name',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'quotes.0.author.subLabel',
                label: 'Title/Role',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'quotes.0.author.media',
                label: 'Photo',
                input: 'InputMedia',
              }),
              createOption({
                schema,
                key: 'quotes.0.author.href',
                label: 'Profile Link',
                input: 'InputUrl',
              }),
            ],
          }),
          createOption({
            schema,
            key: 'quotes.0.org',
            label: 'Organization',
            input: 'group',
            options: [
              createOption({
                schema,
                key: 'quotes.0.org.label',
                label: 'Company Name',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'quotes.0.org.subLabel',
                label: 'Company Description',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'quotes.0.org.media',
                label: 'Logo',
                input: 'InputMedia',
              }),
              createOption({
                schema,
                key: 'quotes.0.org.href',
                label: 'Website',
                input: 'InputUrl',
              }),
            ],
          }),
          createOption({
            schema,
            key: 'quotes.0.action',
            label: 'Actions',
            input: 'InputActionArea',
          }),
        ],
      }),
    ],
  }),

]

// Default Configuration
export async function getUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    quotes: [{
      text: 'Notice how a well-crafted testimonial can instantly build trust?',
      layout: 'featured',
      theme: 'emerald',
      author: {
        label: 'Sarah Chen',
        subLabel: 'Marketing Director',
        media: stock.getRandomByTags(['woman']),
      },
      org: {
        label: 'GrowthMetrics',
        media: stock.getLocalMedia({ key: 'lorem1' }),
      },
      action: {
        buttons: [
          { label: 'View Case Study', href: '#' },
        ],
      },
    }],
  }
}

// Demo Configurations
export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  return {
    quotes: [
      {
        text: 'Feel the impact of strategic positioning. This featured testimonial commands attention through its prominent placement and bold design.',
        layout: 'featured',
        theme: 'blue',
        author: {
          label: 'Michael Foster',
          subLabel: 'CEO',
          media: stock.getRandomByTags(['man']),
        },
        org: {
          label: 'TechForward',
          media: stock.getLocalMedia({ key: 'logoBBC' }),
        },
        action: {
          buttons: [
            { label: 'Watch Video', href: '#' },
          ],
        },
      },
      {
        text: 'Visualize how multiple testimonials create a pattern of trust. Each voice adds to your story\'s credibility.',
        layout: 'standard',
        theme: 'violet',
        author: {
          label: 'Elena Rodriguez',
          subLabel: 'Lead Designer',
          media: stock.getRandomByTags(['woman']),
        },
        org: {
          label: 'DesignCraft',
          media: stock.getLocalMedia({ key: 'logoTesla' }),
        },
      },
      {
        text: 'Experience the power of social proof in action. Short, impactful quotes catch attention and drive engagement.',
        layout: 'compact',
        theme: 'amber',
        author: {
          label: 'James Wilson',
          subLabel: 'Product Manager',
          media: stock.getRandomByTags(['man']),
        },
        org: {
          label: 'ProductLabs',
          media: stock.getLocalMedia({ key: 'logoNewspaper' }),
        },
      },
      {
        text: 'See how variety in layout and design keeps your testimonials fresh and engaging.',
        layout: 'standard',
        theme: 'emerald',
        author: {
          label: 'Sophia Lee',
          subLabel: 'Customer Success',
          media: stock.getRandomByTags(['woman']),
        },
        org: {
          label: 'CustomerFirst',
          media: stock.getLocalMedia({ key: 'logoOmega' }),
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

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const stock = await args.factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig({ ...args, stock }),
    demoPage: await getDemo({ ...args, stock }),
  }
}
