import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { vue } from '@fiction/core/index.js'

export async function page(args: { site: Site, factory: CardFactory }) {
  const { factory } = args

  const homeCard = await factory.create({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: { standard: { spaceSize: 'none' } },
  })

  return factory.create({
    regionId: 'main',
    templateId: 'pageWrap',
    slug: 'affiliate',
    cards: [
      await factory.create({ templateId: 'pageArea', cards: [homeCard] }),
    ],
  })
}
