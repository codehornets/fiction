import type { template as areaTemplate } from '@fiction/cards/area/index.js'
import type { template as faqTemplate } from '@fiction/cards/faq'
import type { template as footerProTemplate } from '@fiction/cards/footerPro/index.js'
import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as logosTemplate } from '@fiction/cards/logos/index'
import type { template as mapsTemplate, MapUserConfig } from '@fiction/cards/maps/index.js'
import type { template as marqueeTemplate } from '@fiction/cards/marquee/index.js'
import type { template as templateMetrics } from '@fiction/cards/metrics/index.js'
import type { template as navTemplate } from '@fiction/cards/nav/index.js'
import type { template as peopleTemplate } from '@fiction/cards/people/index.js'
import type { template as pricingTemplate } from '@fiction/cards/pricing'
import type { template as templateQuotes } from '@fiction/cards/quotes/index.js'

import type { template as tourTemplate } from '@fiction/cards/tour/index.js'
import type { template as wrapTemplate } from '@fiction/cards/wrap/index.js'

import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema.js'
import type { StockMedia } from '@fiction/ui/stock/index.js'

import { getDemoPages } from '@fiction/cards'
import { dayjs, type NavItem, vue } from '@fiction/core'
import { getCheckoutUrl } from '@fiction/plugin-stripe/index.js'

import favicon from '@fiction/ui/brand/favicon.svg'
import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'

const social: NavItem[] = [
  { key: 'linkedin', href: 'https://www.linkedin.com/company/fictionco', target: '_blank', label: 'LinkedIn', media: { iconId: `linkedin` } },
  { key: 'github', href: 'https://github.com/fictionco', target: '_blank', label: 'Github', media: { iconId: `github` } },
  { key: 'x', href: 'https://www.x.com/fictionplatform', target: '_blank', label: 'X', media: { iconId: `x` } },
]

async function purchaseUrl(args: { priceId: string, fictionStripe?: FictionStripe }) {
  const { fictionStripe } = args

  const loginPath = '/auth/login'

  if (!fictionStripe) {
    return loginPath
  }

  return await getCheckoutUrl({ fictionStripe, query: { ...args, loginPath } })
}

