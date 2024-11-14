import type { template as ContactTemplate } from '@fiction/cards/contact'
import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as ProfileTemplate } from '@fiction/cards/profile'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'

export async function getPages(args: { factory: CardFactory, site: Site, userConfig: SiteUserConfig }) {
  const { factory } = args

  return [
    await factory.fromTemplate({
      slug: '_home',
      cards: [
        await factory.fromTemplate<typeof ProfileTemplate>({ templateId: 'profile' }),
      ],
    }),
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate<typeof heroTemplate>({ templateId: 'hero', userConfig: {
          heading: 'Contact Us',
          subHeading: `We'll get back to you as soon as possible.`,
        } }),
        await factory.fromTemplate<typeof ContactTemplate>({ templateId: 'contact' }),
      ],
    }),
  ]
}
