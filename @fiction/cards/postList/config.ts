// config.ts
import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import { PostHandlingSchema, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import z from 'zod'

export const displaySchema = z.object({
  layout: z.enum(['grid', 'scroll']).optional(),
  size: z.enum(['compact', 'regular', 'expanded']).optional(),
  proportions: z.enum(['short', 'medium', 'tall', 'wide', 'thin']).optional(),
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
})

export type UserConfig = z.infer<typeof schema>
export type DisplayUserConfig = z.infer<typeof displaySchema>

export async function getConfig(args: { templateId: string, factory: CardFactory }): Promise<ConfigResponse> {
  const { templateId, factory } = args

  const stock = await factory.getStockMedia()
  const options: InputOption[] = [
    new InputOption({
      key: 'display',
      label: 'Display Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'layout',
          label: 'Layout',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Grid Layout', value: 'grid' },
              { label: 'Scroll Layout', value: 'scroll' },
            ],
          },
        }),
        new InputOption({
          key: 'size',
          label: 'Card Size',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Compact', value: 'compact' },
              { label: 'Regular', value: 'regular' },
              { label: 'Expanded', value: 'expanded' },
            ],
          },
        }),
        new InputOption({
          key: 'proportions',
          label: 'Height Proportions',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Short', value: 'short' },
              { label: 'Medium', value: 'medium' },
              { label: 'Tall', value: 'tall' },
              { label: 'Wide', value: 'wide' },
              { label: 'Thin', value: 'thin' },
            ],
          },
        }),
        new InputOption({
          key: 'itemsPerRow',
          label: 'Items Per Row',
          input: 'InputNumber',
          props: { min: 1, max: 6 },
        }),
        new InputOption({
          key: 'gap',
          label: 'Grid Spacing',
          input: 'InputSelect',
          list: SizeSchema.options,
        }),

        new InputOption({
          key: 'maxRows',
          label: 'Maximum Rows',
          input: 'InputNumber',
          props: { min: 1, max: 6 },
        }),
        new InputOption({
          key: 'showAuthor',
          label: 'Show Author',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'showDate',
          label: 'Show Date',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'showExcerpt',
          label: 'Show Excerpt',
          input: 'InputToggle',
        }),
      ],
    }),
    new InputOption({ key: 'posts', label: 'Posts', input: 'InputPosts' }),
  ]

  const userConfig: UserConfig = {
    display: {
      layout: 'grid',
      size: 'regular',
      proportions: 'medium',
      showAuthor: true,
      showDate: true,
      showExcerpt: false,
      itemsPerRow: 3,
      maxRows: 2,
    },
    posts: {
      format: 'standard',
      limit: 12,
    },
  }

  // Demo posts showing different content types and use cases
  const demoPosts = [
    {
      title: 'Getting Started with Our Platform',
      subTitle: 'A Complete Guide for New Users',
      slug: 'getting-started-guide',
      authors: [{ fullName: 'Maya Rodriguez', title: 'Lead Product Specialist', email: 'maya@example.com' }],
      content: 'Essential guide covering key features, best practices, and common workflows. Perfect for new users looking to get up to speed quickly.',
      categories: ['Guides', 'Tutorial'],
      tags: ['beginners', 'tutorial'],
      media: stock.getRandomByTags(['people']),
    },
    {
      title: 'Case Study: Enterprise Implementation',
      subTitle: 'How TechCorp Scaled Their Operations',
      slug: 'enterprise-case-study',
      authors: [{ fullName: 'Alex Chen', title: 'Solutions Architect', email: 'alex@example.com' }],
      content: 'Detailed analysis of a successful enterprise implementation, including challenges faced and solutions deployed.',
      categories: ['Case Study', 'Enterprise'],
      tags: ['success-stories', 'enterprise'],
      media: stock.getRandomByTags(['people']),
    },
    {
      title: '10 Advanced Tips & Tricks',
      subTitle: 'Boost Your Productivity',
      slug: 'advanced-tips',
      authors: [{ fullName: 'Sarah West', title: 'Senior Developer', email: 'sarah@example.com' }],
      content: 'Advanced techniques and hidden features that will take your workflow to the next level.',
      categories: ['Tips', 'Advanced'],
      tags: ['productivity', 'advanced'],
      media: stock.getRandomByTags(['people']),
    },
    {
      title: 'Product Update: New Features',
      subTitle: 'Latest Improvements and Additions',
      slug: 'product-updates',
      authors: [{ fullName: 'James Liu', title: 'Product Manager', email: 'james@example.com' }],
      content: 'Comprehensive overview of our latest feature releases and improvements.',
      categories: ['Updates', 'Features'],
      tags: ['new-features', 'product'],
      media: stock.getRandomByTags(['people']),
    },
    {
      title: 'Security Best Practices',
      subTitle: 'Keeping Your Data Safe',
      slug: 'security-practices',
      authors: [{ fullName: 'Emma Clark', title: 'Security Specialist', email: 'emma@example.com' }],
      content: 'Essential security guidelines and best practices for protecting your data.',
      categories: ['Security', 'Guide'],
      tags: ['security', 'best-practices'],
      media: stock.getRandomByTags(['people']),
    },
    {
      title: 'Community Spotlight',
      subTitle: 'Meet Our Power Users',
      slug: 'community-spotlight',
      authors: [{ fullName: 'David Kumar', title: 'Community Manager', email: 'david@example.com' }],
      content: 'Featuring outstanding members of our community and their innovative use cases.',
      categories: ['Community', 'Stories'],
      tags: ['community', 'spotlight'],
      media: stock.getRandomByTags(['people']),
    },
  ]

  // Different demo configurations to showcase layout possibilities
  return {
    schema,
    options,
    userConfig,
    demoPage: {
      cards: [
        // Scroll layout with varying proportions
        {
          templateId,
          userConfig: {
            display: { layout: 'scroll', size: 'expanded', proportions: 'tall' },
            posts: { format: 'local', limit: 6, entries: demoPosts },
          },
        },
        // Grid layout with regular sizing
        {
          templateId,
          userConfig: {
            display: { layout: 'grid', size: 'regular', proportions: 'medium', showExcerpt: true },
            posts: { format: 'local', limit: 3, entries: demoPosts },
          },
        },

        // Compact grid for news-style layout
        {
          templateId,
          userConfig: {
            display: { layout: 'grid', size: 'compact', proportions: 'short', itemsPerRow: 4 },
            posts: { format: 'local', limit: 8, entries: demoPosts },
          },
        },
        // Magazine-style mixed layout
        {
          templateId,
          userConfig: {
            display: { layout: 'grid', size: 'regular', proportions: 'wide', showExcerpt: true },
            posts: { format: 'standard', limit: 6 },
          },
        },
      ],
    },
  }
}
