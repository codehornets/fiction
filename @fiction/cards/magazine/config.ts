import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema } from '@fiction/core'
import { z } from 'zod'
import { getDemoPosts } from '../utils/post'

export const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Magazine post configuration'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

export async function getDemoUserConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const demoPosts = await getDemoPosts({ stock })

  return {
    posts: {
      format: 'local',
      entries: demoPosts.map(p => ({
        ...p,
        media: stock.getRandomByTags(['object']),
      })),
    },
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args

  const userConfig: UserConfig = {
    standard: {
      headers: {
        title: 'Latest Articles',
        subTitle: 'Discover our latest insights and stories',
      },
    },
    posts: {
      format: 'standard',
      limit: 12,
    },
  }

  const demoUserConfig = await getDemoUserConfig(args)

  return {
    schema,
    userConfig,
    demoPage: {
      cards: [
        {
          templateId,
          userConfig,
        },
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Featured Stories',
                subTitle: 'Deep dives into topics that matter',
              },
            },
            ...demoUserConfig,
          },
        },
      ] satisfies { templateId: string, userConfig: UserConfig }[],
    },
  }
}
