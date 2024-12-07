import type { template as BentoTemplate } from '@fiction/cards/content-bento'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as ProfileTemplate } from '@fiction/cards/content-profile'
import type { template as captureTemplate } from '@fiction/cards/convert-capture'
import type { template as ContactTemplate } from '@fiction/cards/convert-contact'
import type { template as callToActionTemplate } from '@fiction/cards/convert-cta'
import type { template as textEffectsTemplate } from '@fiction/cards/effect-text'
import type { template as MapsTemplate } from '@fiction/cards/location-maps'
import type { template as contentModalTemplate } from '@fiction/cards/modal-media'
import type { template as areaTemplate } from '@fiction/cards/page-area'

import type { template as footerXTemplate } from '@fiction/cards/page-footer-personal'
import type { template as navTemplate } from '@fiction/cards/page-nav'

import type { template as MagazineTemplate } from '@fiction/cards/posts-magazine'
import type { template as QuotesTemplate } from '@fiction/cards/proof-quotes'
import type { template as TickerTemplate } from '@fiction/cards/typography-ticker'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { getDemoUserConfig } from '@fiction/cards/posts-magazine/config'

type SectionArgs = {
  factory: CardFactory
  stock: StockMedia
  site: Site
  userConfig: SiteUserConfig
}

export async function getPages(args: SectionArgs) {
  const { factory } = args

  const { defaultMap } = await import('@fiction/cards/location-maps/config')

  const stock = await factory.getStockMedia()

  return [
    await factory.fromTemplate({
      slug: '_home',
      cards: [
        await factory.fromTemplate<typeof ProfileTemplate>({ templateId: 'contentProfile' }),
        await factory.fromTemplate<typeof BentoTemplate>({ templateId: 'contentBento' }),
        await factory.fromTemplate<typeof QuotesTemplate>({ templateId: 'proofQuotes' }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'blog',
      cards: [
        await factory.fromTemplate<typeof MagazineTemplate>({
          templateId: 'postsMagazine',
          userConfig: await getDemoUserConfig({ factory, stock }),
        }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate<typeof heroTemplate>({ templateId: 'contentHero', userConfig: {
          title: 'Contact Us',
          subTitle: `We'll get back to you as soon as possible.`,
          superTitle: { text: 'Get in Touch', icon: { class: 'i-tabler-phone' }, theme: 'orange' },
        } }),
        await factory.fromTemplate<typeof ContactTemplate>({ templateId: 'convertContact', userConfig: {

        } }),
        await factory.fromTemplate<typeof MapsTemplate>({ templateId: 'locationMaps', userConfig: {
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
  const { factory } = args

  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'header',
    templateId: 'pageArea',
    cards: [
      await factory.fromTemplate<typeof navTemplate>({
        templateId: 'pageNav',
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
    templateId: 'pageArea',
    cards: [
      await factory.fromTemplate<typeof TickerTemplate>({
        templateId: 'typographyTicker',
        userConfig: {
          fontSize: 6,
          scrollEffect: true,
          scrollIntensity: 15,
          items: [{
            text: 'Subscribe to the Newsletter',
            href: '?_subscribe',
            speed: 20,
            direction: 'left',

          }],
        },
      }),
      await factory.fromTemplate<typeof callToActionTemplate>({
        templateId: 'convertCta',
        userConfig: {
          standard: { spacing: { verticalSpacing: 'sm' } },
        },
      }),
      await factory.fromTemplate<typeof footerXTemplate>({
        templateId: 'pageFooterPersonal',
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
  const { factory } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate<typeof contentModalTemplate>({ templateId: 'modalMedia', userConfig: { } }),
      await factory.fromTemplate<typeof textEffectsTemplate>({ templateId: 'effectText', userConfig: { } }),
      await factory.fromTemplate<typeof captureTemplate>({ templateId: 'convertCapture', userConfig: { } }),
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
