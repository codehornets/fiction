import { NavListItemSchema } from '@fiction/core/schemas/schemas'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  menus: z.array(NavListItemSchema).optional(),
  additional: z.object({
    list1: z.array(NavListItemSchema).optional(),
    list2: z.array(NavListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getDefaultConfig(): UserConfig {
  return {
    title: 'Your Brand',
    subTitle: 'An inspiring tagline goes here',
    menus: [
      {
        itemsTitle: 'Discover',
        items: [
          { name: 'Our Vision', href: '/about', media: { iconId: 'eye' } },
          { name: 'Services', href: '/services', media: { iconId: 'star' } },
          { name: 'Success Stories', href: '/case-studies', media: { iconId: 'trophy' } },
        ],
      },
      {
        itemsTitle: 'Connect',
        items: [
          {
            name: 'Schedule a Call',
            href: '/contact',
            media: { iconId: 'calendar' },
            content: 'Book a 30-min strategy session',
          },
          {
            name: 'Join Newsletter',
            href: '/newsletter',
            media: { iconId: 'email' },
            content: 'Weekly insights on digital growth',
          },
        ],
      },
    ],
    additional: {
      list1: [
        { name: 'Privacy Promise', href: '/privacy' },
        { name: 'Terms of Delight', href: '/terms' },
      ],
      list2: [
        { name: '© 2024 Brand Visionaries. Crafting Digital Excellence.' },
        { name: 'Made with ♥ and Fiction' },
      ],
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    creator: {
      templateId,
      userConfig: {
        title: 'Alex Rivera',
        subTitle: 'Empowering Creators to Build Their Digital Empire',
        menus: [
          {
            itemsTitle: 'Content Library',
            items: [
              { name: 'YouTube Channel', href: 'https://youtube.com/@alexrivera', media: { iconId: 'youtube' } },
              { name: 'Podcast Episodes', href: '/podcast', media: { iconId: 'microphone' } },
              { name: 'Free Resources', href: '/resources', media: { iconId: 'gift' } },
            ],
          },
          {
            itemsTitle: 'Join the Movement',
            items: [
              { name: 'Creator Academy', href: '/academy', media: { iconId: 'school' } },
              { name: 'Community Hub', href: '/community', media: { iconId: 'users' } },
              { name: 'Support My Work', href: '/support', media: { iconId: 'heart' } },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Creator Terms', href: '/terms' },
            { name: 'Content Policy', href: '/content-policy' },
          ],
          list2: [
            { name: '© 2024 Alex Rivera | Creator Economy Advocate' },
            { name: 'Part of the Fiction Creator Network' },
          ],
        },
      },
    },

    saas: {
      templateId,
      userConfig: {
        title: 'FlowSpace',
        subTitle: 'Where Teams Flow Together',
        menus: [
          {
            itemsTitle: 'Product Suite',
            items: [
              { name: 'Features', href: '/features', media: { iconId: 'sparkles' } },
              { name: 'Solutions', href: '/solutions', media: { iconId: 'puzzle' } },
              { name: 'Enterprise', href: '/enterprise', media: { iconId: 'building' } },
              { name: 'Pricing', href: '/pricing', media: { iconId: 'tag' } },
            ],
          },
          {
            itemsTitle: 'Resources',
            items: [
              { name: 'Help Center', href: '/help', media: { iconId: 'help' } },
              { name: 'API Docs', href: '/api', media: { iconId: 'code' } },
              { name: 'System Status', href: '/status', media: { iconId: 'chart' } },
            ],
          },
          {
            itemsTitle: 'Company',
            items: [
              { name: 'About Us', href: '/about', media: { iconId: 'users' } },
              { name: 'Careers', href: '/careers', media: { iconId: 'briefcase' } },
              { name: 'Blog', href: '/blog', media: { iconId: 'newspaper' } },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Privacy & Security', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'GDPR', href: '/gdpr' },
          ],
          list2: [
            { name: '© 2024 FlowSpace, Inc. All rights reserved.' },
            { name: 'SOC 2 Type II Certified' },
          ],
        },
      },
    },
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
  }
}

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'branding',
      label: 'Brand Voice',
      description: 'Shape your brand\'s narrative and voice',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Brand Statement',
          description: 'Make a memorable impact with your brand name or tagline',
          input: 'InputText',
          isRequired: true,
          props: {
            placeholder: 'e.g., "Shape Tomorrow\'s Digital Landscape"',
          },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Value Proposition',
          description: 'Briefly explain your unique value to visitors',
          input: 'InputText',
          props: {
            placeholder: 'e.g., "Empowering Creators Since 2020"',
          },
        }),
      ],
    }),

    new InputOption({
      key: 'menus',
      label: 'Navigation Structure',
      description: 'Design intuitive pathways through your content',
      input: 'InputList',
      props: {
        itemName: 'Menu Group',
        addButtonText: 'Add Navigation Group',
      },
      options: [
        new InputOption({
          key: 'itemsTitle',
          label: 'Section Title',
          description: 'Create clear categories for your links',
          input: 'InputText',
          props: {
            placeholder: 'e.g., "Explore", "Connect", "Resources"',
          },
        }),
        new InputOption({
          key: 'items',
          label: 'Navigation Items',
          description: 'Build your navigation hierarchy',
          input: 'InputList',
          props: {
            itemName: 'Navigation Link',
            addButtonText: 'Add Navigation Item',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
              props: {
                placeholder: 'e.g., "Start Here", "Our Story"',
              },
            }),
            new InputOption({
              key: 'href',
              label: 'Destination',
              description: 'Where should this link take visitors?',
              input: 'InputUrl',
              props: {
                placeholder: 'e.g., /about or https://example.com',
              },
            }),
            new InputOption({
              key: 'media',
              label: 'Visual Cue',
              description: 'Add an icon to enhance recognition',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),

    new InputOption({
      key: 'additional',
      label: 'Legal & Trust',
      description: 'Build trust with clear policies and branding',
      input: 'group',
      options: [
        new InputOption({
          key: 'list1',
          label: 'Legal Links',
          description: 'Essential links for transparency and compliance',
          input: 'InputList',
          props: {
            itemName: 'Legal Link',
            addButtonText: 'Add Legal Link',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
              props: {
                placeholder: 'e.g., "Privacy Policy", "Terms"',
              },
            }),
            new InputOption({
              key: 'href',
              label: 'Legal Document URL',
              input: 'InputUrl',
              props: {
                placeholder: 'e.g., /privacy or /terms',
              },
            }),
          ],
        }),
        new InputOption({
          key: 'list2',
          label: 'Brand Footer',
          description: 'Add your copyright and brand signature',
          input: 'InputList',
          props: {
            itemName: 'Footer Text',
            addButtonText: 'Add Footer Line',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Text Line',
              input: 'InputText',
              props: {
                placeholder: 'e.g., "© 2024 Your Amazing Brand"',
              },
            }),
          ],
        }),
      ],
    }),
  ]
}

export async function getFooterConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
