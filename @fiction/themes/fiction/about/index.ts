import type { template as faqTemplate } from '@fiction/cards/faq/index.js'
import type { template as heroTemplate } from '@fiction/cards/hero/index.js'
import type { MapConfig } from '@fiction/cards/maps/config'
import type { template as mapsTemplate } from '@fiction/cards/maps/index.js'
import type { template as peopleTemplate } from '@fiction/cards/people/index.js'
import type { template as quoteTemplate } from '@fiction/cards/quotes/index.js'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { Site } from '@fiction/site/site.js'
import ap from './ap.webp'
import girlComputer from './girl-computer.webp'
import pro from './pro.webp'
import spectrum from './spectrum.jpg'

export async function page(args: { site: Site, factory: CardFactory }) {
  const { factory } = args
  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: { text: 'Company' },
      subTitle: `A company built to help you tell your story. Made in California.`,
      title: `About`,
      splash: { format: 'url', url: spectrum },
      layout: 'justify',
      actions: [],
    },
  })

  const missionHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: { text: 'Mission' },
      subTitle: `We believe everyone has a story to tell and a reputation to build. Fiction's mission is to elevate people and remove barriers to success.`,
      title: `Helping People.`,
      splash: { format: 'url' as const, url: pro },
      layout: 'left',
      actions: [],
    },
  })

  const missionHeroCard2 = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'hero',
    userConfig: {
      superTitle: { text: 'Mission' },
      subTitle: `We don't believe in compromising products for profit. Fiction is open-source and free to use. We believe in the power of community and the value of giving back.`,
      title: `Open Source Software.`,
      splash: { format: 'url', url: girlComputer },
      layout: 'right',
      actions: [],
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
        media: { format: 'url', url: ap },
        social: [{
          label: 'LinkedIn',
          media: { class: 'i-tabler-linkedin' },
          href: 'https://www.linkedin.com/in/arpowers',
        }],
      }],
      layout: 'mediabox',
    },
  })

  const mapIrvine: MapConfig = {
    lat: 33.5427,
    lng: -117.7854,
    zoom: 15,
    pitch: 60,
    markers: [{ lat: 33.5427, lng: -117.7854, label: 'Orange County, CA' }],
    mapStyle: 'satellite' as const,
  }

  const mapSaltLake: MapConfig = {
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

  return factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'about',
    cards: [
      await factory.create({
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
