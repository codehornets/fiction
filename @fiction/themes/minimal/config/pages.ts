import type { template as ContactTemplate } from '@fiction/cards/contact'
import type { template as ProfileTemplate } from '@fiction/cards/profile'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'

export async function getPages(args: { factory: CardFactory, site: Site }) {
  const { factory } = args

  return [
    await factory.create({
      slug: '_home',
      cards: [
        await factory.fromTemplate<typeof ProfileTemplate>({
          templateId: 'profile',
          userConfig: { },
        }),
      ],
    }),
    await factory.create({
      slug: 'contact',
      cards: [
        await factory.fromTemplate<typeof ContactTemplate>({ templateId: 'contact', userConfig: { } }),
      ],
    }),
  ]
}
