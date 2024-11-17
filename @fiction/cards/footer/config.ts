import { MediaBasicSchema, MediaIconSchema, MediaTypographySchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets'

// Navigation item schema with clear type hierarchy
const navItemSchema = z.object({
  name: z.string().optional(),
  href: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    items: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
    })).optional(),
  })).optional(),
  desc: z.string().optional(),
  target: z.string().optional(),
})

const layoutTypes = ['columns', 'centered'] as const

// Main schema
const schema = z.object({
  logo: MediaTypographySchema.optional(),
  tagline: z.string().optional(),
  starline: z.string().optional(),
  layout: z.enum(layoutTypes).optional(),
  nav: z.array(navItemSchema).optional(),
  legal: z.object({
    privacyPolicyUrl: z.string().optional(),
    termsOfServiceUrl: z.string().optional(),
    copyrightText: z.string().optional(),
  }).optional(),
  socials: z.array(z.object({
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    media: MediaIconSchema.optional(),
  })).optional(),
  badges: z.array(z.object({
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    media: MediaBasicSchema.optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

// Default configuration
const defaultConfig: UserConfig = {
  logo: {
    format: 'typography',
    typography: {
      text: 'Your Brand Name',
      font: 'Poppins',
    },
  },
  nav: [
    {
      name: 'Products & Services',
      items: [
        { href: '/products', name: 'Our Products' },
        { href: '/services', name: 'Services' },
      ],
    },
    {
      name: 'Company',
      items: [
        { href: '/about', name: 'About Us' },
        { href: '/contact', name: 'Contact' },
      ],
    },
    {
      name: 'Resources',
      items: [
        { href: '/blog', name: 'Blog' },
        { href: '/support', name: 'Support' },
      ],
    },
  ],
  legal: {
    copyrightText: '© 2024 Your Company Name. All rights reserved.',
  },
  socials: [
    {
      href: 'https://www.linkedin.com/',
      target: '_blank',
      name: 'LinkedIn',
      media: { iconId: 'linkedin' },
    },
    {
      href: 'https://github.com/',
      target: '_blank',
      name: 'Github',
      media: { iconId: 'github' },
    },
    {
      href: 'https://twitter.com/',
      target: '_blank',
      name: 'X (Twitter)',
      media: { iconId: 'x' },
    },
  ],
  badges: [],
}

// Input options organized by section with clear descriptions
function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'logo',
      label: 'Brand Logo',
      input: 'InputLogo',
    }),
    new InputOption({
      key: 'layout',
      label: 'Footer Layout',
      input: 'InputSelect',
      list: layoutTypes,
      description: 'Choose between a multi-column or centered layout',
    }),
    new InputOption({
      key: 'tagline',
      label: 'Brand Tagline',
      input: 'InputText',
      description: 'A brief description of your brand or mission statement',
    }),
    standardOption.navItems({
      key: 'nav',
      maxDepth: 2,
      itemNames: ['Section', 'Primary Link', 'Secondary Link'],
    }),
    new InputOption({
      key: 'legal',
      label: 'Legal Information',
      input: 'group',
      options: [
        new InputOption({
          key: 'legal.privacyPolicyUrl',
          label: 'Privacy Policy Link',
          input: 'InputText',
          description: 'URL to your privacy policy',
        }),
        new InputOption({
          key: 'legal.termsOfServiceUrl',
          label: 'Terms of Service Link',
          input: 'InputText',
          description: 'URL to your terms of service',
        }),
        new InputOption({
          key: 'legal.copyrightText',
          label: 'Copyright Notice',
          input: 'InputText',
          description: 'Your copyright statement',
        }),
      ],
    }),
    new InputOption({
      key: 'socials',
      label: 'Social Media Links',
      input: 'InputList',
      props: { itemName: 'Social Profile' },
      description: 'Add links to your social media profiles',
      options: [
        new InputOption({ key: 'name', label: 'Platform Name', input: 'InputText' }),
        new InputOption({ key: 'href', label: 'Profile URL', input: 'InputText' }),
        new InputOption({ key: 'media', label: 'Platform Icon', input: 'InputIcon' }),
        new InputOption({
          key: 'target',
          label: 'Link Behavior',
          input: 'InputSelect',
          list: ['_blank', '_self'],
          description: '_blank opens in new tab, _self opens in same tab',
        }),
      ],
    }),
    new InputOption({
      key: 'badges',
      label: 'Trust Indicators',
      input: 'group',
      options: [
        new InputOption({
          key: 'starline',
          label: 'Rating Display',
          input: 'InputText',
          description: 'Display customer satisfaction or review information',
        }),
        new InputOption({
          key: 'badges',
          label: 'Trust Badges',
          description: 'Add certifications, awards, or other trust indicators',
          input: 'InputList',
          props: { itemName: 'Badge' },
          options: [
            new InputOption({ key: 'name', label: 'Badge Name', input: 'InputText' }),
            new InputOption({ key: 'href', label: 'Verification URL', input: 'InputText' }),
            new InputOption({ key: 'media', label: 'Badge Image', input: 'InputMedia' }),
            new InputOption({
              key: 'target',
              label: 'Link Behavior',
              input: 'InputSelect',
              list: ['_blank', '_self'],
              description: '_blank opens in new tab, _self opens in same tab',
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
    userConfig: defaultConfig,
    demoPage: {
      cards: [
        { templateId, userConfig: { ...defaultConfig, layout: 'columns' as const } },
        { templateId, userConfig: { ...defaultConfig, layout: 'centered' as const } },
      ],
    },
  }
}
