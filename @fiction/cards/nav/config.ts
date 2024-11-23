import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { colorThemeUser, MediaTypographySchema, navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Clear schema definition with optional fields for flexibility
export const schema = z.object({
  // Brand identity elements
  brand: z.object({
    logo: MediaTypographySchema.optional(),
    tagline: z.string().optional(),
    theme: z.enum(colorThemeUser).optional(),
  }).optional(),

  // Layout configuration
  layout: z.enum([
    'navCenter', // Navigation centered, logo on side
    'logoCenter', // Logo centered, navigation split
    'justified', // Fully justified spacing
  ]).optional(),

  // Primary navigation groups
  primaryNav: z.array(navListItemSchema).optional(),

  // Secondary/utility navigation
  utilityNav: z.array(navListItemSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getOptions(): InputOption[] {
  return [
    // Brand Options
    new InputOption({
      key: 'brand',
      label: 'Brand Identity',
      input: 'group',
      options: [
        new InputOption({
          key: 'logo',
          label: 'Logo',
          input: 'InputLogo',
          description: 'Your brand logo or wordmark',
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

    // Layout Options
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

    // Primary Navigation
    new InputOption({
      key: 'primaryNav',
      label: 'Main Navigation',
      input: 'InputList',
      props: { itemLabel: 'Navigation Item' },
      options: [
        new InputOption({
          key: 'name',
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
        }),
        new InputOption({
          key: 'icon',
          label: 'Icon',
          input: 'InputIcon',
        }),
        new InputOption({
          key: 'style',
          label: 'Style',
          input: 'InputSelect',
          list: ['link', 'button', 'featured'],
        }),
        new InputOption({
          key: 'theme',
          label: 'Color Theme',
          input: 'InputColorScheme',
        }),
        new InputOption({
          key: 'megaMenu',
          label: 'Mega Menu',
          input: 'InputControl',
          options: [
            new InputOption({
              key: 'layout',
              label: 'Layout Style',
              input: 'InputSelect',
              list: ['grid', 'list', 'featured'],
            }),
            new InputOption({
              key: 'items',
              label: 'Menu Items',
              input: 'InputList',
              props: { itemLabel: 'Menu Item' },
              options: [
                new InputOption({
                  key: 'name',
                  label: 'Name',
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

    // Utility Navigation
    new InputOption({
      key: 'utilityNav',
      label: 'Utility Navigation',
      input: 'InputList',
      props: { itemLabel: 'Utility Item' },
      options: [
        new InputOption({
          key: 'name',
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
          key: 'style',
          label: 'Style',
          input: 'InputSelect',
          list: ['link', 'button', 'user'],
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      logo: { html: 'StoryBrand', typography: { scale: 1.2, weight: '600' } },
      tagline: 'Craft Your Story',
      theme: 'indigo',
    },
    layout: 'navCenter',
    primaryNav: [
      {
        label: 'Platform',
        description: 'Our comprehensive brand storytelling platform',
        href: '/platform',
        icon: { iconId: 'sparkles' },
        list: {

          title: 'Discover Our Platform',
          description: 'Everything you need to build and grow your brand',
          items: [
            {
              label: 'Brand Strategy',
              description: 'Define your unique brand position',
              href: '/platform/strategy',
              icon: { iconId: 'target' },
            },
            {
              label: 'Visual Identity',
              description: 'Create cohesive brand visuals',
              href: '/platform/identity',
              icon: { iconId: 'palette' },
            },
            {
              label: 'Content Studio',
              description: 'Produce engaging brand content',
              href: '/platform/content',
              icon: { iconId: 'edit' },
            },
          ],
        },
      },
      {
        label: 'Resources',
        href: '/resources',
        icon: { iconId: 'book' },
        list: {
          items: [
            {
              label: 'Brand Academy',
              description: 'Learn brand building fundamentals',
              href: '/resources/academy',
              icon: { iconId: 'graduation-cap' },
            },
            {
              label: 'Case Studies',
              description: 'See successful brands in action',
              href: '/resources/cases',
              icon: { iconId: 'presentation' },
            },
          ],
        },
      },
      {
        label: 'Get Started',
        href: '/start',
        variant: 'button',
        theme: 'primary',
        emphasis: 'highlighted',
      },
    ],
    utilityNav: [
      {
        label: 'Sign In',
        href: '/signin',
        icon: { iconId: 'user' },
        variant: 'button',
        onAuthState: 'loggedOut',
      },
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: { iconId: 'dashboard' },
        variant: 'avatar',
        onAuthState: 'loggedIn',
      },
    ],
  }
}

async function getDemoCards(args: { templateId: string, stock: StockMedia }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId, stock } = args
  return [
    {
      templateId,
      userConfig: getDefaultConfig(),
    },
    {
      templateId,
      userConfig: {
        brand: {
          logo: stock.getLocalMedia({ key: 'lorem1' }),
          tagline: 'Design with Purpose',
          theme: 'purple',
        },
        layout: 'logoCenter',
        primaryNav: [
          {
            label: 'Services',
            href: '/services',
            list: {
              items: [
                { label: 'Brand Strategy', href: '/services/strategy' },
                { label: 'Visual Design', href: '/services/design' },
                { label: 'Development', href: '/services/development' },
              ],
            },
          },
          {
            label: 'Portfolio',
            href: '/work',
            emphasis: 'highlighted',
          },
          {
            label: 'Contact',
            href: '/contact',
            variant: 'button',
            theme: 'primary',
          },
        ],
        utilityNav: [
          {
            label: 'Client Login',
            href: '/client-portal',
            icon: { iconId: 'user' },
            variant: 'button',
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
