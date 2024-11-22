import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { PostHandlingSchema } from '@fiction/core'
import { z } from 'zod'
import { getDemoPosts } from '../utils/post'

// Schema definition
export const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Blog post configuration and handling'),
  layout: z.object({
    featuredCount: z.number().optional().describe('Number of featured posts to display prominently'),
    showAuthors: z.boolean().optional().describe('Display author information'),
    showExcerpts: z.boolean().optional().describe('Show post excerpts in grid'),
    showReadTime: z.boolean().optional().describe('Display estimated reading time'),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

export function getDefaultUserConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    standard: {
      headers: {
        title: 'Latest Articles',
        subTitle: 'Discover our latest insights and stories',
      },
    },
    posts: {
      format: 'standard',
      limit: 12,
      entries: getDemoPosts({ stock, limit: 3 }),
    },
  }
}

// Demo user configuration
export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  const demoPosts = await getDemoPosts({ stock })

  return {
    layout: {
      featuredCount: 3,
      showAuthors: true,
      showExcerpts: true,
      showReadTime: true,
    },
    posts: {
      format: 'local',
      entries: demoPosts.map(p => ({
        ...p,
        media: stock.getRandomByTags(['object']),
      })),
    },
  }
}

// Demo card configurations
export function getDemoCards(args: { templateId: string, demoUserConfig: UserConfig, stock: StockMedia }): { templateId: string, userConfig: UserConfig }[] {
  const { templateId, demoUserConfig, stock } = args

  return [
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: 'Design Insights',
            title: 'Curated Perspectives',
            subTitle: 'Exploring innovation through expert analysis and fresh ideas',
          },
        },
        ...demoUserConfig,
      },
    },
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: 'Tech & Culture',
            title: 'Digital Frontier',
            subTitle: 'Where technology meets human experience',
          },
          scheme: {
            base: { theme: 'slate' },
          },
        },
        layout: {
          ...demoUserConfig.layout,
          featuredCount: 1,
        },
        posts: demoUserConfig.posts,
      },
    },
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: 'Future Impact',
            title: 'Tomorrow\'s Stories',
            subTitle: 'Ideas and innovations shaping our world',
          },
          scheme: {
            base: { theme: 'emerald' },
          },
        },
        layout: {
          ...demoUserConfig.layout,
          featuredCount: 2,
        },
        posts: demoUserConfig.posts,
      },
    },
    // Single post display demo
    {
      templateId,
      userConfig: {
        ...demoUserConfig,
        posts: {
          ...demoUserConfig.posts,
          entries: getDemoPosts({ stock, limit: 1 }),
        },
      },
    },
  ] satisfies { templateId: string, userConfig: UserConfig }[]
}

// Main config function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const demoUserConfig = await getDemoUserConfig({ factory, stock })

  return {
    schema,
    userConfig: getDefaultUserConfig({ ...args, stock }),
    demoPage: {
      cards: getDemoCards({ templateId, demoUserConfig, stock }),
    },
  }
}
