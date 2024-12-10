import type { template as featuresTemplate } from '@fiction/cards/content-features/index'
import type { template as heroTemplate, template } from '@fiction/cards/content-hero/index'
import type { template as CtaTemplate } from '@fiction/cards/convert-cta/index'
import type { template as parallaxScollTemplate } from '@fiction/cards/gallery-parallax-scroll'
import type { template as GalleryShowcaseTemplate } from '@fiction/cards/gallery-showcase/index'
import type { template as templateFooterPro } from '@fiction/cards/page-footer-pro/index'
import type { template as pageNavTemplate } from '@fiction/cards/page-nav/index'
import type { template as postListTemplate } from '@fiction/cards/posts-list'
import type { template as metricsTemplate } from '@fiction/cards/proof-metrics/index'
import type { template as SliderOverlayTemplate } from '@fiction/cards/slider-overlay/index'

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
          userConfig: {
            autoSlide: true,
            slides: [
              {
                title: 'The Amazing Prestige',
                subTitle: 'A modern magician for corporate events and TV',
                media: stock.getRandomByTags(['background']),
                textBlend: 'difference',
              },
              {
                title: 'Professional Magician',
                subTitle: 'Director of Magic Studies, McBride\'s Magic & Mystery School',
                media: stock.getRandomByTags(['background']),
                textBlend: 'difference',
              },
              {
                title: 'Digital-First Magic Design',
                subTitle: 'Creating illusions optimized for modern media',
                media: stock.getRandomByTags(['background']),
                textBlend: 'difference',
              },
            ],
          },
        }),
        await factory.fromTemplate<typeof featuresTemplate>({
          templateId: 'contentFeatures',
          userConfig: {
            standard: {
              headers: {
                title: 'Services',
                subTitle: 'Professional magic and consulting for modern audiences',
                layout: 'left',
              },
            },
            features: [
              {
                title: 'Corporate Events',
                description: 'Close-up magic and stage shows designed for corporate environments. Customized presentations that integrate company messages and products.',
                icon: { iconId: 'briefcase' },
                color: 'blue',
                columns: '2',
              },
              {
                title: 'Consulting',
                description: 'Magic design for theater productions and TV. Technical advisor for Netflix\'s \'The Magicians\' and Broadway\'s \'The Prestige\'.',
                icon: { iconId: 'bulb' },
                color: 'emerald',
                columns: '2',
              },
              {
                title: 'Private Functions',
                description: 'Bespoke performances for private events. Specialized in high-end weddings and exclusive gatherings up to 200 guests.',
                icon: { iconId: 'users' },
                color: 'indigo',
                columns: '2',
              },
            ],
            style: {
              iconStyle: 'duotone',
            },
          },
        }),
        await factory.fromTemplate<typeof heroTemplate>({
          templateId: 'contentHero',
          userConfig: {
            layout: 'left',
            title: 'Professional Magician & Consultant',
            subTitle: 'Specializing in corporate entertainment and magic design for TV & theater. Based in Chicago, performing worldwide.',
            superTitle: {
              text: 'The Amazing Prestige',
              icon: { iconId: 'star' },
              theme: 'primary',
            },
            media: stock.getRandomByTags(['people']),
            action: {
              buttons: [
                { label: 'Past Events', href: '/work', theme: 'primary' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          },
        }),

        await factory.fromTemplate<typeof metricsTemplate>({
          templateId: 'proofMetrics',
          userConfig: {
            standard: {
              headers: {
                title: 'Experience & Reach',
                subTitle: '15 years of professional performance',
              },
            },
            metrics: [
              { label: 'Annual Events', value: 120, format: 'number', description: 'Corporate & private' },
              { label: 'Client Retention', value: 82, format: 'percent', description: 'Return bookings' },
              { label: 'Countries', value: 23, description: 'Performance venues' },
            ],
          },
        }),
        await factory.fromTemplate<typeof parallaxScollTemplate>({
          templateId: 'galleryParallaxScroll',
          userConfig: {
            standard: {
              headers: {
                layout: 'center',
                superTitle: { text: 'Portfolio', icon: { iconId: 'star' }, theme: 'primary' },
                title: 'Recent Work',
                subTitle: 'Selected performances and consulting projects',
              },
            },
            items: [
              {
                title: 'Google I/O 2023',
                content: 'Designed and performed custom effects for Google\'s AI presentation. Created visual metaphors for machine learning through sleight of hand.',
                media: stock.getRandomByTags(['background']),
                parallaxStrength: 0.4,
                action: {
                  buttons: [
                    { label: 'View Case Study', href: '/work/google-io' },
                  ],
                },
              },
              {
                title: 'Magic Technical Direction',
                content: 'Lead consultant for Netflix\'s \'The Magicians\' Season 5. Designed practical effects and trained actors in sleight of hand techniques.',
                media: stock.getRandomByTags(['background']),
                parallaxStrength: 0.6,
                action: {
                  buttons: [
                    { label: 'Project Details', href: '/work/netflix' },
                  ],
                },
              },
              {
                title: 'Private Event Design',
                content: 'Created a custom close-up magic show for SpaceX\'s executive retreat. Integrated themes of innovation and exploration into classical effects.',
                media: stock.getRandomByTags(['background']),
                parallaxStrength: 0.5,
                action: {
                  buttons: [
                    { label: 'Event Overview', href: '/work/spacex' },
                  ],
                },
              },
            ],
          },
        }),
        await factory.fromTemplate<typeof postListTemplate>({
          templateId: 'postsList',
          userConfig: {
            standard: {
              headers: {
                title: 'Insights & Ideas',
                subTitle: 'Read the latest articles and blog posts',
              },
            },
            posts: {
              viewSlug: 'blog',
            },
          },

        }),

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

// Header navigation
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
              scale: 1.1,
            },
          },
          nav: {
            primary: [
              { label: 'Services', href: '/services' },
              { label: 'Events', href: '/events' },
              { label: 'About', href: '/about' },
            ],
            utility: [
              {
                label: 'Social',
                list: {
                  items: [
                    { label: 'Instagram', href: '#', icon: { class: 'i-tabler-brand-instagram' } },
                    { label: 'LinkedIn', href: '#', icon: { class: 'i-tabler-brand-linkedin' } },
                  ],
                },
              },
              {
                label: 'Book Event',
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

// Footer
export async function getFooter(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    regionId: 'footer',
    templateId: 'pageArea',
    cards: [
      await factory.fromTemplate<typeof CtaTemplate>({
        templateId: 'convertCta',
        userConfig: {
          title: 'Looking for something unique?',
          subTitle: 'Let\'s discuss how we can create an unforgettable experience for your next event',
          action: {
            buttons: [
              { label: 'Get in Touch', href: '/contact', theme: 'primary' },
              { label: 'View Services', href: '/services' },
            ],
          },
        },
      }),
      await factory.fromTemplate<typeof templateFooterPro>({
        templateId: 'pageFooterPro',
        userConfig: {
          brand: {
            logo: {
              variant: 'typography',
              typography: {
                label: 'Prestige',
              },
              scale: 1.1,
            },
            tagline: 'Corporate Magic & Consulting',
          },
          menus: [
            {
              title: 'Services',
              items: [
                { label: 'Corporate Events', href: '/services/corporate', icon: { iconId: 'building' } },
                { label: 'Private Functions', href: '/services/private', icon: { iconId: 'glass' } },
                { label: 'Consulting', href: '/services/consulting', icon: { iconId: 'bulb' } },
              ],
            },
            {
              title: 'Information',
              items: [
                { label: 'Technical Requirements', href: '/tech-specs', icon: { iconId: 'settings' } },
                { label: 'Event Planning Guide', href: '/planning', icon: { iconId: 'calendar' } },
                { label: 'Press Kit', href: '/press', icon: { iconId: 'newspaper' } },
              ],
            },
          ],
          badges: {
            buttons: [
              { label: 'Member of The Magic Circle', href: '/credentials', theme: 'primary', design: 'ghost', icon: { iconId: 'wand' } },
              { label: 'FISM Award Winner', href: '/about', theme: 'blue', design: 'ghost', icon: { iconId: 'award' } },
            ],
          },
          additional: {
            links: [
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ],
            social: [
              {
                label: 'Instagram',
                media: { iconId: 'brand-instagram' },
                href: '#',
              },
              {
                label: 'LinkedIn',
                media: { iconId: 'brand-linkedin' },
                href: '#',
              },
            ],
          },
        },
      }),
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
