import type { template as bentoTemplate } from '@fiction/cards/content-bento/index'
import type { template as featuresTemplate } from '@fiction/cards/content-features/index'
import type { template as heroTemplate } from '@fiction/cards/content-hero/index'
import type { template as storyTemplate } from '@fiction/cards/content-story/index'
import type { template as timelineTemplate } from '@fiction/cards/content-timeline/index'
import type { template as CtaTemplate } from '@fiction/cards/convert-cta/index'
import type { template as galleryTemplate } from '@fiction/cards/gallery-masonry/index'
import type { template as parallaxScollTemplate } from '@fiction/cards/gallery-parallax-scroll'
import type { template as templateFooterPro } from '@fiction/cards/page-footer-pro/index'
import type { template as cardSiteNavV1Template } from '@fiction/cards/page-nav/index'
import type { template as postListTemplate } from '@fiction/cards/posts-list'
import type { template as metricsTemplate } from '@fiction/cards/proof-metrics/index'
import type { template as quotesTemplate } from '@fiction/cards/proof-quotes/index'
import type { template as cardOverlaySliderV1Template } from '@fiction/cards/slider-overlay/index'

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
        await factory.fromTemplate<typeof cardOverlaySliderV1Template>({
          templateId: 'cardOverlaySliderV1',
          userConfig: {
            autoSlide: true,
            items: [
              {
                title: 'The Art of Prestige',
                subTitle: 'Where classical illusion meets modern sophistication',
                media: stock.getRandomByTags(['person']),
                textBlend: 'difference',
              },
              {
                title: 'Masters of Misdirection',
                subTitle: 'Crafting unforgettable moments of wonder for elite audiences',
                media: stock.getRandomByTags(['person']),
                textBlend: 'difference',
              },
              {
                title: 'Beyond Illusion',
                subTitle: 'Transform your event into an extraordinary experience',
                media: stock.getRandomByTags(['person']),
                textBlend: 'difference',
              },
            ],
          },
        }),
        await factory.fromTemplate<typeof featuresTemplate>({
          templateId: 'cardFeaturesV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Signature Performances',
                subTitle: 'Curated magical experiences for discerning audiences',
                layout: 'left',
              },
            },
            items: [
              {
                title: 'Corporate Illusions',
                description: 'Elevate your corporate message through sophisticated deception. From product reveals to brand storytelling, we transform business objectives into moments of astonishment.',
                icon: { iconId: 'briefcase' },
                color: 'blue',
                columns: '2',
              },
              {
                title: 'Creative Direction',
                description: 'Behind the scenes of television\'s most captivating illusions. Bringing magical authenticity to productions like Netflix\'s "The Magicians" and Broadway\'s "The Prestige".',
                icon: { iconId: 'bulb' },
                color: 'emerald',
                columns: '2',
              },
              {
                title: 'Private Exhibitions',
                description: 'Intimate performances crafted for distinguished gatherings. Specializing in high-society events where every detail is an opportunity for wonder.',
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
          templateId: 'cardHeroV1',
          userConfig: {
            layout: 'left',
            title: 'Illusionist & Creative Director',
            subTitle: 'Crafting sophisticated deceptions for elite corporate events and entertainment productions. Based in Chicago, performing worldwide.',
            superTitle: {
              text: 'The Art of Prestige',
              icon: { iconId: 'star' },
              theme: 'primary',
            },
            media: stock.getRandomByTags(['people']),
            action: {
              buttons: [
                { label: 'Past Performances', href: '/work', theme: 'primary' },
                { label: 'Begin the Journey', href: '/contact' },
              ],
            },
          },
        }),

        await factory.fromTemplate<typeof metricsTemplate>({
          templateId: 'cardMetricsV1',
          userConfig: {
            standard: {
              headers: {
                title: 'A Legacy of Wonder',
                subTitle: 'Fifteen years of orchestrating astonishment',
              },
            },
            items: [
              { label: 'Annual Performances', value: 120, format: 'number', description: 'Elite events' },
              { label: 'Client Enchantment', value: 82, format: 'percent', description: 'Return engagements' },
              { label: 'Global Reach', value: 23, description: 'Countries mystified' },
            ],
          },
        }),
        await factory.fromTemplate<typeof parallaxScollTemplate>({
          templateId: 'CardParallaxScrollV1',
          userConfig: {
            standard: {
              headers: {
                layout: 'center',
                superTitle: { text: 'Portfolio', icon: { iconId: 'wand' }, theme: 'primary' },
                title: 'Recent Illusions',
                subTitle: 'Selected performances and creative direction',
              },
            },
            items: [
              {
                title: 'Google I/O 2023',
                content: 'Reimagined the impossible for Google\'s AI showcase. Created visual metaphors where technology and magic become indistinguishable.',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.4,
                action: {
                  buttons: [
                    { label: 'Reveal the Magic', href: '/work/google-io' },
                  ],
                },
              },
              {
                title: 'Netflix\'s "The Magicians"',
                content: 'Lead illusion designer for Season 5. Transformed classical sleight of hand into contemporary visual storytelling.',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.6,
                action: {
                  buttons: [
                    { label: 'Behind the Illusion', href: '/work/netflix' },
                  ],
                },
              },
              {
                title: 'SpaceX Executive Retreat',
                content: 'Crafted an intimate performance where the principles of misdirection mirror the beauty of orbital mechanics.',
                media: stock.getRandomByTags(['object']),
                parallaxStrength: 0.5,
                action: {
                  buttons: [
                    { label: 'Experience the Wonder', href: '/work/spacex' },
                  ],
                },
              },
            ],
          },
        }),
        await factory.fromTemplate<typeof postListTemplate>({
          templateId: 'cardPostsListV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Mysteries Unveiled',
                subTitle: 'Exploring the art and psychology of modern illusion',
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
        await factory.fromTemplate<typeof heroTemplate>({
          templateId: 'cardHeroV1',
          userConfig: {
            title: 'Recent Work',
            subTitle: 'Selected performances and consulting projects',
          },
        }),
        await factory.fromTemplate<typeof bentoTemplate>({
          templateId: 'cardBentoV1',
          userConfig: {
            items: [
              {
                title: 'Title',
              },
            ],
          },
        }), // Project grid

        await factory.fromTemplate<typeof galleryTemplate>({
          templateId: 'cardPhotoGalleryV1',
          userConfig: {
            items: [
              {
                title: 'Google I/O 2023',
                content: 'Designed and performed custom effects for Google\'s AI presentation. Created visual metaphors for machine learning through sleight of hand.',
              },
            ],
          },
        }),
      ],
    }),

    // About/Background page
    await factory.fromTemplate({
      slug: 'about',
      cards: [
        await factory.fromTemplate<typeof storyTemplate>({
          templateId: 'cardStoryV1',
          userConfig: {
            standard: {
              headers: {
                title: 'The Story Behind the Wonder',
                subTitle: 'From childhood curiosity to mastery of the impossible',
              },
            },
            items: [
              {
                title: 'A Spark of Magic',
                content: 'My journey began on the streets of Chicago, where the city\'s rich history of vaudeville and mystery first captured my imagination. At age seven, I discovered an old copy of Hoffman\'s Modern Magic in my grandfather\'s library. That weathered tome, with its cryptic illustrations and secrets, sparked a lifelong obsession with the art of the impossible.',
                media: stock.getRandomByTags(['people']),
              },
              {
                title: 'The Art of Wonder',
                content: 'Under the mentorship of master illusionists at the McBride Magic & Mystery School, I delved deep into both classical techniques and psychological principles. Here, I learned that true magic lies not in the mechanics of deception, but in creating moments of genuine astonishment that resonate long after the performance ends.',
                media: stock.getRandomByTags(['people']),
              },
              {
                title: 'Modern Mystique',
                content: 'Today, I blend classical sleight of hand with contemporary presentation to create experiences that challenge the boundaries between illusion and reality. Whether consulting for major productions or performing at exclusive gatherings, my mission remains constant: to create sophisticated moments of wonder that engage both intellect and imagination.',
                media: stock.getRandomByTags(['people']),
              },
            ],
          },
        }), // Career journey
        await factory.fromTemplate<typeof timelineTemplate>({
          templateId: 'cardTimelineV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Milestones in Mystery',
                subTitle: 'Key moments in the pursuit of the impossible',
              },
            },
            items: [
              {
                title: 'First International Tour',
                content: 'Debut performances across Europe, culminating in a sold-out show at London\'s prestigious Magic Circle Theatre',
                date: '2009',
                icon: { iconId: 'plane' },
              },
              {
                title: 'Television Debut',
                content: 'Featured consultant and performer for "Masters of Illusion," introducing innovative effects that redefined close-up magic for television',
                date: '2012',
                icon: { iconId: 'device-tv' },
              },
              {
                title: 'FISM World Championship',
                content: 'Awarded first place in Close-up Magic at the Olympics of Magic, presenting original effects that have since become industry standards',
                date: '2015',
                icon: { iconId: 'award' },
              },
              {
                title: 'Corporate Innovation',
                content: 'Pioneered the integration of classical magic principles with product launches and brand reveals for Fortune 500 companies',
                date: '2018',
                icon: { iconId: 'briefcase' },
              },
              {
                title: 'Creative Direction',
                content: 'Lead illusion designer for major streaming productions, bridging the gap between practical effects and digital wizardry',
                date: '2021',
                icon: { iconId: 'bulb' },
              },
            ],
          },
        }), // Experience timeline
        await factory.fromTemplate<typeof quotesTemplate>({
          templateId: 'cardQuotesV1',
          userConfig: {
            standard: {
              headers: {
                title: 'Voices of Wonder',
                subTitle: 'What audiences and clients say about their experience',
              },
            },
            items: [
              {
                text: 'In an age of digital effects and virtual reality, his performances remind us that true magic happens in real-time, right before our eyes.',
                author: {
                  label: 'David Copperfield',
                  subLabel: 'Master Illusionist',
                  media: stock.getRandomByTags(['man']),
                },
              },
              {
                text: 'His ability to weave our product story into a moment of genuine astonishment transformed our launch from a presentation into an unforgettable experience.',
                author: {
                  label: 'Samantha Chen',
                  subLabel: 'Innovation Director, Google',
                  media: stock.getRandomByTags(['woman']),
                },
              },
              {
                text: 'The consulting work he provided for our production brought an authenticity to the magic that respected both the art form and our audience\'s intelligence.',
                author: {
                  label: 'Michael Zhang',
                  subLabel: 'Executive Producer, Netflix',
                  media: stock.getRandomByTags(['man']),
                },
              },
            ],
          },
        }), // Testimonials
      ],
    }),

    // Blog/Insights page
    await factory.fromTemplate({
      slug: 'blog',
      cards: [
        await factory.fromTemplate({ templateId: 'cardPostsMagazineV1' }),
      ],
    }),

    // Contact page
    await factory.fromTemplate({
      slug: 'contact',
      cards: [
        await factory.fromTemplate({ templateId: 'cardHeroV1' }),
        await factory.fromTemplate({ templateId: 'cardContactV1' }),
        await factory.fromTemplate({ templateId: 'cardMapsV1' }),
      ],
    }),
  ]
}

