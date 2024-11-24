import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { MediaTypographySchema, navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition
export const schema = z.object({
  brand: z.object({
    logo: MediaTypographySchema.optional(),
    tagline: z.string().optional(),
    theme: z.enum(['primary', 'blue', 'green', 'red', 'purple', 'indigo', 'pink', 'yellow', 'default']).optional(),
  }).optional(),

  layout: z.enum([
    'navCenter', // Navigation centered, logo on side
    'logoCenter', // Logo centered, navigation split
    'justified', // Fully justified spacing
  ]).optional(),

  primaryNav: z.array(navListItemSchema).optional(),
  utilityNav: z.array(navListItemSchema).optional(),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'brand',
      label: 'Brand Identity',
      input: 'group',
      options: [
        new InputOption({
          key: 'logo',
          label: 'Logo',
          input: 'InputLogo',
          description: 'Your brand logo or wordmark - supports text or image',
        }),
        new InputOption({
          key: 'tagline',
          label: 'Tagline',
          input: 'InputText',
          description: 'Short brand message or tagline',
        }),
        new InputOption({
          key: 'theme',
          label: 'Brand Theme',
          input: 'InputColorScheme',
          description: 'Primary brand color theme',
        }),
      ],
    }),

    new InputOption({
      key: 'layout',
      label: 'Navigation Layout',
      input: 'InputRadio',
      props: {
        options: [
          { label: 'Centered Nav', value: 'navCenter', description: 'Navigation centered with logo on side' },
          { label: 'Centered Logo', value: 'logoCenter', description: 'Logo centered with split navigation' },
          { label: 'Justified', value: 'justified', description: 'Fully justified spacing' },
        ],
      },
    }),

    new InputOption({
      key: 'primaryNav',
      label: 'Main Navigation',
      input: 'InputList',
      props: { itemLabel: 'Navigation Item' },
      options: [
        new InputOption({
          key: 'label',
          label: 'Label',
          input: 'InputText',
          isRequired: true,
        }),
        new InputOption({
          key: 'href',
          label: 'Link',
          input: 'InputUrl',
        }),
        new InputOption({
          key: 'description',
          label: 'Description',
          input: 'InputText',
          description: 'Shown in expanded menus',
        }),
        new InputOption({
          key: 'icon',
          label: 'Icon',
          input: 'InputIcon',
        }),
        new InputOption({
          key: 'variant',
          label: 'Style Variant',
          input: 'InputSelect',
          list: ['default', 'button', 'avatar'],
        }),
        new InputOption({
          key: 'emphasis',
          label: 'Emphasis',
          input: 'InputSelect',
          list: ['default', 'highlighted', 'muted'],
        }),
        new InputOption({
          key: 'theme',
          label: 'Color Theme',
          input: 'InputColorScheme',
        }),
        new InputOption({
          key: 'list',
          label: 'Dropdown Menu',
          input: 'InputControl',
          options: [
            new InputOption({
              key: 'variant',
              label: 'Menu Style',
              input: 'InputSelect',
              list: ['default', 'expanded'],
            }),
            new InputOption({
              key: 'title',
              label: 'Menu Title',
              input: 'InputText',
            }),
            new InputOption({
              key: 'items',
              label: 'Menu Items',
              input: 'InputList',
              props: { itemLabel: 'Menu Item' },
              options: [
                new InputOption({
                  key: 'label',
                  label: 'Label',
                  input: 'InputText',
                }),
                new InputOption({
                  key: 'description',
                  label: 'Description',
                  input: 'InputText',
                }),
                new InputOption({
                  key: 'href',
                  label: 'Link',
                  input: 'InputUrl',
                }),
                new InputOption({
                  key: 'icon',
                  label: 'Icon',
                  input: 'InputIcon',
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    new InputOption({
      key: 'utilityNav',
      label: 'Utility Navigation',
      input: 'InputList',
      props: { itemLabel: 'Utility Item' },
      options: [
        new InputOption({
          key: 'label',
          label: 'Label',
          input: 'InputText',
        }),
        new InputOption({
          key: 'href',
          label: 'Link',
          input: 'InputUrl',
        }),
        new InputOption({
          key: 'icon',
          label: 'Icon',
          input: 'InputIcon',
        }),
        new InputOption({
          key: 'variant',
          label: 'Style',
          input: 'InputSelect',
          list: ['default', 'button', 'avatar'],
        }),
        new InputOption({
          key: 'onAuthState',
          label: 'Show When',
          input: 'InputSelect',
          list: ['loggedIn', 'loggedOut', 'all'],
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      logo: { typography: { text: 'Atlas', scale: 1.2, weight: '600' } },
      tagline: 'Build Better Websites',
      theme: 'indigo',
    },
    layout: 'navCenter',
    primaryNav: [
      {
        label: 'Solutions',
        href: '/solutions',
        list: {
          items: [
            {
              label: 'For Agencies',
              href: '/solutions/agencies',
              icon: { iconId: 'briefcase' },
            },
            {
              label: 'For Startups',
              href: '/solutions/startups',
              icon: { iconId: 'rocket' },
            },
          ],
        },
      },
      {
        label: 'Get Started',
        href: '/start',
        variant: 'button',
        theme: 'primary',
        design: 'solid',
        emphasis: 'highlighted',
      },
    ],
    utilityNav: [
      {
        label: 'Sign In',
        href: '/signin',
        icon: { iconId: 'user' },
        variant: 'button',
        design: 'outline',
        onAuthState: 'loggedOut',
      },
    ],
  }
}

async function getDemoCards(args: { templateId: string, stock: StockMedia }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId, stock } = args

  const loremSubNav = {
    items: [
      { label: 'Lorem', href: '#' },
      { label: 'Ipsum', href: '#' },
      { label: 'Dolor', href: '#' },
      { label: 'Sit', href: '#' },
    ],
  }

  return [
    // Default demo showing standard navigation
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Centered Nav' }, spacing: { verticalSpacing: 'md' } },
        ...getDefaultConfig(),
      },
    },

    // Agency demo with centered logo and split navigation
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Centered Logo' }, spacing: { verticalSpacing: 'md' } },
        brand: {
          logo: stock.getLocalMedia({ key: 'lorem2' }),
          tagline: 'Creative Digital Agency',
          theme: 'purple',
        },
        layout: 'logoCenter',
        primaryNav: [
          {
            label: 'Services',
            href: '/services',
            list: {
              variant: 'expanded',
              title: 'Our Services',
              description: 'End-to-end digital solutions for your brand',
              items: [
                {
                  label: 'Brand Strategy',
                  description: 'Position your brand for success',
                  href: '/services/strategy',
                  icon: { iconId: 'target' },
                },
                {
                  label: 'Web Design',
                  description: 'Beautiful, functional websites',
                  href: '/services/design',
                  icon: { iconId: 'palette' },
                },
                {
                  label: 'Development',
                  description: 'Custom web applications',
                  href: '/services/development',
                  icon: { iconId: 'code' },
                },
              ],
            },
          },
          {
            label: 'Work',
            href: '/work',
            list: {
              items: [
                { label: 'Case Studies', href: '/work/cases' },
                { label: 'Portfolio', href: '/work/portfolio' },
              ],
            },
          },
          {
            label: 'About',
            href: '/about',
          },
        ],
        utilityNav: [
          {
            label: 'Contact',
            href: '/contact',
            variant: 'button',
            theme: 'primary',
            design: 'solid',
          },
        ],
      },
    },

    // SaaS product with justified layout and feature-rich mega menu
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Left Aligned Nav' }, spacing: { verticalSpacing: 'md' } },
        brand: {
          logo: stock.getLocalMedia({ key: 'lorem3' }),
          theme: 'blue',
        },
        layout: 'justified',
        primaryNav: [
          {
            label: 'Product',
            href: '/product',
            list: {
              variant: 'expanded',
              title: 'Our Platform',
              description: 'Discover how we can help you grow',
              items: [
                {
                  label: 'Analytics',
                  description: 'Measure what matters',
                  href: '/product/analytics',
                  icon: { iconId: 'chart-bar' },
                },
                {
                  label: 'Automation',
                  description: 'Save time with smart workflows',
                  href: '/product/automation',
                  icon: { iconId: 'robot' },
                },
                {
                  label: 'Integrations',
                  description: 'Connect your favorite tools',
                  href: '/product/integrations',
                  icon: { iconId: 'puzzle' },
                },
              ],
            },
          },
          {
            label: 'Solutions',
            href: '/solutions',
            list: {
              variant: 'expanded',
              items: [
                {
                  label: 'By Industry',
                  href: '#',
                  list: {
                    items: [
                      { label: 'E-commerce', href: '/solutions/ecommerce' },
                      { label: 'Healthcare', href: '/solutions/healthcare' },
                      { label: 'Finance', href: '/solutions/finance' },
                    ],
                  },
                },
                {
                  label: 'By Role',
                  href: '#',
                  list: {
                    items: [
                      { label: 'Marketers', href: '/solutions/marketing' },
                      { label: 'Developers', href: '/solutions/developers' },
                      { label: 'Designers', href: '/solutions/designers' },
                    ],
                  },
                },
              ],
            },
          },
          {
            label: 'Resources',
            href: '/resources',
            list: {
              items: [
                { label: 'Blog', href: '/blog', icon: { iconId: 'article' } },
                { label: 'Documentation', href: '/docs', icon: { iconId: 'book' } },
                { label: 'Community', href: '/community', icon: { iconId: 'users' } },
              ],
            },
          },
          {
            label: 'Enterprise',
            href: '/enterprise',
            emphasis: 'highlighted',
            theme: 'orange',
          },
        ],
        utilityNav: [
          {
            label: 'Try Free',
            href: '/trial',
            variant: 'button',
            theme: 'primary',
            onAuthState: 'loggedOut',
          },
          {
            label: 'Sign In',
            href: '/signin',
            variant: 'button',
            theme: 'default',
            onAuthState: 'loggedOut',
          },
          {
            label: 'Account',
            href: '/account',
            variant: 'avatar',
            onAuthState: 'loggedIn',
          },
        ],
      },
    },
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Modern Platform Navigation' }, spacing: { verticalSpacing: 'md' } },
        brand: {
          logo: { html: 'Atlas', typography: { scale: 1.4, weight: '700' } },
          tagline: 'Elevate Your Digital Experience',
          theme: 'indigo',
        },
        layout: 'navCenter',
        primaryNav: [
          {
            label: 'Platform',
            href: '/platform',
            list: {
              variant: 'expanded',
              title: 'Transform Your Workflow',
              description: 'Discover powerful tools that spark innovation and drive growth',
              items: [
                {
                  label: 'Visual Builder',
                  description: 'Craft stunning interfaces intuitively',
                  href: '/platform/builder',
                  icon: { iconId: 'wand' },
                  emphasis: 'highlighted',
                },
                {
                  label: 'AI Assistant',
                  description: 'Enhance productivity with smart automation',
                  href: '/platform/ai',
                  icon: { iconId: 'robot' },
                  emphasis: 'highlighted',
                  variant: 'button',
                  theme: 'purple',
                },
                {
                  label: 'Analytics',
                  description: 'Gain deep insights into performance',
                  href: '/platform/analytics',
                  icon: { iconId: 'chart-dots' },
                },
              ],
            },
          },
          {
            label: 'Solutions',
            href: '/solutions',
            list: {
              variant: 'expanded',
              title: 'Unlock Your Potential',
              description: 'Tailored solutions that drive remarkable results',
              items: [
                {
                  label: 'Enterprise',
                  description: 'Scale with confidence',
                  href: '/solutions/enterprise',
                  icon: { iconId: 'building-skyscraper' },
                  variant: 'button',
                  theme: 'blue',
                },
                {
                  label: 'Startups',
                  description: 'Move fast and innovate',
                  href: '/solutions/startups',
                  icon: { iconId: 'rocket' },
                  variant: 'button',
                  theme: 'green',
                },
                {
                  label: 'Agencies',
                  description: 'Empower your client success',
                  href: '/solutions/agencies',
                  icon: { iconId: 'bulb' },
                  variant: 'button',
                  theme: 'yellow',
                },
              ],
            },
          },
          {
            label: 'Resources',
            href: '/resources',
            emphasis: 'muted',
            list: {
              items: [
                {
                  label: 'Success Stories',
                  href: '/resources/stories',
                  icon: { iconId: 'star' },
                  emphasis: 'highlighted',
                },
                {
                  label: 'Learning Hub',
                  href: '/resources/learn',
                  icon: { iconId: 'book' },
                },
                {
                  label: 'Developer Docs',
                  href: '/resources/docs',
                  icon: { iconId: 'code' },
                },
              ],
            },
          },
          {
            label: 'Pricing',
            href: '/pricing',
            emphasis: 'muted',
          },
          {
            label: 'Start Free',
            href: '/start',
            variant: 'button',
            theme: 'green',
            emphasis: 'highlighted',
            icon: { iconId: 'sparkles' },
          },
        ],
        utilityNav: [
          {
            label: 'Book Demo',
            href: '/demo',
            variant: 'button',
            theme: 'green',
            design: 'outline',
            onAuthState: 'loggedOut',
          },
        ],
      },
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
      cards: await getDemoCards({ templateId, stock }),
    },
  }
}
