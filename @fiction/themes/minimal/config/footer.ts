import type { template as areaTemplate } from '@fiction/cards/area'
import type { template as footerTemplate } from '@fiction/cards/footer'
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
      await factory.fromTemplate<typeof footerTemplate>({ templateId: 'footer', userConfig: {
        logo: {
          format: 'typography',
          typography: {
            text: 'Minimal',
            font,
            weight,
          },
        },
        nav: [
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ],
        legal: {
          copyrightText: `Your Company or Name, Inc.`,
        },
        socials: [
          {
            href: 'https://www.linkedin.com/company/fictionco',
            target: '_blank',
            name: 'LinkedIn',
            media: { iconId: `linkedin` },
          },
          {
            href: 'https://www.twitter.com/fictionco',
            target: '_blank',
            name: 'X',
            media: { iconId: 'x' },
          },
        ],

      } }),
    ],
  })
}
