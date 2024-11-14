import type { CardFactory } from '@fiction/site/cardFactory'
import type { UserConfig } from './index.js'

export async function getDemoUserConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const stock = args.factory.stock
  const c: UserConfig = {
    standard: { spacing: { verticalSpacing: 'sm' }, handling: { showOnSingle: true } },
    posts: {
      format: 'local',
      limit: 5,
      entries: [
        {
          title: 'The Art of Invisible Leadership',
          subTitle: 'When Less Becomes More',
          slug: 'invisible-leadership',
          authors: [{ fullName: 'Alex Winter', email: 'alex.winter@example.com' }],
          content: `Quantum igitur in leadership philosophiam profecimus? The paradox of modern leadership lies not in its visibility but in its quiet impact. Through three paradigm shifts, we discover why the most profound transformations often go unnoticed.`,
          media: stock.getRandomByTags(['object', 'aspect:square']),
          categories: ['Vision', 'Strategy'],
          tags: ['future'],
        },
        {
          title: 'Tomorrow\'s Horizon',
          subTitle: 'Beyond the Obvious',
          slug: 'beyond-horizon',
          authors: [{ fullName: 'Morgan Ray', email: 'morgan.ray@example.com' }],
          content: `Ad astra per aspera - but what lies beyond the stars? Our journey through uncharted territories reveals unexpected patterns in chaos. Here's what we learned when we stopped looking at the map.`,
          media: stock.getRandomByTags(['object']),
          categories: ['Innovation', 'Growth'],
          tags: ['vision'],
        },
        {
          title: 'The Synthesis Effect',
          subTitle: 'Where Opposites Converge',
          slug: 'synthesis-effect',
          authors: [{ fullName: 'Sam Rivers', email: 'sam.rivers@example.com' }],
          content: `In the space between contradiction and harmony, we found our greatest breakthrough. A story of unlikely parallels and the power of embracing paradox in the pursuit of excellence.`,
          media: stock.getRandomByTags(['object']),
          categories: ['Strategy', 'Innovation'],
          tags: ['insight'],
        },
        {
          title: 'Velocity of Trust',
          subTitle: 'The Unseen Catalyst',
          slug: 'trust-velocity',
          authors: [{ fullName: 'Jordan Blake', email: 'jordan.blake@example.com' }],
          content: `When we measured the unmeasurable, we discovered something extraordinary. This exploration of invisible forces challenges conventional wisdom about organizational momentum.`,
          categories: ['Leadership', 'Culture'],
          tags: ['trust'],
          media: stock.getRandomByTags(['object']),
        },
        {
          title: 'The Next Chapter',
          subTitle: 'Writing Tomorrow',
          slug: 'next-chapter',
          authors: [{ fullName: 'Taylor Frost', email: 'taylor.frost@example.com' }],
          content: `Sometimes the best stories are the ones we haven't written yet. Exploring the art of strategic foresight through the lens of narrative and possibility.`,
          media: stock.getRandomByTags(['object']),
          categories: ['Vision', 'Strategy'],
          tags: ['future'],
        },
      ],
    },
  }

  return c
}

export async function getUserConfig(_args: { factory: CardFactory, templateId: string }): Promise<UserConfig> {
  return {
    standard: { spacing: { verticalSpacing: 'sm' as const } },
    posts: { format: 'standard', limit: 12 },
  }
}

export async function getDemo(args: { factory: CardFactory, templateId: string }) {
  const { templateId } = args
  const demoUserConfig = await getDemoUserConfig(args)
  const defaultUserConfig = await getUserConfig(args)
  return {
    cards: [
      { templateId, userConfig: demoUserConfig },
      { templateId, userConfig: defaultUserConfig },
    ],
  }
}
