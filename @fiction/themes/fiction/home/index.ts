import type { template as heroTemplate } from '@fiction/cards/hero'
import type { template as logosTemplate } from '@fiction/cards/logos'
import type { template as marqueeTemplate } from '@fiction/cards/marquee'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'
import andrew from './img/andrew.jpg'
import dean from './img/dean2.jpg'
import obama from './img/obama.webp'
import rogan from './img/rogan.jpg'
import selena from './img/selena.jpg'

export async function page(args: { site: Site, factory: CardFactory }) {
  const { factory } = args

  const stock = await createStockMediaHandler()

  return factory.fromTemplate({
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
              actions: [
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
          }),
          await factory.fromTemplate<typeof marqueeTemplate>({
            templateId: 'marquee',
            userConfig: {
              items: [
                {
                  title: 'Andrew Powers',
                  subTitle: 'Serial Entrepreneur',
                  media: {
                    url: `${andrew}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
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
                    url: selena,
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
                    url: obama,
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
                    url: dean,
                  },
                },
                {
                  title: 'Joe Rogan',
                  subTitle: 'Comedian / Podcaster',
                  media: {
                    url: rogan,
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
              label: 'As Seen On',
            },
          }),
        ],

      }),

    ],
  })
}