// Header navigation
export async function getHeader(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    regionId: 'header',
    templateId: 'cardPageAreaV1',
    cards: [
      await factory.fromTemplate<typeof cardSiteNavV1Template>({
        templateId: 'cardSiteNavV1',
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
              { label: 'Work', href: '/work' },
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

// Footer
export async function getFooter(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    regionId: 'footer',
    templateId: 'cardPageAreaV1',
    cards: [
      await factory.fromTemplate<typeof CtaTemplate>({
        templateId: 'cardCtaV1',
        userConfig: {
          title: 'Ready to Experience the Impossible?',
          subTitle: 'Let\'s create a moment of genuine astonishment for your next event',
          action: {
            buttons: [
              { label: 'Begin the Journey', href: '/contact', theme: 'primary' },
              { label: 'Explore Our Craft', href: '/services' },
            ],
          },
        },
      }),
      await factory.fromTemplate<typeof templateFooterPro>({
        templateId: 'cardFooterProV1',
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
              title: 'Performances',
              items: [
                { label: 'Corporate Illusions', href: '/services/corporate', icon: { iconId: 'building' } },
                { label: 'Private Exhibitions', href: '/services/private', icon: { iconId: 'glass' } },
                { label: 'Creative Direction', href: '/services/consulting', icon: { iconId: 'bulb' } },
              ],
            },
            {
              title: 'Resources',
              items: [
                { label: 'Technical Specifications', href: '/tech-specs', icon: { iconId: 'settings' } },
                { label: 'Event Planning Guide', href: '/planning', icon: { iconId: 'calendar' } },
                { label: 'Press Portfolio', href: '/press', icon: { iconId: 'newspaper' } },
              ],
            },
          ],
          badges: {
            buttons: [
              { label: 'Member of The Inner Magic Circle with Gold Star', href: '/credentials', theme: 'primary', design: 'ghost', icon: { iconId: 'wand' } },
              { label: 'FISM World Champion of Magic', href: '/about', theme: 'blue', design: 'ghost', icon: { iconId: 'award' } },
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
      await factory.fromTemplate({ templateId: 'cardModalMediaV1' }),
      await factory.fromTemplate({ templateId: 'cardCaptureV1' }),
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