export async function getAboutPage(args: { site: Site, factory: CardFactory }) {
  const { factory } = args
  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-home' },
        theme: 'primary',
        text: 'Welcome Home',
      },
      subTitle: `Born in California, Fiction exists to help people tell their story.`,
      title: `A Place For Every Story`,
      splash: {
        format: 'url',
        url: new URL('img/about/fiction-office.webp', import.meta.url).href,
      },
      layout: 'justify',
      action: { buttons: [
        {
          label: 'Join The Community',
          href: '/auth/login',
          theme: 'primary',
          icon: 'i-tabler-users',
        },
      ] },
    },
  })

  const missionHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-trending-up' },
        text: 'The Vision',
        theme: 'orange',
      },
      subTitle: `In a world of noise, authentic stories stand out. Fiction helps amplify genuine voices, build meaningful connections, and transform expertise into lasting impact.`,
      title: `Where Stories Matter`,
      splash: {
        format: 'url' as const,
        url: new URL('img/about/pro.webp', import.meta.url).href,
      },
      layout: 'left',
      action: { buttons: [] },
    },
  })

  const missionHeroCard2 = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-users' },
        text: 'People First',
        theme: 'green',
      },
      subTitle: `Great software should be accessible to everyone. Fiction grows stronger with every voice that joins. When the community thrives, possibilities expand for everyone.`,
      title: `Built Together`,
      splash: {
        format: 'url',
        url: new URL('img/about/girl-computer.webp', import.meta.url).href,
      },
      layout: 'right',
      action: { buttons: [] },
    },
  })

  const teamCard = await factory.fromTemplate<typeof peopleTemplate>({
    templateId: 'people',
    userConfig: {
      subTitle: `Building the future of personal branding together`,
      title: `The Team`,
      profiles: [{
        name: 'Andrew Powers',
        title: 'Founder',
        desc: 'With two decades in software development, Andrew started Fiction with a simple belief: everyone deserves access to professional branding tools, regardless of their background or resources. Today, that vision grows stronger with each new member of the Fiction community.',
        media: {
          format: 'url',
          url: new URL('img/about/ap.webp', import.meta.url).href,
        },
        action: {
          buttons: [{
            label: 'LinkedIn',
            theme: 'cyan',
            icon: { class: 'i-tabler-brand-linkedin' },
            href: 'https://www.linkedin.com/in/arpowers',
          }],
        },
      }],
      layout: 'mediabox',
    },
  })

  const mapIrvine: MapUserConfig = {
    lat: 33.5427,
    lng: -117.7854,
    zoom: 15,
    pitch: 60,
    markers: [{ lat: 33.5427, lng: -117.7854, label: 'Orange County, CA' }],
    mapStyle: 'satellite' as const,
  }

  const mapSaltLake: MapUserConfig = {
    lat: 40.7608,
    lng: -111.8910,
    zoom: 8,
    pitch: 80,
    markers: [{ lat: 40.7608, lng: -111.8910, label: 'Salt Lake City, UT' }],
    mapStyle: 'outdoors' as const,
  }

  const mapCard = await factory.fromTemplate<typeof mapsTemplate>({
    templateId: 'maps',
    userConfig: {
      maps: [mapIrvine, mapSaltLake],
    },
  })

  const valueCard = await factory.fromTemplate<typeof faqTemplate>({
    templateId: 'faq',
    userConfig: {
      layout: 'visible',
      standard: {
        headers: {
          title: 'Core Values',
          subTitle: 'The principles that guide Fiction',
        },
      },
      items: [
        {
          title: 'Purpose-Driven Focus',
          content: `Creating extraordinary value means understanding specific needs. Fiction helps you connect deeply with the people who resonate most with your message.`,
          icon: { iconId: 'target' },
          isHighlighted: true,
        },
        {
          title: `Give First`,
          content: `Success grows through sharing. The Fiction community thrives on meaningful contributions, creating a space where positive impact leads to collective growth.`,
          icon: { class: 'i-tabler-heart-handshake' },
        },
        {
          title: `Crafted Excellence`,
          content: `Quality elevates everyone. Fiction provides tools that exceed expectations, because sharing your story deserves nothing less than the best.`,
          icon: { iconId: 'sparkles' },
        },
        {
          title: `Beautiful Simplicity`,
          content: `In a complex world, clarity stands out. Fiction strips away the unnecessary, letting you focus on what truly matters - connecting with your audience.`,
          icon: { iconId: 'sparkles' },
        },
      ],
      support: {
        text: 'Ready to be part of something bigger?',
        actions: [
          {
            label: 'Join Fiction Today',
            href: '/tour',
            theme: 'primary',
            icon: 'i-tabler-rocket',
          },
        ],
      },
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'about',
    cards: [
      await factory.fromTemplate<typeof areaTemplate>({
        templateId: 'area',
        cards: [
          topHeroCard,
          missionHeroCard,
          missionHeroCard2,
          teamCard,
          mapCard,
          valueCard,
        ],
      }),

    ],
  })
}

