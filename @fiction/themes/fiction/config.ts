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
      superTitle: { text: 'Company' },
      subTitle: `A company built to help you tell your story. Made in California.`,
      title: `About`,
      splash: {
        format: 'url',
        url: new URL('img/about/spectrum.jpg', import.meta.url).href,
      },
      layout: 'justify',
      action: { buttons: [] },
    },
  })

  const missionHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: { text: 'Mission' },
      subTitle: `We believe everyone has a story to tell and a reputation to build. Fiction's mission is to elevate people and remove barriers to success.`,
      title: `Helping People.`,
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
      superTitle: { text: 'Mission' },
      subTitle: `We don't believe in compromising products for profit. Fiction is open-source and free to use. We believe in the power of community and the value of giving back.`,
      title: `Open Source Software.`,
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
      subTitle: `People helping build your story`,
      title: `Team`,
      profiles: [{
        name: 'Andrew Powers',
        title: 'Founder',
        desc: 'Andrew is the founder of Fiction. He has a background in software engineering and has worked in the tech industry for over 20 years. He is passionate about building tools that help people tell their stories.',
        media: {
          format: 'url',
          url: new URL('img/about/ap.webp', import.meta.url).href,
        },
        social: [{
          label: 'LinkedIn',
          media: { class: 'i-tabler-linkedin' },
          href: 'https://www.linkedin.com/in/arpowers',
        }],
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
      standard: { headers: { title: 'Values', subTitle: 'What we believe in' } },
      items: [
        { title: 'Focused', content: `Create big value for a small group of people. Don't try and be everything to everyone.` },
        { title: `Karma`, content: `Focus on making a contribution, the rest takes care of itself.` },
        { title: `Crafted`, content: `Take the time to do things extremely well. It's better to do nothing, than release something below our standards.` },
        { title: `Minimal`, content: `Simplicity is the ultimate form of elegance. Do what's needed and nothing more.` },
      ],
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
                text: 'The #1 Platform for Personal Branding',
                theme: 'orange',
                icon: { class: 'i-tabler-medal' },
              },
              title: `The Personal Branding Platform`,
              subTitle: `Create your personal brand and quickly build your audience.`,
              action: {
                buttons: [
                  {
                    label: 'Create Account',
                    href: '/app?_reload=1',
                    theme: 'primary',
                    icon: 'i-tabler-user-circle',
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
              superTitle: { text: 'Welcome to Fiction', theme: 'green', icon: { class: 'i-tabler-arrow-up-right' } },
              subTitle: `Fiction is the easiest way to market yourself online.`,
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
          await factory.fromTemplate<typeof logosTemplate>({
            templateId: 'logos',
            userConfig: {
              layout: 'stacked',
              items: [
                {
                  label: 'Coke',
                  href: 'https://www.nytimes.com/2022/10/21/technology/generative-ai.html',
                  media: stock.getLocalMedia({ key: 'logoCoke' }),
                },

                {
                  label: 'Roblox',
                  href: 'https://www.theguardian.com/culture/2022/jun/09/what-exactly-is-ai-generated-art-how-does-it-work-will-it-replace-human-visual-artists',
                  media: stock.getLocalMedia({ key: 'logoRoblox' }),
                },
                {
                  label: 'BBC',
                  href: 'https://techcrunch.com/2022/08/02/ai-art-generated/',
                  media: stock.getLocalMedia({ key: 'logoBBC' }),
                },
                {
                  label: 'Balenciaga',
                  href: 'https://www.nytimes.com/2022/10/21/technology/generative-ai.html',
                  media: stock.getLocalMedia({ key: 'logoBalenciaga' }),
                },
              ],
              label: 'Used by Influencers and Executives In These Companies',
            },
          }),
          await factory.fromTemplate<typeof tourTemplate>({
            templateId: 'tour',
            userConfig: {
              items: [
                {
                  layout: 'right',
                  title: 'Watch Your Personal Brand Come to Life',
                  subTitle: 'Notice how effortlessly your brand guide, site, blog, newsletter, and audience growth tools work together in perfect harmony. Picture having everything you need in one seamless workspace.',
                  splash: { url: new URL('img/fig-website-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-website-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  title: 'Feel Your Audience Growing Daily',
                  subTitle: 'Imagine waking up to new engaged subscribers every morning. See how your authentic voice resonates as you build a community that\'s truly yours to nurture and grow.',
                  splash: { url: new URL('img/fig-subscribe-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-subscribe-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  title: 'Connect Deeply Through Personal Updates',
                  subTitle: 'Experience the difference when your newsletters feel like personal letters. Notice how your audience engagement grows as you share your journey in your authentic voice.',
                  splash: { url: new URL('img/fig-email-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-email-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  title: 'Transform Your Influence Into Income',
                  subTitle: 'Visualize your expertise turning into memberships and opportunities. Feel the freedom as your personal brand opens doors to passive income streams.',
                  splash: { url: new URL('img/fig-money-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-money-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  title: 'Your Brand Works While You Sleep',
                  subTitle: 'Picture your personal brand working 24/7, automatically showcasing your best self. See how our AI-powered tools craft your perfect professional narrative.',
                  splash: { url: new URL('img/fig-contact-screen.svg', import.meta.url).href },
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
                { label: 'Launched', description: 'Websites Deployed', value: 8000 },
                { label: 'Emails Sent', description: 'To Subscribers', value: 2_020_000 },
                { label: 'Dollars Earned', description: 'Revenue', format: 'abbreviatedDollar', value: 12_000_000 },
              ],
            },
          }),
          await factory.fromTemplate<typeof templateQuotes>({
            templateId: 'quotes',
            userConfig: {
              quotes: [
                {
                  text: `Going on a date? Your 'blind' date has Googled your name. Going to a job interview? Ditto.`,
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
                  text: `In today's digital world, your personal brand is often your first impression - make it count.`,
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
              title: `Is Personal Marketing Right For You?`,
              subTitle: `Are you ready to take control of your future? They say: where there is a will, there is a way. Fiction is the way.`,
              action: { buttons: [
                {
                  label: 'Let\'s Get Started',
                  icon: 'i-tabler-rocket',
                  href: '/auth/login?_reload=1',
                  theme: 'primary',
                },
              ] },
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
