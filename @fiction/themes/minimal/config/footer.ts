import type { template as areaTemplate } from '@fiction/cards/area'
import type { template as footerOmegaTemplate } from '@fiction/cards/footerOmega'
import type { template as TickerTemplate } from '@fiction/cards/ticker'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'

export async function getFooter(args: { factory: CardFactory, site: Site, userConfig: SiteUserConfig }) {
  const { factory, userConfig } = args
  const font = userConfig.styling?.fonts?.title.fontKey || 'Poppins'
  const weight = userConfig.styling?.fonts?.title.weight || '600'
  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'footer',
    templateId: 'area',
    cards: [
      await factory.fromTemplate<typeof TickerTemplate>({ templateId: 'ticker', userConfig: {
        items: [
          {
            text: 'Get the newsletter &rarr;',
            speed: 3,
            href: '?_subscribe',
          },
        ],
      } }),
      await factory.fromTemplate<typeof footerOmegaTemplate>({ templateId: 'footerOmega', userConfig: { } }),
    ],
  })
}
