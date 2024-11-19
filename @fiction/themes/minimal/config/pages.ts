import type { template as BentoTemplate } from '@fiction/cards/bento'
import type { template as ContactTemplate } from '@fiction/cards/contact'
import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as MagazineTemplate } from '@fiction/cards/magazine'
import type { template as MapsTemplate } from '@fiction/cards/maps'
import type { template as ProfileTemplate } from '@fiction/cards/profile'
import type { template as QuotesTemplate } from '@fiction/cards/quote'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { getDemoUserConfig } from '@fiction/cards/magazine/config'

export async function getPages(args: { factory: CardFactory, site: Site, userConfig: SiteUserConfig }) {
  const { factory } = args

  const { defaultMap } = await import('@fiction/cards/maps/config')

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
          userConfig: await getDemoUserConfig({ factory }),
        }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate<typeof heroTemplate>({ templateId: 'hero', userConfig: {
          heading: 'Contact Us',
          subHeading: `We'll get back to you as soon as possible.`,
          superHeading: 'Get in touch',
          superColor: 'orange',
          superIcon: { class: 'i-tabler-phone' },
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
