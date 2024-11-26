import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { actionAreaSchema, ActionButtonSchema, MediaTypographySchema, navListItemSchema, navListSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const socialItemSchema = navListItemSchema.pick({
  label: true,
  href: true,
  media: true,
})

export const schema = z.object({
  brand: z.object({
    logo: MediaTypographySchema.optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    action: actionAreaSchema.optional(),
  }).optional(),
  columns: z.array(navListSchema).optional(),
  badges: z.object({
    title: z.string().optional(),
    action: actionAreaSchema.optional(),
  }).optional(),
  additional: z.object({
    links: z.array(navListItemSchema).optional(),
    social: z.array(socialItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      title: 'Add Your Brand',
      subTitle: 'Add your brand tagline here',
      action: {
        buttons: [],
      },
    },
    columns: [
      {
        title: 'Resources',
        items: [
          { label: 'Add Site Links', href: '/status', icon: { iconId: 'activity' } },
        ],
      },
    ],
    badges: {
      title: 'Trusted By',
      action: {
        buttons: [
          {
            icon: { iconId: 'star' },
            label: 'Certified',
            href: '#',
          },
        ],
      },
    },
    additional: {
      links: [
        { label: 'Terms', href: '/terms' },
      ],
      social: [
        { label: 'X', href: 'https://x.com', media: { iconId: 'x' } },
      ],
    },
  }
}

function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'brand',
      label: 'Brand Presence',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Brand Name',
          input: 'InputText',
          props: { placeholder: 'Your Brand Name' },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Brand Message',
          input: 'InputText',
          props: { placeholder: 'Your brand tagline or message' },
        }),
        new InputOption({
          key: 'actions',
          label: 'Call to Action',
          input: 'InputActions',
        }),
      ],
    }),
    new InputOption({
      key: 'columns',
      label: 'Navigation Columns',
      input: 'InputList',
      props: { itemName: 'Column' },
      options: [
        new InputOption({
          key: 'title',
          label: 'Column Title',
          input: 'InputText',
        }),
        new InputOption({
          key: 'items',
          label: 'Navigation Items',
          input: 'InputList',
          props: { itemName: 'Navigation Link' },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
            }),
            new InputOption({
              key: 'href',
              label: 'Link URL',
              input: 'InputUrl',
            }),
            new InputOption({
              key: 'media',
              label: 'Icon',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),
    new InputOption({
      key: 'badges',
      label: 'Trust Badges',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Section Title',
          input: 'InputText',
        }),
        new InputOption({
          key: 'items',
          label: 'Badge Items',
          input: 'InputList',
          props: { itemName: 'Badge' },
          options: [
            new InputOption({
              key: 'media',
              label: 'Badge Icon/Image',
              input: 'InputMedia',
            }),
            new InputOption({
              key: 'title',
              label: 'Badge Title',
              input: 'InputText',
            }),
            new InputOption({
              key: 'href',
              label: 'Badge Link',
              input: 'InputUrl',
            }),
          ],
        }),
      ],
    }),
    new InputOption({
      key: 'additional',
      label: 'Additional Links',
      input: 'group',
      options: [
        new InputOption({
          key: 'links',
          label: 'Footer Links',
          input: 'InputList',
          props: { itemName: 'Link' },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
            }),
            new InputOption({
              key: 'href',
              label: 'Link URL',
              input: 'InputUrl',
            }),
          ],
        }),
        new InputOption({
          key: 'social',
          label: 'Social Links',
          input: 'InputList',
          props: { itemName: 'Social Link' },
          options: [
            new InputOption({
              key: 'name',
              label: 'Platform Name',
              input: 'InputText',
            }),
            new InputOption({
              key: 'href',
              label: 'Profile URL',
              input: 'InputUrl',
            }),
            new InputOption({
              key: 'media',
              label: 'Platform Icon',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),
  ]
}

async function getDemoConfig(args: { templateId: string, stock: StockMedia }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId, stock } = args
  return [
    {
      templateId,
      userConfig: {
        brand: {
          logo: stock.getLocalMedia({ key: 'lorem1' }),
          title: 'CloudFlow',
          subTitle: 'Simplify Your Cloud Infrastructure',
          action: {
            buttons: [
              { label: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
              { label: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
            ],
          },
        },
        columns: [
          {
            title: 'Platform',
            items: [
              { label: 'Features', href: '/features', icon: { iconId: 'sparkles' } },
              { label: 'Solutions', href: '/solutions', icon: { iconId: 'puzzle' } },
              { label: 'Enterprise', href: '/enterprise', icon: { class: 'i-tabler-building' } },
              { label: 'Pricing', href: '/pricing', icon: { iconId: 'tag' } },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Documentation', href: '/docs', icon: { iconId: 'book' } },
              { label: 'API Reference', href: '/api', icon: { iconId: 'code' } },
              { label: 'Status', href: '/status', icon: { class: 'i-tabler-activity' } },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About', href: '/about', icon: { iconId: 'users' } },
              { label: 'Blog', href: '/blog', icon: { class: 'i-tabler-rss' } },
              { label: 'Careers', href: '/careers', icon: { iconId: 'briefcase' } },
            ],
          },
        ],
        badges: {
          title: 'Certifications',
          action: { buttons: [
            {
              icon: { iconId: 'star' },
              label: 'Read Reviews',
              theme: 'yellow',
            },
            {
              icon: { iconId: 'users' },
              label: 'Read Testimonials',
              theme: 'blue',
            },
            {
              icon: { iconId: 'check' },
              label: 'Satisfaction Guaranteed',
              theme: 'green',
            },
          ] },
        },
        additional: {
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Security', href: '/security' },
            { label: 'Accessibility', href: '/accessibility' },
          ],
          social: [
            { label: 'X', href: 'https://x.com', media: { iconId: 'x' } },
            { label: 'GitHub', href: 'https://github.com', media: { iconId: 'github' } },
            { label: 'LinkedIn', href: 'https://linkedin.com', media: { iconId: 'linkedin' } },
            { label: 'YouTube', href: 'https://youtube.com', media: { iconId: 'youtube' } },
          ],
        },
      },
    },
    {
      templateId,
      userConfig: getDefaultConfig(),
    },
  ]
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: await getDemoConfig({ templateId, stock }),
    },
  }
}
