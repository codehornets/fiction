import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { vue } from '@fiction/core'

export async function page(args: { site: Site, factory: CardFactory }) {
  const factory = args.factory

  const homeCard = await factory.create({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: {
      standard: { spacing: { verticalSpacing: 'none' } },
    },
  })

  return factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'developer',
    cards: [
      await factory.create({ templateId: 'area', cards: [homeCard] }),

    ],
  })
}
