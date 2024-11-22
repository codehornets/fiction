import type { template as footerProTemplate } from '@fiction/cards/footerPro/index.js'
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
    name: 'LinkedIn',
    media: { iconId: `linkedin` },
  },
  {
    key: 'github',
    href: 'https://github.com/fictionco',
    target: '_blank',
    name: 'Github',
    media: { iconId: `github` },
  },
  {
    key: 'x',
    href: 'https://www.x.com/fictionplatform',
    target: '_blank',
    name: 'X',
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
          await factory.fromTemplate({ templateId: 'mediaPop', userConfig: { } }),
          await factory.fromTemplate({ templateId: 'textEffects', userConfig: { } }),
        ],
      }),
      header: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate({
            templateId: 'nav',
            userConfig: {
              layout: 'navCenter',
              logo: {
                format: 'component',
                el: FictionLogo,
              },
              navA: [
                { name: 'Why Fiction', href: '/tour' },
                { name: 'About', href: '/about' },
                {
                  name: 'Web Elements',
                  desc: 'Professional components for your website',
                  subStyle: 'mega',
                  items: [
                    {
                      name: 'Content',
                      items: [
                        { name: 'Bento', href: '/demo-bento' },
                        { name: 'Trek', href: '/demo-trek' },
                        { name: 'Numbered List', href: '/demo-numberedList' },
                        { name: 'People', href: '/demo-people' },
                        { name: 'Features', href: '/demo-features' },
                        { name: 'Tour', href: '/demo-tour' },
                        { name: 'Hero', href: '/demo-hero' },
                        { name: 'Statement', href: '/demo-statement' },
                      ],
                    },
                    {
                      name: 'Conversion',
                      items: [
                        { name: 'Capture', href: '/demo-capture' },
                        { name: 'Call to Action', href: '/demo-callToAction' },
                        { name: 'Pricing', href: '/demo-pricing' },
                        { name: 'Contact', href: '/demo-contact' },
                        { name: 'FAQ / List', href: '/demo-faq' },
                      ],
                    },
                    {
                      name: 'Portfolio',
                      items: [
                        { name: 'Gallery', href: '/demo-gallery' },
                        { name: 'Showcase', href: '/demo-showcase' },
                        { name: 'Cinema', href: '/demo-cinema' },
                        { name: 'Marquee', href: '/demo-marquee' },
                        { name: 'Logos', href: '/demo-logos' },
                        { name: 'Metrics', href: '/demo-metrics' },
                        { name: 'Testimonials', href: '/demo-testimonials' },
                      ],
                    },

                    {
                      name: 'Site',
                      items: [
                        { name: 'Nav', href: '/demo-nav' },
                        { name: 'Footer Pro', href: '/demo-footerPro' },
                        { name: 'Footer X', href: '/demo-footerX' },
                        { name: 'Maps', href: '/demo-maps' },
                        { name: 'Area', href: '/demo-area' },
                      ],
                    },
                    {
                      name: 'Typography',
                      items: [
                        { name: 'Ticker', href: '/demo-ticker' },
                        { name: 'Fit Text', href: '/demo-fitText' },
                        { name: 'Quotes', href: '/demo-quotes' },

                      ],
                    },
                    {
                      name: 'Posts',
                      items: [
                        { name: 'Magazine', href: '/demo-magazine' },
                        { name: 'Post List', href: '/demo-postList' },
                      ],
                    },
                    {
                      name: 'Profile',
                      items: [
                        { name: 'Over Slide', href: '/demo-overSlide' },
                        { name: 'Profile', href: '/demo-profile' },
                        { name: 'Story', href: '/demo-story' },
                      ],
                    },

                    {
                      name: 'Standard UI',
                      items: [
                        { name: 'Buttons', href: '/demo-xbutton' },
                        { name: 'Inputs', href: '/demo-xinput' },
                        { name: 'Media', href: '/demo-xmedia' },
                        { name: 'Logo', href: '/demo-xlogo' },
                        { name: 'Shapes', href: '/demo-effectShape' },
                      ],
                    },
                  ],
                },
              ],
              navB: [
                { name: 'Account', href: '/app?_reload=1', itemStyle: 'user', items: [
                  { name: 'Sign In', href: '/app/auth/login?_reload=1', authState: 'loggedOut' },
                  { name: 'Dashboard', href: '/app?_reload=1', authState: 'loggedIn' },
                ] },
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
                  { name: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
                  { name: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
                ],
              },
              columns: [
                {
                  title: 'Explore',
                  items: [
                    { href: '/tour', name: 'Tour' },
                    { href: '/pricing', name: 'Pricing' },
                    { href: '/developer', name: 'Developer' },
                  ],
                },
                {
                  title: 'Company',
                  items: [
                    { href: '/about', name: 'About' },
                    { href: '/affiliate', name: 'Affiliate' },
                  ],
                },
                {
                  title: 'Using Fiction',
                  items: [
                    { href: `https://docs.${domain}`, name: 'Docs', target: '_blank' },
                    { href: `https://docs.${domain}/resources/support.html`, name: 'Support', target: '_blank' },
                    { href: '/app?_reload=1', name: 'Dashboard' },
                  ],
                },
              ],

              additional: {
                social,
                links: [
                  { name: 'Privacy', href: `https://docs.${domain}/resources/privacy.html` },
                  { name: 'Terms', href: `https://docs.${domain}/resources/terms.html` },
                  { name: `© ${dayjs().format('YYYY')} Fiction.com` },
                ],
              },

              badges: {
                title: '',
                actions: [
                  {
                    href: 'https://stripe.com/partners',
                    target: '_blank',
                    name: 'Stripe Verified Partner',
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
