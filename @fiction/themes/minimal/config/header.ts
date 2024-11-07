import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'

export async function getHeader(args: { factory: CardFactory, site: Site }) {
  const { factory } = args

  return await factory.create({
    regionId: 'header',
    templateId: 'area',
    cards: [
      await factory.create({ templateId: 'nav', userConfig: {
        logo: { html: `Your Name`, format: 'html' },
        navA: [],
        navB: [
          { name: 'Contact', href: '/contact', itemStyle: 'buttonStandard' },
        ],
      } }),
    ],
  })
}