export async function getPricingPage(args: { factory: CardFactory, site: Site }) {
  const { site, factory } = args

  const { fictionStripe } = site.fictionSites.fictionEnv.getService<{ fictionStripe: FictionStripe }>()

  const pricingCard = await factory.fromTemplate<typeof pricingTemplate>({
    templateId: 'pricing',
    userConfig: {
      annualDiscountPercent: 40,
      prices: [
        {
          title: 'Basic',
          price: 0,
          description: `What's included...`,
          features: [
            { label: 'Up to 2,500 Subscribers' },
            { label: 'Web Hosting' },
            { label: 'Custom Newsletters' },
            { label: 'Free Plugins' },
          ],
        },
        {
          title: 'Pro',
          price: 99,
          description: `Everything in Basic, plus...`,
          href: await purchaseUrl({ fictionStripe, priceId: 'price_222' }),
          badge: 'Most Popular',
          features: [
            { label: 'Up to 10,000 subscribers' },
            { label: 'Remove Branding' },
            { label: 'Custom domains' },
            { label: 'Pro Plugins' },
          ],
        },
        {
          title: 'Pro+',
          price: 199,
          description: `Everything in Basic, plus...`,
          href: await purchaseUrl({ fictionStripe, priceId: 'price_333' }),
          features: [
            { label: 'Up to 25,000 subscribers' },
            { label: 'Advanced UI cards' },
            { label: 'AI Copilot' },
            { label: 'Additional Pro+ Plugins' },
          ],
        },
      ],
    },
  })

  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: { text: 'Simple Premium Pricing' },
      subTitle: `40% Discount When Paying Annually`,
      title: `Plans and Pricing`,
    },
  })

  const valueCard = await factory.fromTemplate<typeof faqTemplate>({
    templateId: 'faq',
    userConfig: {
      standard: { headers: { title: 'Frequently Asked Questions', subTitle: 'Get answers to common questions about Fiction' } },
      items: [
        { title: 'Can I Cancel My Subscription At Any Time?', content: `Of course! If you decide that Fiction  isn't the right fit for your business, you can easily cancel your account from your dashboard at any time.` },
        { title: `Does Fiction Take A Cut Of My Revenue?`, content: `No! When you make a sale with Fiction, we don't take a percentage cut of your revenue from that sale (unlike most creator platforms). If you use Stripe or Paypal to collect payments, you will still pay their merchant processing fees (for example, Stripe's merchant processing fee is 2.9% + 30 cents per transaction).` },
        { title: `What should my personal marketing platform include?`, content: `A successful platform should feature a consistent stream of content that your audience finds valuable. This could include articles, videos, audios, courses, live webinars, downloadable resources, perks (like event tickets or physical merchandise), and/or a community section or forum.` },

      ],
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'pricing',
    cards: [
      await factory.fromTemplate({
        templateId: 'area',
        cards: [
          topHeroCard,
          pricingCard,
          valueCard,
        ],
      }),

    ],
  })
}

