import type { template as areaTemplate } from '@fiction/cards/area'
import type { template as BentoTemplate } from '@fiction/cards/bento'
import type { template as callToActionTemplate } from '@fiction/cards/callToAction'
import type { template as captureTemplate } from '@fiction/cards/capture'
import type { template as ContactTemplate } from '@fiction/cards/contact'
import type { template as contentModalTemplate } from '@fiction/cards/contentModal'
import type { template as footerXTemplate } from '@fiction/cards/footerX'
import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as MagazineTemplate } from '@fiction/cards/magazine'
import type { template as MapsTemplate } from '@fiction/cards/maps'

import type { template as navTemplate } from '@fiction/cards/nav'
import type { template as ProfileTemplate } from '@fiction/cards/profile'

import type { template as QuotesTemplate } from '@fiction/cards/quotes'
import type { template as textEffectsTemplate } from '@fiction/cards/textEffects'
import type { template as TickerTemplate } from '@fiction/cards/ticker'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { getDemoUserConfig } from '@fiction/cards/magazine/config'

type SectionArgs = {
  factory: CardFactory
  stock: StockMedia
  site: Site
  userConfig: SiteUserConfig
}

export async function getPages(args: SectionArgs) {
  const { factory } = args

  const { defaultMap } = await import('@fiction/cards/maps/config')

  const stock = await factory.getStockMedia()

  return [
    await factory.fromTemplate({
      slug: '_home',
      cards: [
        await factory.fromTemplate<typeof ProfileTemplate>({ templateId: 'profile' }),
        await factory.fromTemplate<typeof BentoTemplate>({ templateId: 'bento' }),
        await factory.fromTemplate<typeof QuotesTemplate>({ templateId: 'quotes' }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'blog',
      cards: [
        await factory.fromTemplate<typeof MagazineTemplate>({
          templateId: 'magazine',
          userConfig: await getDemoUserConfig({ factory, stock }),
        }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate<typeof heroTemplate>({ templateId: 'hero', userConfig: {
          title: 'Contact Us',
          subTitle: `We'll get back to you as soon as possible.`,
          superTitle: { text: 'Get in Touch', icon: { class: 'i-tabler-phone' }, theme: 'orange' },
        } }),
        await factory.fromTemplate<typeof ContactTemplate>({ templateId: 'contact', userConfig: {

        } }),
        await factory.fromTemplate<typeof MapsTemplate>({ templateId: 'maps', userConfig: {
          standard: {
            headers: {
              title: 'Company Location',
              subTitle: 'Visit us at our headquarters',
            },

          },
          maps: [{ ...defaultMap, aspectRatio: 'ultrawide' }],
        } }),
      ],
    }),
  ]
}

export async function getHeader(args: SectionArgs) {
  const { factory, userConfig } = args

  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'header',
    templateId: 'area',
    cards: [
      await factory.fromTemplate<typeof navTemplate>({
        templateId: 'nav',
        userConfig: {
          brand: {
            logo: {
              variant: 'typography',
              typography: {
                label: 'Minimal',
              },
            },
          },
          nav: {
            primary: [
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
            ],
            utility: [
              {
                label: 'Connect',
                list: {
                  items: [
                    { label: '@fictionco', href: 'https://www.x.com/fictionco', icon: { class: 'i-tabler-brand-x' } },
                    { label: 'GitHub', href: 'https://www.github.com/fiction', icon: { class: 'i-tabler-brand-github' } },
                  ],
                },
              },
              {
                label: 'Contact',
                href: '/contact',
                variant: 'button',
                theme: 'primary',
              },
            ],
          },

        },
      }),
    ],
  })
}

export async function getFooter(args: SectionArgs) {
  const { factory } = args
  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'footer',
    templateId: 'area',
    cards: [
      await factory.fromTemplate<typeof TickerTemplate>({
        templateId: 'ticker',
        userConfig: {
          settings: {
            fontSize: 6,
            scrollEffect: true,
            scrollIntensity: 15,
          },
          items: [{
            text: 'Subscribe to the Newsletter',
            href: '?_subscribe',
            speed: 20,
            direction: 'left',

          }],
        },
      }),
      await factory.fromTemplate<typeof callToActionTemplate>({
        templateId: 'callToAction',
        userConfig: {
          standard: { spacing: { verticalSpacing: 'sm' } },
        },
      }),
      await factory.fromTemplate<typeof footerXTemplate>({
        templateId: 'footerX',
        userConfig: {
          brand: {
            logo: { variant: 'typography', typography: { label: 'Minimal' } },
            tagline: 'Minimal Theme by Fiction',
          },
        },
      }),
    ],
  })
}

export async function getHidden(args: SectionArgs) {
  const { factory, userConfig } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate<typeof contentModalTemplate>({ templateId: 'contentModal', userConfig: { } }),
      await factory.fromTemplate<typeof textEffectsTemplate>({ templateId: 'textEffects', userConfig: { } }),
      await factory.fromTemplate<typeof captureTemplate>({ templateId: 'capture', userConfig: { } }),
    ],
  })
}

export async function getConfig(args: Omit<SectionArgs, 'stock'>) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }
  const configs = await Promise.all([
    getPages(a),
    getHeader(a),
    getFooter(a),
    getHidden(a),
  ])

  const [pages, header, footer, hidden] = configs

  return {
    sections: { header, footer, hidden },
    pages,
  }
}
