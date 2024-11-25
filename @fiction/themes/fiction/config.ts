import type { template as footerProTemplate } from '@fiction/cards/footerPro/index.js'
import type { template as navTemplate } from '@fiction/cards/nav/index.js'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema.js'
import { getDemoPages } from '@fiction/cards'
import { dayjs, type FictionEnv, type NavItem } from '@fiction/core'
import favicon from '@fiction/ui/brand/favicon.svg'

import FictionLogo from '@fiction/ui/brand/FictionLogo.vue'

import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as about from './about/index.js'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'
import * as home from './home/index.js'
import * as pricing from './pricing/index.js'
import * as tour from './tour/index.js'

const social: NavItem[] = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/company/fictionco',
    target: '_blank',
    label: 'LinkedIn',
    media: { iconId: `linkedin` },
  },
  {
    key: 'github',
    href: 'https://github.com/fictionco',
    target: '_blank',
    label: 'Github',
    media: { iconId: `github` },
  },
  {
    key: 'x',
    href: 'https://www.x.com/fictionplatform',
    target: '_blank',
    label: 'X',
    media: { iconId: `x` },
  },
]

export async function getConfig(args: {
  site: Site
  factory: CardFactory
  fictionStripe?: FictionStripe
  domain: string
  fictionEnv: FictionEnv
}) {
  const { site, factory, domain, fictionEnv } = args

  const demoPages = await getDemoPages({ templates: factory.templates, fictionEnv, site, factory })
  const stock = await factory.getStockMedia()
  const tourPage = await tour.getPage({ ...args, factory })
  const pages = await Promise.all([
    home.page({ ...args, factory }),
    tourPage,
    about.page({ ...args, factory }),
    developer.page({ ...args, factory }),
    pricing.page({ ...args, factory }),
    affiliate.page({ ...args, factory }),
    ...demoPages,
  ])

  const userConfig: SiteUserConfig = {
    branding: {
      shareImage: { url: shareImage, format: 'image' },
      favicon: { url: favicon, format: 'image' },
      icon: { url: icon, format: 'image' },
    },
    seo: {
      titleTemplate: `{{pageTitle}} - Fiction`,
    },
    customCode: { gtmContainerId: `GTM-5LQBZDJ` },
    styling: {
      buttons: {
        design: 'ghost',
        rounding: 'full',
        hover: 'pop',
      },
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
                  el: FictionLogo,
                },
              },

              primaryNav: [
                { label: 'Why Fiction', href: '/tour' },
                { label: 'About', href: '/about' },
                {
                  label: 'Web Elements',
                  description: 'Professional components for your website',
                  list: {
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
                actions: [
                  { label: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
                  { label: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
                ],
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
                title: '',
                actions: [
                  {
                    href: 'https://stripe.com/partners',
                    target: '_blank',
                    label: 'Stripe Verified Partner',
                    icon: { iconId: 'stripe' },
                  },
                ],

              },
            },
          }),
        ],
      }),
    },
  }
}
