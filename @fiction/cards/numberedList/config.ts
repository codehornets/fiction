import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition
export const schema = z.object({
  layout: z.enum(['default', 'left', 'right']).optional(),
  title: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video', 'image']).optional(),
    url: z.string().optional(),
  }).optional(),
  items: z.array(z.object({
    content: z.string().optional(),
  })),
})

export type UserConfig = z.infer<typeof schema>

// Input options configuration remains the same
function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'layout',
      label: 'Layout Style',
      input: 'InputSelect',
      list: [
        { value: 'default', name: 'Grid Layout' },
        { value: 'left', name: 'Media Left' },
        { value: 'right', name: 'Media Right' },
      ],
    }),
    new InputOption({
      key: 'title',
      label: 'Section Title',
      input: 'InputText',
      isRequired: true,
    }),
    new InputOption({
      key: 'media',
      label: 'Featured Media',
      input: 'InputMedia',
      description: 'Optional media to accompany your content',
    }),
    new InputOption({
      key: 'items',
      label: 'List Items',
      input: 'InputList',
      options: [
        new InputOption({
          key: 'content',
          label: 'Content',
          input: 'InputTextarea',
          props: {
            rows: 3,
            placeholder: 'Enter your point here...',
          },
        }),
      ],
    }),
  ]
}

// Demo configurations
const demoConfigs = {
  // Default instructional example
  default: {
    title: 'Create Your Perfect Section',
    items: [
      { content: 'Start with a compelling headline that speaks directly to your audience\'s desires or pain points.' },
      { content: 'Use 4-5 concise bullet points that follow a clear pattern - each reinforcing your main message.' },
      { content: 'Add relevant imagery that emotionally connects with your audience when using side layouts.' },
      { content: 'End with a strong call-to-action point that motivates your reader to take the next step.' },
    ],
  },

  // Pattern: Problem → Solution with emotional triggers
  problems: {
    title: 'Is This Holding You Back?',
    layout: 'left',
    media: { format: 'image', tags: ['frustration', 'office', 'stress'] },
    items: [
      { content: 'Feel overwhelmed by constant changes in your industry? Imagine having a clear path forward.' },
      { content: 'Tired of watching competitors get ahead? Discover how to stand out authentically.' },
      { content: 'Struggling to reach the right audience? Learn to attract perfect-fit clients naturally.' },
      { content: 'Ready to stop playing small? It\'s time to amplify your true potential.' },
    ],
  },

  // Pattern: Future Pacing with benefits
  future: {
    title: 'Picture Your Success',
    layout: 'right',
    media: { format: 'image', tags: ['success', 'achievement', 'celebration'] },
    items: [
      { content: 'Watch as your influence grows and opportunities naturally come to you.' },
      { content: 'Experience the confidence of having a proven system working for you 24/7.' },
      { content: 'Feel the satisfaction of making a bigger impact while working less.' },
      { content: 'Join other successful professionals who\'ve already made this transformation.' },
    ],
  },

  // Pattern: Process steps with embedded commands
  process: {
    title: 'Your Path to Excellence',
    items: [
      { content: 'Start by discovering your unique advantage that sets you apart from the competition.' },
      { content: 'Notice how quickly your audience responds to your authentic message.' },
      { content: 'Realize that building authority becomes natural when you follow this system.' },
      { content: 'Understand that success comes from consistent, strategic action.' },
    ],
  },

  // Pattern: Social proof with presuppositions
  results: {
    title: 'Why Others Choose Us',
    layout: 'right',
    media: { format: 'image', tags: ['testimonial', 'client', 'meeting'] },
    items: [
      { content: 'Our clients already know the value of investing in their success story.' },
      { content: 'You\'ll appreciate how easily our system fits into your busy schedule.' },
      { content: 'Many professionals are surprised by how quickly they see results.' },
      { content: 'Your network will notice the difference in your professional presence.' },
    ],
  },
}

// Config getter function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  // Add stock images to configurations that need them
  const configsWithMedia = {
    ...demoConfigs,
    problems: {
      ...demoConfigs.problems,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
    future: {
      ...demoConfigs.future,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
    results: {
      ...demoConfigs.results,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
  }

  return {
    schema,
    options: getOptions(),
    userConfig: configsWithMedia.default,
    demoPage: {
      cards: [
        { templateId, userConfig: configsWithMedia.default },
        { templateId, userConfig: configsWithMedia.problems },
        { templateId, userConfig: configsWithMedia.future },
        { templateId, userConfig: configsWithMedia.process },
        { templateId, userConfig: configsWithMedia.results },
      ],
    },
  }
}
