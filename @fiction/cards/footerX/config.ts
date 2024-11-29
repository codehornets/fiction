import { navListItemSchema, navListSchema } from '@fiction/core/schemas/schemas'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  menus: z.array(navListSchema).optional(),
  additional: z.object({
    list1: z.array(navListItemSchema).optional(),
    list2: z.array(navListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getDefaultConfig(): UserConfig {
  return {
    title: 'Your Brand',
    subTitle: 'An inspiring tagline goes here',
    menus: [
      {
        title: 'Discover',
        items: [
          { label: 'Our Vision', href: '/about', icon: { iconId: 'eye' } },
          { label: 'Services', href: '/services', icon: { iconId: 'star' } },
          { label: 'Success Stories', href: '/case-studies', icon: { iconId: 'trophy' } },
        ],
      },
      {
        title: 'Connect',
        items: [
          {
            label: 'Schedule a Call',
            href: '/contact',
            icon: { iconId: 'calendar' },
            description: 'Book a 30-min strategy session',
          },
          {
            label: 'Join Newsletter',
            href: '/newsletter',
            icon: { iconId: 'mail' },
            description: 'Weekly insights on digital growth',
          },
        ],
      },
    ],
    additional: {
      list1: [
        { label: 'Privacy Promise', href: '/privacy' },
        { label: 'Terms of Delight', href: '/terms' },
      ],
      list2: [
        { label: '© 2024 Brand Visionaries. Crafting Digital Excellence.' },
        { label: 'Made with ♥ and Fiction' },
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
            title: 'Content Library',
            items: [
              { label: 'YouTube Channel', href: 'https://youtube.com/@alexrivera', icon: { iconId: 'youtube' } },
              { label: 'Podcast Episodes', href: '/podcast', icon: { iconId: 'microphone' } },
              { label: 'Free Resources', href: '/resources', icon: { iconId: 'gift' } },
            ],
          },
          {
            title: 'Join the Movement',
            items: [
              { label: 'Creator Academy', href: '/academy', icon: { iconId: 'school' } },
              { label: 'Community Hub', href: '/community', icon: { iconId: 'users' } },
              { label: 'Support My Work', href: '/support', icon: { iconId: 'heart' } },
            ],
          },
        ],
        additional: {
          list1: [
            { label: 'Creator Terms', href: '/terms' },
            { label: 'Content Policy', href: '/content-policy' },
          ],
          list2: [
            { label: '© 2024 Alex Rivera | Creator Economy Advocate' },
            { label: 'Part of the Fiction Creator Network' },
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
            title: 'Product Suite',
            items: [
              { label: 'Features', href: '/features', icon: { class: 'i-tabler-sparkles' } },
              { label: 'Solutions', href: '/solutions', icon: { iconId: 'puzzle' } },
              { label: 'Enterprise', href: '/enterprise', icon: { class: 'i-tabler-building' } },
              { label: 'Pricing', href: '/pricing', icon: { iconId: 'tag' } },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Help Center', href: '/help', icon: { iconId: 'help' } },
              { label: 'API Docs', href: '/api', icon: { iconId: 'code' } },
              { label: 'System Status', href: '/status', icon: { iconId: 'chart' } },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About Us', href: '/about', icon: { iconId: 'users' } },
              { label: 'Careers', href: '/careers', icon: { iconId: 'briefcase' } },
              { label: 'Blog', href: '/blog', icon: { iconId: 'newspaper' } },
            ],
          },
        ],
        additional: {
          list1: [
            { label: 'Privacy & Security', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'GDPR', href: '/gdpr' },
          ],
          list2: [
            { label: '© 2024 FlowSpace, Inc. All rights reserved.' },
            { label: 'SOC 2 Type II Certified' },
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
      key: 'personalBrand',
      label: 'Brand Voice',
      description: 'Shape your brand\'s narrative and voice',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Title',
          description: 'Enter your brand name or tagline',
          input: 'InputText',
          isRequired: true,
          props: {
            placeholder: 'e.g., "Shape Tomorrow\'s Digital Landscape"',
          },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Tagline',
          description: 'Add a memorable phrase or mission statement',
          input: 'InputText',
          props: {
            placeholder: '',
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
