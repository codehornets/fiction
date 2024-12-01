import type { ConfigResponse } from '@fiction/site/card.js'
import { ActionButtonSchema, MediaIconSchema, navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const pricingFeatureSchema = navListItemSchema.pick({ label: true })

const priceSchema = z.object({
  title: z.string().optional().describe('name of pricing plan'),
  price: z.number().optional().describe('monthly price of plan'),
  description: z.string().optional().describe('compelling description highlighting plan value'),
  href: z.string().optional().describe('link for monthly plan purchase'),
  hrefAnnual: z.string().optional().describe('link for annual plan purchase'),
  features: z.array(pricingFeatureSchema).optional().describe('list of included features'),
  variant: z.enum(['default', 'highlighted', 'muted']).optional().describe('visual style - highlighted draws attention, muted reduces emphasis'),
  icon: MediaIconSchema.optional().describe('plan icon - helps visually differentiate tiers'),
  badge: z.string().optional().describe('optional badge text like "Most Popular" or "Best Value"'),
  buttonText: z.string().optional().describe('call-to-action text'),
})

const schema = z.object({
  hasAnnual: z.boolean().optional().describe('enable annual pricing option'),
  annualDiscountPercent: z.number().optional().describe('discount percentage for annual plans'),
  pricingStyle: z.enum(['cards', 'minimal', 'feature-focus']).optional().describe('visual presentation style'),
  prices: z.array(priceSchema).optional(),
})

export type PricingPlan = z.infer<typeof priceSchema>
export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'style',
    label: 'Style & Layout',
    input: 'group',
    options: [
      new InputOption({
        key: 'pricingStyle',
        label: 'Visual Style',
        input: 'InputSelect',
        props: {
          list: [
            { label: 'Feature Cards', value: 'cards' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Feature Focus', value: 'feature-focus' },
          ],
        },
      }),
      new InputOption({
        key: 'hasAnnual',
        label: 'Annual Pricing',
        input: 'InputToggle',
        description: 'Enable annual pricing with discount',
      }),
      new InputOption({
        key: 'annualDiscountPercent',
        label: 'Annual Discount',
        input: 'InputRange',
        props: { min: 0, max: 100, step: 5 },
        description: 'Percentage discount for annual plans',
      }),
    ],
  }),
  new InputOption({
    key: 'prices',
    label: 'Pricing Plans',
    input: 'InputList',
    description: 'Configure your pricing tiers',
    options: [
      new InputOption({ key: 'title', label: 'Plan Name', input: 'InputText', isRequired: true }),
      new InputOption({ key: 'price', label: 'Monthly Price', input: 'InputNumber' }),
      new InputOption({
        key: 'description',
        label: 'Description',
        input: 'InputTextarea',
        description: 'Highlight the key value proposition',
      }),
      new InputOption({
        key: 'variant',
        label: 'Visual Style',
        input: 'InputSelect',
        props: {
          list: [
            { label: 'Default', value: 'default' },
            { label: 'Highlighted', value: 'highlighted' },
            { label: 'Muted', value: 'muted' },
          ],
        },
      }),
      new InputOption({ key: 'icon', label: 'Plan Icon', input: 'InputIcon' }),
      new InputOption({ key: 'badge', label: 'Badge Text', input: 'InputText' }),
      new InputOption({
        key: 'features',
        label: 'Features',
        input: 'InputList',
        props: { itemLabel: 'Feature' },
        options: [
          new InputOption({
            key: 'label',
            label: 'Feature Description',
            input: 'InputText',
            isRequired: true,
          }),
        ],
      }),
      new InputOption({ key: 'buttonText', label: 'Button Text', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'Monthly Plan Link', input: 'InputUrl' }),
      new InputOption({ key: 'hrefAnnual', label: 'Annual Plan Link', input: 'InputUrl' }),
    ],
  }),
]

function getDefaultConfig(): UserConfig {
  return {
    hasAnnual: true,
    annualDiscountPercent: 20,
    pricingStyle: 'cards',
    prices: [
      {
        title: 'Starter',
        price: 0,
        description: 'Perfect for trying out our core features',
        icon: { class: 'i-tabler-rocket' },
        features: [
          { label: 'Up to 1,000 monthly visitors' },
          { label: 'Basic analytics dashboard' },
          { label: 'Standard support response time' },
          { label: 'Community access' },
        ],
        buttonText: 'Start Free',
        href: '#starter-monthly',
        hrefAnnual: '#starter-annual',
      },
      {
        title: 'Professional',
        price: 49,
        description: 'Everything you need to grow your business',
        variant: 'highlighted',
        badge: 'Most Popular',
        icon: { class: 'i-tabler-stars' },
        features: [
          { label: 'Unlimited visitors' },
          { label: 'Advanced analytics & reporting' },
          { label: 'Priority support (24h response)' },
          { label: 'Custom domain support' },
          { label: 'Remove branding' },
          { label: 'API access' },
        ],
        buttonText: 'Start Pro Trial',
        href: '#pro-monthly',
        hrefAnnual: '#pro-annual',
      },
      {
        title: 'Enterprise',
        price: 199,
        description: 'Advanced features for larger organizations',
        icon: { class: 'i-tabler-building-skyscraper' },
        features: [
          { label: 'Everything in Professional' },
          { label: 'Dedicated account manager' },
          { label: 'Custom integration support' },
          { label: 'Advanced security features' },
          { label: 'SLA guarantee' },
          { label: 'Custom contract terms' },
        ],
        buttonText: 'Contact Sales',
        href: '#enterprise-monthly',
        hrefAnnual: '#enterprise-annual',
      },
    ],
  }
}

function getStartupConfig(): UserConfig {
  return {
    hasAnnual: true,
    annualDiscountPercent: 25,
    pricingStyle: 'feature-focus',
    prices: [
      {
        title: 'Bootstrap',
        price: 0,
        description: 'Perfect for early-stage startups',
        icon: { class: 'i-tabler-plant-2' },
        features: [
          { label: 'Essential features to get started' },
          { label: 'Up to 3 team members' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
        ],
        buttonText: 'Start Building',
      },
      {
        title: 'Scale Up',
        price: 79,
        variant: 'highlighted',
        badge: 'Recommended',
        description: 'Power features for growing teams',
        icon: { class: 'i-tabler-chart-arrows-vertical' },
        features: [
          { label: 'Everything in Bootstrap, plus:' },
          { label: 'Unlimited team members' },
          { label: 'Advanced integrations' },
          { label: 'Priority support' },
          { label: 'Enhanced security' },
        ],
        buttonText: 'Scale Your Business',
      },
    ],
  }
}

export async function getConfig(args: { templateId: string }) {
  return {
    schema,
    options,
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        { templateId: args.templateId, userConfig: getDefaultConfig() },
        { templateId: args.templateId, userConfig: getStartupConfig() },
      ],
    },
  }
}
