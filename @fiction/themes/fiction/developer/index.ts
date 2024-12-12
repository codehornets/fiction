import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { vue } from '@fiction/core'

export async function page(args: { site: Site, factory: CardFactory }) {
  const factory = args.factory

  const homeCard = await factory.fromTemplate({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: {
      standard: { spaceSize: 'none' },
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'developer',
    cards: [
      await factory.fromTemplate({ templateId: 'cardPageAreaV1', cards: [homeCard] }),

    ],
  })
}
