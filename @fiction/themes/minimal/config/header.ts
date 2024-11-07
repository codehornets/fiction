import type { template as areaTemplate } from '@fiction/cards/area'
import type { template as navTemplate } from '@fiction/cards/nav'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'

export async function getHeader(args: { factory: CardFactory, site: Site, userConfig: SiteUserConfig }) {
  const { factory, userConfig } = args

  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'header',
    templateId: 'area',
    cards: [
      await factory.fromTemplate<typeof navTemplate>({ templateId: 'nav', userConfig: {
        logo: {

          format: 'typography',
          typography: {
            font: userConfig.styling?.fonts?.title.fontKey || 'Poppins',
            text: 'Minimal',
            weight: userConfig.styling?.fonts?.title.weight || '600',
          },
        },
        navA: [],
        navB: [
          {
            name: 'Contact',
            href: '/contact',
            itemStyle: 'buttonStandard',
          },
        ],
      } }),
    ],
  })
}
