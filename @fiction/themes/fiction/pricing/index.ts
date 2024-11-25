import type { template as faqTemplate } from '@fiction/cards/faq'
import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as pricingTemplate } from '@fiction/cards/pricing'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { getCheckoutUrl } from '@fiction/plugin-stripe/index.js'

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