export async function getHomePage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory, stock } = args

  return factory.fromTemplate<typeof wrapTemplate>({
    regionId: 'main',
    templateId: 'wrap',
    slug: '_home',
    title: 'Home',
    userConfig: {
      seo: {
        title: 'Fiction - Personal Branding Platform',
        description: 'Transform your expertise into influence using Fiction\'s AI-powered personal branding platform. Create authentic content, grow your audience, and build authority - all guided by intelligent automation.',
      },
    },
    cards: [
      await factory.fromTemplate({
        templateId: 'area',
        userConfig: { },
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'hero',
            userConfig: {
              superTitle: {
                text: 'Personal Websites and Audience Growth Tools',
                theme: 'orange',
                icon: { class: 'i-tabler-rosette-number-1' },
              },
              title: `Own Your Online Presence, Control Your Future`,
              subTitle: `In just 5 minutes, get a professional home for your personal brand that you actually own - no coding needed. Join thousands who've taken control and started growing real, lasting influence.`,
              action: {
                buttons: [
                  {
                    label: 'Create Account',
                    href: '/app?_reload=1',
                    theme: 'primary',
                    icon: 'i-tabler-user-circle',
                    design: 'solid',
                  },
                  {
                    label: 'Why Fiction',
                    href: '/tour',
                    icon: 'i-tabler-compass',
                  },
                ],
              },
            },
          }),
          await factory.fromTemplate<typeof marqueeTemplate>({
            templateId: 'marquee',
            userConfig: {
              items: [
                {
                  title: 'Andrew Powers',
                  subTitle: 'Serial Entrepreneur',
                  media: {
                    url: `${new URL('img/home/andrew.jpg', import.meta.url).href}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
                  },
                  href: 'https://www.andrewpowers.com',
                },

                {
                  title: 'Hugo Rebora',
                  subTitle: 'Podcaster',
                  media: stock.getAssetBySlug('rebora'),
                  href: '#',
                },
                {
                  title: 'Selena Gomez',
                  subTitle: 'Musician',
                  media: {
                    url: new URL('img/home/selena.jpg', import.meta.url).href,
                  },
                },

                {
                  title: 'Olivia Alani',
                  subTitle: 'Fashion Designer',
                  media: stock.getAssetBySlug('olivia'),
                  href: '#',
                },
                {
                  title: 'Gabriel Torres',
                  subTitle: 'Coach',
                  media: stock.getAssetBySlug('abgcuk'),
                  href: '#',
                },

                {
                  title: 'Barack Obama',
                  subTitle: 'Politician',
                  media: {
                    url: new URL('img/home/obama.webp', import.meta.url).href,
                  },
                },
                {
                  title: 'Sarah Bands',
                  subTitle: 'Director',
                  media: stock.getAssetBySlug('bands'),
                  href: '#',
                },
                {
                  title: 'Dean Stoecker',
                  subTitle: 'Founder, Alteryx',
                  media: {
                    url: new URL('img/home/dean2.jpg', import.meta.url).href,
                  },
                },
                {
                  title: 'Joe Rogan',
                  subTitle: 'Comedian / Podcaster',
                  media: {
                    url: new URL('img/home/rogan.jpg', import.meta.url).href,
                  },
                },
              ],
            },
          }),
          await factory.fromTemplate<typeof logosTemplate>({
            templateId: 'logos',
            userConfig: {
              items: [
                {
                  label: 'The New York Times',
                  href: 'https://www.nytimes.com/2024/04/05/opinion/ezra-klein-podcast-nilay-patel.html',
                  media: stock.getLocalMedia({ key: 'logoNyt' }),
                },
                {
                  label: 'The Guardian',
                  href: 'https://www.theguardian.com/technology/2022/nov/12/when-ai-can-make-art-what-does-it-mean-for-creativity-dall-e-midjourney',
                  media: stock.getLocalMedia({ key: 'logoGuardian' }),
                },
                {
                  label: 'TechCrunch',
                  href: 'https://techcrunch.com/sponsor/fluency/the-ai-revolution-using-artificial-intelligence-to-unlock-massive-time-savings/',
                  media: stock.getLocalMedia({ key: 'logoTechcrunch' }),
                },
              ],
              label: 'Read About Us In',
            },
          }),
        ],

      }),

    ],
  })
}

export async function getTourPage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory, stock } = args
  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'tour',
    title: 'Tour',
    cards: [
      await factory.fromTemplate<typeof areaTemplate>({
        templateId: 'area',
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'hero',
            userConfig: {
              superTitle: {
                text: 'Your Story Deserves To Be Heard',
                theme: 'green',
                icon: { class: 'i-tabler-arrow-up-right' },
              },
              subTitle: `Fiction helps you to share your story authentically and build genuine connections that last. No more juggling multiple tools or feeling lost in the digital noise.`,
              title: `Are you ready to be seen and to <span data-text-effect data-effect-type="squiggle" data-effect-theme="primary">make your impact?</span>`,
              action: {
                buttons: [
                  {
                    label: 'I Am Ready',
                    href: '/app/login?_reload=1',
                    theme: 'primary',
                    design: 'solid',
                    iconAfter: 'i-tabler-arrow-big-right-lines',
                  },
                ],
              },
            },
          }),

          await factory.fromTemplate<typeof tourTemplate>({
            templateId: 'tour',
            userConfig: {
              items: [
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'browser' },
                    text: 'World-Class Personal Websites',
                    theme: 'orange',
                  },
                  title: 'See Your Personal Brand Come to Life',
                  subTitle: 'Effortlessly create your online presence. Show off a high-quality website, create brilliant content to capture and grow your influence.',
                  splash: { url: new URL('img/tour/fig-website-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-website-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'trending-up' },
                    text: 'Audience Growth Tools',
                    theme: 'rose',
                  },
                  title: 'Watch Your Audience Growing Daily',
                  subTitle: 'Wake up to new engaged subscribers every morning. See how your persona resonates as you build an audience that\'s truly yours to nurture and grow.',
                  splash: { url: new URL('img/tour/fig-subscribe-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-subscribe-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'newspaper' },
                    text: 'Newsletter and Email Marketing',
                    theme: 'sky',
                  },
                  title: 'Connect Deeply Through Personal Updates',
                  subTitle: 'Experience the difference when your newsletters feel like personal letters. Notice how your audience engagement grows as you share your journey in your authentic voice.',
                  splash: { url: new URL('img/tour/fig-email-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-email-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'rocket' },
                    text: '10x Your Influence',
                    theme: 'purple',
                  },
                  title: 'Transform Your Influence Into Income',
                  subTitle: 'Visualize your expertise turning into memberships and opportunities. Feel the freedom as your personal brand opens doors to passive income streams.',
                  splash: { url: new URL('img/tour/fig-money-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-money-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'chart-bar' },
                    text: 'Brand Automation',
                    theme: 'yellow',
                  },
                  title: 'Your Brand Works While You Sleep',
                  subTitle: 'Picture your personal brand working 24/7, automatically showcasing your best self. See how our AI-powered tools craft your perfect professional narrative.',
                  splash: { url: new URL('img/tour/fig-contact-screen.svg', import.meta.url).href },
                  action: {},
                },
              ],
            },
          }),
        ],
      }),
      await factory.fromTemplate({
        templateId: 'area',
        userConfig: {},
        cards: [
          await factory.fromTemplate<typeof templateMetrics>({
            templateId: 'metrics',
            userConfig: {
              metrics: [
                {
                  label: 'Personal Brands',
                  description: 'Built & Thriving',
                  value: 8000,
                },
                {
                  label: 'Audience Connections',
                  description: 'Meaningful Engagements',
                  value: 2_020_000,
                },
                {
                  label: 'Creator Success',
                  description: 'Generated for Our Users',
                  format: 'abbreviatedDollar',
                  value: 12_000_000,
                },
              ],
            },
          }),
          await factory.fromTemplate<typeof templateQuotes>({
            templateId: 'quotes',
            userConfig: {
              quotes: [
                {
                  text: `While you're reading this, someone is Googling your name. The story they find will shape their decision to work with you, hire you, or invest in you. Can you afford to let others control your narrative?`,
                  author: {
                    name: 'Tim Ferris',
                    image: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/12556c45-5956-4c71-aebf-c86a0ed45400/public',
                    },
                    title: 'Author of The 4-Hour Workweek',
                  },
                  org: {
                    name: 'Tim Ferris',
                  },
                },
                {
                  text: `Your personal brand isn't just your first impression anymore—it's your only impression. Every day you wait to build yours is an opportunity passing you by.`,
                  author: {
                    name: 'Gary Vaynerchuk',
                    image: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/1a443428-3409-4ed1-7cc8-acb57f566700/public',
                    },
                    title: 'Entrepreneur & Author',
                  },
                  org: {
                    name: 'VaynerMedia',
                  },
                },
                {
                  text: `The best time to build your personal brand was five years ago. The second best time is today. In the digital age, invisibility is a bigger risk than failure.`,
                  author: {
                    name: 'Brené Brown',
                    image: {
                      format: 'image',
                      url: new URL('img/tour/person-brene.webp', import.meta.url).href,
                    },
                    title: 'Research Professor & Author',
                  },
                  org: {
                    name: 'University of Houston',
                  },
                },
                {
                  text: `Every second you're not building your brand online, someone else is building theirs. And they're connecting with the audience that could have been yours.`,
                  author: {
                    name: 'Simon Sinek',
                    image: {
                      format: 'image',
                      url: new URL('img/tour/person-simon.jpg', import.meta.url).href,
                    },
                    title: 'Leadership Expert & Best-Selling Author',
                  },
                  org: {
                    name: 'Start With Why',
                  },
                },
              ],
            },
          }),
        ],
      }),
      await factory.fromTemplate({
        templateId: 'area',
        userConfig: {
          standard: {
            scheme: {
              base: {
                primary: 'blue',
                theme: 'blue',
                bg: {
                  gradient: {
                    angle: 45,
                    stops: [
                      { theme: 'blue', scale: 950, opacity: 0, percent: 50 },
                      { theme: 'blue', scale: 950, opacity: 0.8, percent: 100 },
                    ],
                  },
                },
              },
            },
          },
        },
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'hero',
            userConfig: {
              standard: {
                spacing: { verticalSpacing: 'lg' },
              },
              superTitle: {
                icon: { iconId: 'rocket' },
                text: 'Finally launch your personal brand!',
                theme: 'orange',
              },
              title: `Your Story Is [text_effect type=squiggle]Worth Telling[/text_effect]`,
              subTitle: `Lots of people struggle to build a personal brand! Fiction simplifies the process, give it a try and see the difference.`,
              action: {
                buttons: [
                  {
                    label: 'Start Now',
                    icon: 'i-tabler-rocket',
                    href: '/auth/login?_reload=1',
                    theme: 'primary',
                  },
                ],
              },
            },
          }),
        ],
      }),
    ],
  })
}

