import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'

export async function getFooter(args: { factory: CardFactory, site: Site }) {
  const { factory } = args

  return await factory.create({
    regionId: 'footer',
    templateId: 'area',
    cards: [
      await factory.create({ templateId: 'footer', userConfig: {
        logo: { format: 'typography', typography: { text: 'Your Name', font: 'Poppins' } },
        nav: [
          { name: 'About', href: '/' },
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
