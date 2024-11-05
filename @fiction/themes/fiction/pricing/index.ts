import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { getCheckoutUrl } from '@fiction/plugin-stripe/index.js'
import { getFactory } from '../index.js'

async function purchaseUrl(args: { priceId: string, fictionStripe?: FictionStripe }) {
  const { fictionStripe } = args

  const loginPath = '/auth/login'

  if (!fictionStripe) {
    return loginPath
  }

  return await getCheckoutUrl({ fictionStripe, query: { ...args, loginPath } })
}

export async function page(args: { fictionStripe?: FictionStripe, factory: CardFactory, site: Site }) {
  const { fictionStripe, factory } = args

  const pricingCard = await factory.create({
    templateId: 'pricing',
    userConfig: {
      annualDiscountPercent: 40,
      prices: [
        {
          name: 'Basic',
          price: 0,
          desc: `What's included...`,
          features: [
            { name: 'Up to 2,500 Subscribers' },
            { name: 'Web Hosting' },
            { name: 'Custom Newsletters' },
            { name: 'Free Plugins' },
          ],
        },
        {
          name: 'Pro',
          price: 99,
          desc: `Everything in Basic, plus...`,
          href: await purchaseUrl({ fictionStripe, priceId: 'price_222' }),
          badge: 'Most Popular',
          features: [
            { name: 'Up to 10,000 subscribers' },
            { name: 'Remove Branding' },
            { name: 'Custom domains' },
            { name: 'Pro Plugins' },
          ],
        },
        {
          name: 'Pro+',
          price: 199,
          desc: `Everything in Basic, plus...`,
          href: await purchaseUrl({ fictionStripe, priceId: 'price_333' }),
          features: [
            { name: 'Up to 25,000 subscribers' },
            { name: 'Advanced UI cards' },
            { name: 'AI Copilot' },
            { name: 'Additional Pro+ Plugins' },
          ],
        },
      ],
    },
  })

  const topHeroCard = await factory.create({
    templateId: 'hero',
    userConfig: {
      superHeading: 'Simple Premium Pricing',
      subHeading: `40% Discount When Paying Annually`,
      heading: `Plans &amp; Pricing`,
    },
  })

  const valueCard = await factory.create({
    templateId: 'faq',
    userConfig: {
      heading: `Frequently Asked Questions`,
      items: [
        { name: 'Can I Cancel My Subscription At Any Time?', desc: `Of course! If you decide that Fiction  isn't the right fit for your business, you can easily cancel your account from your dashboard at any time.` },
        { name: `Does Fiction Take A Cut Of My Revenue?`, desc: `No! When you make a sale with Fiction, we don't take a percentage cut of your revenue from that sale (unlike most creator platforms). If you use Stripe or Paypal to collect payments, you will still pay their merchant processing fees (for example, Stripe's merchant processing fee is 2.9% + 30 cents per transaction).` },
        { name: `What should my personal marketing platform include?`, desc: `A successful platform should feature a consistent stream of content that your audience finds valuable. This could include articles, videos, audios, courses, live webinars, downloadable resources, perks (like event tickets or physical merchandise), and/or a community section or forum.` },

      ],
    },
  })

  return factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'pricing',
    cards: [
      await factory.create({
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
