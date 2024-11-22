import { ActionButtonSchema, MediaDisplaySchema, MediaIconSchema, MediaTypographySchema, NavListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  brand: z.object({
    logo: MediaTypographySchema.optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    actions: z.array(ActionButtonSchema).optional(),
  }).optional(),
  columns: z.array(z.object({
    title: z.string().optional(),
    items: z.array(NavListItemSchema).optional(),
  })).optional(),
  badges: z.object({
    title: z.string().optional(),
    actions: z.array(ActionButtonSchema).optional(),
  }).optional(),
  additional: z.object({
    links: z.array(NavListItemSchema).optional(),
    social: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      media: MediaIconSchema.optional(),
    })).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      title: 'Your Brand',
      subTitle: 'Build something amazing',
      actions: [
        { name: 'Get Started', theme: 'primary', design: 'ghost', size: 'sm' },
        { name: 'Contact Sales', theme: 'default', design: 'ghost', size: 'sm' },
      ],
    },
    columns: [
      {
        title: 'Product',
        items: [
          { name: 'Features', href: '/features', media: { iconId: 'sparkles' } },
          { name: 'Solutions', href: '/solutions', media: { iconId: 'puzzle' } },
          { name: 'Enterprise', href: '/enterprise', media: { iconId: 'building' } },
        ],
      },
      {
        title: 'Resources',
        items: [
          { name: 'Documentation', href: '/docs', media: { iconId: 'book' } },
          { name: 'API Reference', href: '/api', media: { iconId: 'code' } },
          { name: 'Status', href: '/status', media: { iconId: 'activity' } },
        ],
      },
    ],
    badges: {
      title: 'Trusted By',
      actions: [
        {
          icon: { iconId: 'shield' },
          name: 'SOC 2 Type II',
          href: '/security',
        },
        {
          icon: { iconId: 'check' },
          name: 'GDPR Compliant',
          href: '/privacy',
        },
      ],
    },
    additional: {
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
      ],
      social: [
        { name: 'X', href: 'https://x.com', media: { iconId: 'x' } },
        { name: 'GitHub', href: 'https://github.com', media: { iconId: 'github' } },
        { name: 'LinkedIn', href: 'https://linkedin.com', media: { iconId: 'linkedin' } },
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

async function getDemoConfig(args: { templateId: string }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId } = args
  return [
    {
      templateId,
      userConfig: {
        brand: {
          title: 'CloudFlow',
          subTitle: 'Simplify Your Cloud Infrastructure',
          actions: [
            { name: 'Start Free', theme: 'primary' },
            { name: 'Talk to Sales', theme: 'default' },
          ],
        },
        columns: [
          {
            title: 'Platform',
            items: [
              { name: 'Features', href: '/features', media: { iconId: 'sparkles' } },
              { name: 'Solutions', href: '/solutions', media: { iconId: 'puzzle' } },
              { name: 'Enterprise', href: '/enterprise', media: { iconId: 'building' } },
              { name: 'Pricing', href: '/pricing', media: { iconId: 'tag' } },
            ],
          },
          {
            title: 'Resources',
            items: [
              { name: 'Documentation', href: '/docs', media: { iconId: 'book' } },
              { name: 'API Reference', href: '/api', media: { iconId: 'code' } },
              { name: 'Status', href: '/status', media: { iconId: 'activity' } },
            ],
          },
          {
            title: 'Company',
            items: [
              { name: 'About', href: '/about', media: { iconId: 'users' } },
              { name: 'Blog', href: '/blog', media: { iconId: 'rss' } },
              { name: 'Careers', href: '/careers', media: { iconId: 'briefcase' } },
            ],
          },
        ],
        badges: {
          title: 'Certifications',
          actions: [
            {
              icon: { iconId: 'shield' },
              name: 'SOC 2 Type II',
            },
            {
              icon: { iconId: 'shield' },
              name: 'GDPR Compliant',
            },
            {
              icon: { iconId: 'shield' },
              name: 'ISO 27001',
            },
          ],
        },
        additional: {
          links: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Security', href: '/security' },
            { name: 'Accessibility', href: '/accessibility' },
          ],
          social: [
            { name: 'X', href: 'https://x.com', media: { iconId: 'x' } },
            { name: 'GitHub', href: 'https://github.com', media: { iconId: 'github' } },
            { name: 'LinkedIn', href: 'https://linkedin.com', media: { iconId: 'linkedin' } },
            { name: 'YouTube', href: 'https://youtube.com', media: { iconId: 'youtube' } },
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

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: await getDemoConfig({ templateId }),
    },
  }
}
