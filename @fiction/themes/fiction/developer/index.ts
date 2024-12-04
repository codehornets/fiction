import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { vue } from '@fiction/core'

export async function page(args: { site: Site, factory: CardFactory }) {
  const factory = args.factory

  const homeCard = await factory.fromTemplate({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: {
      standard: { spacing: { verticalSpacing: 'none' } },
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'pageWrap',
    slug: 'developer',
    cards: [
      await factory.fromTemplate({ templateId: 'pageArea', cards: [homeCard] }),

    ],
  })
}
