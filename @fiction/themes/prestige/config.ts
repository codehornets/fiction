import type { template as featuresTemplate } from '@fiction/cards/content-features/index'
import type { template as heroTemplate } from '@fiction/cards/content-hero/index'
import type { template as GalleryShowcaseTemplate } from '@fiction/cards/gallery-showcase/index'
import type { template as pageNavTemplate } from '@fiction/cards/page-nav/index'
import type { template as ProofMetricsTemplate } from '@fiction/cards/proof-metrics/index'
import type { template as SliderOverlayTemplate } from '@fiction/cards/slider-overlay/index'
import type { template as StatementTemplate } from '@fiction/cards/slider-statement/index'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'

type SectionArgs = {
  factory: CardFactory
  stock: StockMedia
  site: Site
  userConfig: SiteUserConfig
}

export async function getPages(args: SectionArgs) {
  const { factory, stock } = args

  return [
    // Home page
    await factory.fromTemplate({
      slug: '_home',
      cards: [
        await factory.fromTemplate<typeof SliderOverlayTemplate>({
          templateId: 'sliderOverlay',
          userConfig: { },
        }),
        await factory.fromTemplate<typeof featuresTemplate>({
          templateId: 'contentFeatures',
          userConfig: { },
        }),
        await factory.fromTemplate<typeof heroTemplate>({
          templateId: 'contentHero',
          userConfig: {
            title: 'Hello',
            layout: 'center',
            media: stock.getRandomByTags(['person', 'aspect:landscape']),
            action: {
              buttons: [
                { label: 'View Work', href: '/work', theme: 'primary' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          },
        }),

        await factory.fromTemplate({ templateId: 'proofMetrics' }), // Key achievements
        await factory.fromTemplate({ templateId: 'galleryShowcase' }), // Selected works grid

      ],
    }),

    // Work/Projects page
    await factory.fromTemplate({
      slug: 'work',
      cards: [
        await factory.fromTemplate({ templateId: 'contentHero' }),
        await factory.fromTemplate({ templateId: 'contentBento' }), // Project grid
        await factory.fromTemplate({ templateId: 'galleryMasonry' }), // Visual showcase
      ],
    }),

    // About/Background page
    await factory.fromTemplate({
      slug: 'about',
      cards: [
        await factory.fromTemplate({ templateId: 'contentStory' }), // Career journey
        await factory.fromTemplate({ templateId: 'contentTimeline' }), // Experience timeline
        await factory.fromTemplate({ templateId: 'proofQuotes' }), // Testimonials
      ],
    }),

    // Blog/Insights page
    await factory.fromTemplate({
      slug: 'blog',
      cards: [
        await factory.fromTemplate({ templateId: 'postsMagazine' }),
      ],
    }),

    // Contact page
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate({ templateId: 'contentHero' }),
        await factory.fromTemplate({ templateId: 'convertContact' }),
        await factory.fromTemplate({ templateId: 'locationMaps' }),
      ],
    }),
  ]
}

// Implement header with navigation
export async function getHeader(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    regionId: 'header',
    templateId: 'pageArea',
    cards: [
      await factory.fromTemplate<typeof pageNavTemplate>({
        templateId: 'pageNav',
        userConfig: {
          brand: {
            logo: {
              variant: 'typography',
              typography: {
                label: 'Prestige',
              },

            },
          },

          nav: {
            primary: [
              { label: 'Work', href: '/work' },
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
            ],
            utility: [
              {
                label: 'Connect',
                list: {
                  items: [
                    { label: 'LinkedIn', href: '#', icon: { class: 'i-tabler-brand-linkedin' } },
                    { label: 'GitHub', href: '#', icon: { class: 'i-tabler-brand-github' } },
                  ],
                },
              },
              {
                label: 'Contact',
                href: '/contact',
                variant: 'button',
                theme: 'primary',
                design: 'outline',
              },
            ],
          },
        },
      }),
    ],
  })
}

// Footer implementation
export async function getFooter(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    regionId: 'footer',
    templateId: 'pageArea',
    cards: [
      await factory.fromTemplate({
        templateId: 'convertCta',
        userConfig: { },
      }),
      await factory.fromTemplate({ templateId: 'pageFooterPro' }),
    ],
  })
}

// Hidden section for modals etc
export async function getHidden(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate({ templateId: 'modalMedia' }),
      await factory.fromTemplate({ templateId: 'convertCapture' }),
    ],
  })
}

export async function getConfig(args: Omit<SectionArgs, 'stock'>) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }

  const [pages, header, footer, hidden] = await Promise.all([
    getPages(a),
    getHeader(a),
    getFooter(a),
    getHidden(a),
  ])

  return {
    sections: { header, footer, hidden },
    pages,
  }
}
