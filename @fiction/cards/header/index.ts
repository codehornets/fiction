import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'

const schema = z.object({
  logo: z.union([z.string(), z.object({ url: z.string() })]).optional(),
  nav: z.array(z.object({
    name: z.string(),
    href: z.string(),
    target: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputMediaDisplay' }),
  standardOption.navItems({ key: 'nav' }),
]

const el = vue.defineAsyncComponent(async () => import('./ElHeader.vue'))
const templateId = 'header'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['navigation', 'basic'],
    icon: 'i-tabler-box-align-top',
    colorTheme: 'blue',
    description: 'A header with a logo and navigation links',
    isPublic: false,
    el,
    userConfig: {
      logo: { format: 'html', html: 'Your Name' },
      nav: [
        { name: 'Home', href: '/' },
        { name: 'LinkedIn', href: '#', target: '_blank' },
      ],
      spacing: { spacingClass: 'py-0 lg:py-2' },
    },
    schema,
    options,
    demoPage: () => {
      return [
        {
          templateId,
          userConfig: {
            logo: { html: 'Testing', format: 'html' as const },
            nav: [{ name: 'Foo', href: '/bar' }],
            spacing: { spacingClass: 'py-12' },
          },
        },
        {
          templateId,
          userConfig: {
            logo: { url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100' },
            nav: [{ name: 'Lorem Ipsum Lorem Ipsum', href: '/bar' }, { name: 'Long Name', href: '/bar' }, { name: 'Foo', href: '/bar' }, { name: 'Foo', href: '/bar' }],
            spacing: { spacingClass: 'py-12' },
          },
        },
      ]
    },
  }),
] as const