export async function getConfig(args: {
  site: Site
  factory: CardFactory
  domain: string
}) {
  const { site, factory, domain } = args

  const { fictionEnv } = site.fictionSites.fictionEnv.getService()

  const demoPages = await getDemoPages({ templates: factory.templates, fictionEnv, site, factory })
  const stock = await factory.getStockMedia()
  const pageArgs = { ...args, factory, stock }

  const tourPage = await getTourPage(pageArgs)
  const homePage = await getHomePage(pageArgs)
  const pricingPage = await getPricingPage(pageArgs)
  const aboutPage = await getAboutPage(pageArgs)

  const pages = await Promise.all([
    tourPage,
    homePage,
    pricingPage,
    aboutPage,
    developer.page({ ...args, factory }),
    affiliate.page({ ...args, factory }),
    ...demoPages,
  ])

  const userConfig: SiteUserConfig = {
    brand: {
      shareImage: { url: shareImage, format: 'image' },
      favicon: { url: favicon, format: 'image' },
      icon: { url: icon, format: 'image' },
    },
    seo: {
      titleTemplate: `{{pageTitle}} - Fiction`,
    },
    customCode: { gtmContainerId: `GTM-5LQBZDJ` },
    styling: {
      buttons: { design: 'ghost', rounding: 'full', hover: 'pop' },
    },
  }

  return {
    userConfig,
    pages,
    sections: {
      hidden: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate({ templateId: 'contentModal', userConfig: { } }),
          await factory.fromTemplate({ templateId: 'textEffects', userConfig: { } }),
        ],
      }),
      header: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate<typeof navTemplate>({
            templateId: 'nav',
            userConfig: {
              layout: 'navCenter',
              brand: {
                logo: {
                  format: 'component',
                  el: vue.defineAsyncComponent(() => import('@fiction/ui/brand/FictionLogo.vue')),
                },
              },

              primaryNav: [
                { label: 'Why Fiction', href: '/tour' },
                { label: 'About', href: '/about' },
                {
                  label: 'Web Elements',
                  list: {
                    description: 'Professional components for your website',
                    variant: 'expanded',
                    items: [
                      {
                        label: 'Content',
                        list: {
                          items: [
                            { label: 'Bento', href: '/demo-bento' },
                            { label: 'Trek', href: '/demo-trek' },
                            { label: 'Numbered List', href: '/demo-numberedList' },
                            { label: 'People', href: '/demo-people' },
                            { label: 'Features', href: '/demo-features' },
                            { label: 'Tour', href: '/demo-tour' },
                            { label: 'Hero', href: '/demo-hero' },
                            { label: 'Statement', href: '/demo-statement' },
                          ],
                        },

                      },
                      {
                        label: 'Conversion',
                        list: {
                          items: [
                            { label: 'Capture', href: '/demo-capture' },
                            { label: 'Call to Action', href: '/demo-callToAction' },
                            { label: 'Pricing', href: '/demo-pricing' },
                            { label: 'Contact', href: '/demo-contact' },
                            { label: 'FAQ / List', href: '/demo-faq' },
                          ],
                        },

                      },
                      {
                        label: 'Portfolio',
                        list: {
                          items: [
                            { label: 'Gallery', href: '/demo-gallery' },
                            { label: 'Showcase', href: '/demo-showcase' },
                            { label: 'Cinema', href: '/demo-cinema' },
                            { label: 'Marquee', href: '/demo-marquee' },
                            { label: 'Logos', href: '/demo-logos' },
                            { label: 'Metrics', href: '/demo-metrics' },
                            { label: 'Testimonials', href: '/demo-testimonials' },
                          ],
                        },

                      },
                      {
                        label: 'Site',
                        list: {
                          items: [
                            { label: 'Nav', href: '/demo-nav' },
                            { label: 'Footer Pro', href: '/demo-footerPro' },
                            { label: 'Footer X', href: '/demo-footerX' },
                            { label: 'Maps', href: '/demo-maps' },
                            { label: 'Area', href: '/demo-area' },
                          ],
                        },
                      },
                      {
                        label: 'Typography',
                        list: {
                          items: [
                            { label: 'Ticker', href: '/demo-ticker' },
                            { label: 'Fit Text', href: '/demo-fitText' },
                            { label: 'Quotes', href: '/demo-quotes' },
                          ],
                        },

                      },
                      {
                        label: 'Posts',
                        list: {
                          items: [
                            { label: 'Magazine', href: '/demo-magazine' },
                            { label: 'Post List', href: '/demo-postList' },
                          ],
                        },

                      },
                      {
                        label: 'Profile',
                        list: {
                          items: [
                            { label: 'Over Slide', href: '/demo-overSlide' },
                            { label: 'Profile', href: '/demo-profile' },
                            { label: 'Story', href: '/demo-story' },
                          ],
                        },

                      },

                      {
                        label: 'Standard UI',
                        list: {
                          items: [
                            { label: 'Buttons', href: '/demo-xbutton' },
                            { label: 'Inputs', href: '/demo-xinput' },
                            { label: 'Media', href: '/demo-xmedia' },
                            { label: 'Logo', href: '/demo-xlogo' },
                            { label: 'Shapes', href: '/demo-effectShape' },
                          ],
                        },

                      },
                    ],
                  },
                },
              ],
              utilityNav: [
                {
                  label: 'Account',
                  href: '/app?_reload=1',
                  variant: 'avatar',
                  list: {
                    items: [
                      { label: 'Sign In', href: '/app/auth/login?_reload=1', onAuthState: 'loggedOut' },
                      { label: 'Dashboard', href: '/app?_reload=1', onAuthState: 'loggedIn' },
                    ],
                  },
                },
              ],

            },
          }),
        ],
      }),
      footer: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate<typeof footerProTemplate>({
            templateId: 'footerPro',
            userConfig: {
              brand: {
                logo: stock.getLocalMedia({ key: 'fictionLogo' }),
                title: 'Fiction',
                subTitle: `Your story begins here...`,
                action: {
                  buttons: [
                    { label: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
                    { label: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
                  ],
                },
              },
              columns: [
                {
                  title: 'Explore',
                  items: [
                    { href: '/tour', label: 'Tour' },
                    { href: '/pricing', label: 'Pricing' },
                    { href: '/developer', label: 'Developer' },
                  ],
                },
                {
                  title: 'Company',
                  items: [
                    { href: '/about', label: 'About' },
                    { href: '/affiliate', label: 'Affiliate' },
                  ],
                },
                {
                  title: 'Using Fiction',
                  items: [
                    { href: `https://docs.${domain}`, label: 'Docs', target: '_blank' },
                    { href: `https://docs.${domain}/resources/support.html`, label: 'Support', target: '_blank' },
                    { href: '/app?_reload=1', label: 'Dashboard' },
                  ],
                },
              ],

              additional: {
                social,
                links: [
                  { label: 'Privacy', href: `https://docs.${domain}/resources/privacy.html` },
                  { label: 'Terms', href: `https://docs.${domain}/resources/terms.html` },
                  { label: `© ${dayjs().format('YYYY')} Fiction.com` },
                ],
              },

              badges: {
                action: {
                  buttons: [
                    {
                      href: 'https://stripe.com/partners',
                      target: '_blank',
                      label: 'Stripe Verified Partner',
                      icon: { iconId: 'stripe' },
                    },
                  ],
                },

              },
            },
          }),
        ],
      }),
    },
  }
}
