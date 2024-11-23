import { navListItemSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'pricing'

const pricingFeatureSchema = navListItemSchema.pick({ label: true })

const priceSchema = z.object({
  title: z.string().optional().describe('name of pricing plan'),
  price: z.number().optional().describe('monthly price of plan'),
  description: z.string().optional().describe('description of plan, compared to other plans (all of free plan, plus...)'),
  href: z.string().optional().describe('link to purchase plan'),
  hrefAnnual: z.string().optional().describe('link to purchase annual plan'),
  features: z.array(pricingFeatureSchema).optional().describe('list of features on plan'),
  isHighlighted: z.boolean().optional().describe('highlight this plan'),
  icon: z.string().optional().describe('icon to show on plan (format i-tabler-<icon>)'),
  badge: z.string().optional().describe('badge to show on plan (e.g. "Most Popular")'),
  buttonText: z.string().optional().describe('text for button to purchase plan'),
})

const schema = z.object({
  hasAnnual: z.boolean().optional().describe('Show Annual Discount'),
  annualDiscountPercent: z.number().optional().describe('Annual Discount Percent'),
  prices: z.array(priceSchema),
})

export type UserConfigPrice = z.infer<typeof priceSchema>
export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'hasAnnual', label: 'Show Annual Discount', input: 'InputToggle' }),
  new InputOption({ key: 'annualDiscountPercent', label: 'Annual Discount Percent', input: 'InputRange', props: { min: 0, max: 100 } }),
  new InputOption({ key: 'prices', label: 'Prices', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'price', label: 'Price', input: 'InputNumber' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'Purchase Link', input: 'InputText' }),
    new InputOption({ key: 'hrefAnnual', label: 'Annual Purchase Link', input: 'InputText' }),
    new InputOption({ key: 'features', label: 'Features', input: 'InputList', options: [
      new InputOption({ key: 'name', label: 'Text', input: 'InputText' }),
    ] }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputText' }),
    new InputOption({ key: 'isHighlighted', label: 'Highlighted', input: 'InputToggle' }),
    new InputOption({ key: 'badge', label: 'Badge', input: 'InputText' }),
    new InputOption({ key: 'buttonText', label: 'Button Text', input: 'InputText' }),
  ] }),
]

const defaultConfig: UserConfig = {
  annualDiscountPercent: 40,
  prices: [
    {
      title: 'Basic',
      price: 0,
      description: `What's included...`,
      href: `#`,
      icon: 'i-tabler-free-rights',
      features: [
        { label: 'Up to 1,500 Subscribers' },
        { label: 'Web Hosting' },
        { label: 'Websites' },
        { label: 'Basic Features' },
      ],
    },
    {
      title: 'Pro',
      price: 99,
      description: `Everything in Basic, plus...`,
      href: '#',
      badge: 'Most Popular',
      icon: 'i-tabler-star',
      features: [
        { label: 'Up to 10,000 subscribers' },
        { label: 'Remove Branding' },
        { label: 'Custom domains' },
        { label: 'Pro Features' },
      ],
      isHighlighted: true,
    },
    {
      title: 'Pro+',
      price: 199,
      description: `Everything in Pro, plus...`,
      href: '#',
      badge: 'Advanced Features',
      icon: 'i-tabler-stars',
      features: [
        { label: 'Up to 25,000 subscribers' },
        { label: 'Private Community Access' },
        { label: 'Advanced UI cards' },
        { label: 'AI Copilot' },
        { label: 'Pro+ Only Features' },
      ],
    },
  ],
}

const altConfig: UserConfig = {
  hasAnnual: true,
  annualDiscountPercent: 40,
  prices: [
    {
      title: 'Basic',
      price: 0,
      description: `What's included...`,
      href: `#`,
      icon: 'i-tabler-free-rights',
      features: [
        { label: 'Up to 1,500 Subscribers' },
        { label: 'Web Hosting' },
        { label: 'Websites' },
        { label: 'Basic Features' },
      ],
    },
    {
      title: 'Pro',
      price: 99,
      description: `Everything in Basic, plus...`,
      href: '#',
      badge: 'Most Popular',
      icon: 'i-tabler-star',
      features: [
        { label: 'Up to 10,000 subscribers' },
        { label: 'Remove Branding' },
        { label: 'Custom domains' },
        { label: 'Pro Features' },
      ],
      isHighlighted: true,
    },
  ],
}

export const template = cardTemplate({
  templateId,
  category: ['advanced'],
  description: 'Pricing columns with features and buttons',
  icon: 'i-tabler-report-money',
  colorTheme: 'indigo',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  options,
  schema,
  getUserConfig: () => defaultConfig,
  isPublic: true,
  demoPage: async () => {
    return {
      cards: [
        { templateId: 'pricing', userConfig: { ...defaultConfig } },
        { templateId: 'pricing', userConfig: { ...altConfig } },
      ],
    }
  },
})
