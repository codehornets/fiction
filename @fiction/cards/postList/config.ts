import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import z from 'zod'
import { getDemoPosts } from '../utils/post'

export const displaySchema = z.object({
  layout: z.enum(['grid', 'scroll']).optional(),
  proportions: z.enum(['wide', 'standard', 'portrait', 'square', 'cinema']).optional(),
  gap: SizeSchema.optional(),
  showAuthor: z.boolean().optional(),
  showDate: z.boolean().optional(),
  showExcerpt: z.boolean().optional(),
  itemsPerRow: z.number().min(1).max(6).optional(),
  maxRows: z.number().min(1).max(6).optional(),
})

export const schema = z.object({
  display: displaySchema.optional(),
  posts: PostHandlingSchema.optional().describe('Posts configuration'),
  routeBasePath: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig
export type DisplayUserConfig = z.infer<typeof displaySchema>

const options: InputOption[] = [
  new InputOption({
    key: 'display',
    label: 'Layout & Display',
    input: 'group',
    options: [
      new InputOption({
        key: 'layout',
        label: 'Layout Style',
        input: 'InputRadio',
        description: 'Choose how posts are arranged on the page',
        props: {
          options: [
            {
              label: 'Grid Layout',
              value: 'grid',
              description: 'Organize posts in a responsive grid pattern',
            },
            {
              label: 'Scroll Layout',
              value: 'scroll',
              description: 'Create an interactive horizontal scroll gallery',
            },
          ],
        },
      }),
      new InputOption({
        key: 'proportions',
        label: 'Card Proportions',
        input: 'InputRadioButton',
        description: 'Set the aspect ratio for post cards',
        props: {
          options: [
            {
              label: 'Cinema',
              value: 'cinema',
              description: '21:9 ratio - Perfect for dramatic landscape visuals',
              icon: 'i-tabler-rectangle-vertical',
            },
            {
              label: 'Wide',
              value: 'wide',
              description: '16:9 ratio - Ideal for landscape images and video content',
              icon: 'i-tabler-rectangle',
            },
            {
              label: 'Standard',
              value: 'standard',
              description: '4:3 ratio - Classic blog post format',
              icon: 'i-tabler-rectangle',
            },
            {
              label: 'Square',
              value: 'square',
              description: '1:1 ratio - Perfect for social media style layouts',
              icon: 'i-tabler-square',
            },
            {
              label: 'Portrait',
              value: 'portrait',
              description: '3:4 ratio - Great for mobile and vertical content',
              icon: 'i-tabler-rectangle-vertical',
            },
          ],
        },
      }),

      // Grid Layout Options
      new InputOption({
        key: 'itemsPerRow',
        label: 'Items Per Row',
        subLabel: 'Number of posts to display in each row (Grid Layout)',
        input: 'InputNumber',
        props: {
          min: 1,
          max: 6,
          step: 1,
        },
      }),
      new InputOption({
        key: 'gap',
        label: 'Grid Spacing',
        subLabel: 'Space between posts in the grid',
        input: 'InputSelect',
        props: {
          options: [
            { label: 'Minimal', value: 'sm' },
            { label: 'Standard', value: 'md' },
            { label: 'Comfortable', value: 'lg' },
            { label: 'Spacious', value: 'xl' },
            { label: 'Extra Spacious', value: '2xl' },
          ],
        },
      }),
      new InputOption({
        key: 'maxRows',
        label: 'Maximum Rows',
        subLabel: 'Limit the number of rows displayed (Grid Layout)',
        input: 'InputNumber',
        props: {
          min: 1,
          max: 6,
          step: 1,
        },
      }),
    ],
  }),

  // Content Display Options
  new InputOption({
    key: 'display',
    label: 'Content Display',
    input: 'group',
    options: [
      new InputOption({
        key: 'showAuthor',
        label: 'Show Author',
        subLabel: 'Display author information on post cards',
        input: 'InputToggle',
      }),
      new InputOption({
        key: 'showDate',
        label: 'Show Date',
        subLabel: 'Display publication date on post cards',
        input: 'InputToggle',
      }),
      new InputOption({
        key: 'showExcerpt',
        label: 'Show Excerpt',
        subLabel: 'Display post excerpt on cards',
        input: 'InputToggle',
      }),
    ],
  }),

  // Post Selection & Filtering
  new InputOption({
    key: 'posts',
    label: 'Post Configuration',
    input: 'group',
    options: [
      new InputOption({
        key: 'posts',
        label: 'Posts',
        subLabel: 'Configure post selection and filtering',
        input: 'InputPosts',
        description: 'Choose between global posts or specify local entries',
      }),
      new InputOption({
        key: 'routeBasePath',
        label: 'Route Base Path',
        subLabel: 'Base URL path for blog posts (e.g., /blog)',
        input: 'InputText',
        props: {
          placeholder: '/blog',
        },
      }),
    ],
  }),
]

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  // Default configuration focused on instruction
  const userConfig: UserConfig = {
    standard: {
      handling: { showOnSingle: true },
      headers: {
        title: 'Blog Posts',
        subTitle: 'Showcase your content in an engaging format',
      },
    },
    display: {
      layout: 'grid',
      proportions: 'standard',
      showAuthor: true,
      showDate: true,
      showExcerpt: true,
      itemsPerRow: 3,
      gap: 'lg',
    },
    posts: {
      format: 'standard',
      limit: 12,
      query: {
        sortBy: 'dateAt',
        sortOrder: 'desc',
      },
    },
  }

  const demoPosts = await getDemoPosts({ stock })

  return {
    schema,
    options,
    userConfig,
    demoPage: {
      cards: [
        // Featured Posts Layout
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Featured Stories',
                subTitle: 'Showcase your best content in a cinematic scroll',
              },
            },
            display: {
              layout: 'scroll',
              proportions: 'cinema',
              showExcerpt: true,
              showAuthor: true,
              showDate: true,
            },
            posts: {
              format: 'local',
              limit: 3,
              entries: demoPosts.map(p => ({
                ...p,
                media: stock.getRandomByTags(['object']),
              })),
            },
          },
        },
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Featured Stories',
                subTitle: 'Showcase your best content in a cinematic scroll',
              },
            },
            display: {
              layout: 'scroll',
              proportions: 'portrait',
              showExcerpt: true,
              showAuthor: true,
              showDate: true,
            },
            posts: {
              format: 'local',
              limit: 3,
              entries: demoPosts.map(p => ({
                ...p,
                media: stock.getRandomByTags(['object']),
              })),
            },
          },
        },
        // Latest Posts Grid
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Latest Updates',
                subTitle: 'Stay current with our newest content',
              },
            },
            display: {
              layout: 'grid',
              proportions: 'standard',
              showExcerpt: true,
              itemsPerRow: 3,
              gap: 'xl',
            },
            posts: {
              format: 'local',
              limit: 6,
              entries: demoPosts.map(p => ({
                ...p,
                media: stock.getRandomByTags(['object']),
              })),
            },
          },
        },
        // Featured Category
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Tutorial Collection',
                subTitle: 'Learn and grow with our educational content',
              },
            },
            display: {
              layout: 'grid',
              proportions: 'portrait',
              itemsPerRow: 4,
              showExcerpt: false,
              showDate: false,
            },
            posts: {
              format: 'local',
              limit: 4,
              entries: demoPosts.map(p => ({
                ...p,
                media: stock.getRandomByTags(['object']),
              })),
            },
          },
        },
        // Visual Stories
        {
          templateId,
          userConfig: {
            standard: {
              headers: {
                title: 'Visual Stories',
                subTitle: 'Engage with our media-rich content',
              },
            },
            display: {
              layout: 'grid',
              proportions: 'square',
              itemsPerRow: 2,
              showExcerpt: true,
              gap: '2xl',
            },
            posts: {
              format: 'local',
              limit: 4,
              entries: demoPosts.map(p => ({
                ...p,
                media: stock.getRandomByTags(['object']),
                categories: ['Visual'],
              })),
            },
          },
        },
      ],
    },
  }
}
