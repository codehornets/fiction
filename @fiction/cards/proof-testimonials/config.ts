import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import type { text } from 'express'
import { MediaBasicSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { createStockMediaHandler } from '@fiction/ui/stock'
import { z } from 'zod'

// Schema Definitions
const TestimonialSchema = z.object({
  title: z.string().optional().describe('Achievement or key result that grabs attention'),
  content: z.string().describe('The authentic testimonial story'),
  href: z.string().optional().describe('Link to full case study or more information'),
  media: MediaBasicSchema.optional().describe('Visual elements that enhance the story'),
  user: z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    avatar: MediaBasicSchema.optional(),
    href: z.string().optional(),
  }).optional().describe('Details about who shared this testimonial'),
})

export type Testimonial = z.infer<typeof TestimonialSchema>

const schema = z.object({
  layout: z.enum(['slider', 'mega', 'masonry']).optional().describe('Choose how to showcase your testimonials:\n- Slider: Engaging horizontal storytelling\n- Mega: High-impact featured testimonial\n- Masonry: Rich visual collection'),
  items: z.array(TestimonialSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

// Input Configuration
const options: InputOption[] = [
  new InputOption({
    key: 'layout',
    label: 'Showcase Style',
    subLabel: 'See how each layout creates a different emotional impact',
    input: 'InputSelect',
    list: [
      { value: 'slider', label: 'Interactive Slider' },
      { value: 'mega', label: 'Feature Spotlight' },
      { value: 'masonry', label: 'Visual Collection' },
    ],
  }),
  new InputOption({
    input: 'InputList',
    key: 'items',
    label: 'Success Stories',
    subLabel: 'Share authentic experiences that build trust',
    props: { itemLabel: 'Story' },
    options: [
      new InputOption({
        key: 'title',
        label: 'Achievement Highlight',
        subLabel: 'What specific result or milestone was achieved?',
        input: 'InputText',
        placeholder: 'e.g., "10x Growth in 6 Months" or "Award Winner 2024"',
      }),
      new InputOption({
        key: 'content',
        label: 'Their Story',
        subLabel: 'Share the authentic experience in their words',
        input: 'InputTextarea',
        placeholder: 'Capture their genuine voice and specific results...',
      }),
      new InputOption({
        key: 'user.fullName',
        label: 'Name',
        subLabel: 'Who shared this story?',
        input: 'InputText',
      }),
      new InputOption({
        key: 'user.title',
        label: 'Role & Company',
        subLabel: 'Their professional context',
        input: 'InputText',
        placeholder: 'e.g., "CEO at TechCorp" or "Marketing Director"',
      }),
      new InputOption({
        key: 'user.avatar',
        label: 'Portrait',
        subLabel: 'A professional photo builds credibility',
        input: 'InputMedia',
      }),
      new InputOption({
        key: 'media',
        label: 'Visual Context',
        subLabel: 'Add impact with relevant imagery',
        input: 'InputMedia',
      }),
      new InputOption({
        key: 'href',
        label: 'Case Study Link',
        subLabel: 'Where can visitors learn more?',
        input: 'InputText',
        placeholder: 'URL to full success story',
      }),
    ],
  }),
]

async function getUserConfig(args: { stock: StockMedia }): Promise<UserConfig & SiteUserConfig> {
  const { stock } = args
  return {
    layout: 'slider', // Start with most engaging layout
    items: [
      {
        title: 'From Overwhelmed to Organized',
        content: 'Imagine going from scattered marketing efforts to a streamlined system that practically runs itself.',
        media: stock.getRandomByTags(['person', 'aspect:square']),
        user: {
          fullName: 'Dr. Maya Patel',
          avatar: stock.getRandomByTags(['person', 'aspect:square']),
          title: 'Wellness Enterprise Founder',
          href: '#case-study-maya',
        },
      },
      {
        title: 'Doubled Client Engagement',
        content: 'Watch how personalized storytelling changes everything. Since implementing Fiction\'s approach, our client engagement has doubled. ',
        media: stock.getRandomByTags(['person', 'aspect:square']),
        href: '#case-study-james',
        user: {
          fullName: 'James Chen',
          avatar: stock.getRandomByTags(['person', 'aspect:square']),
          title: 'Client Success Director',

        },
      },
      {
        title: '10X ROI on Marketing',
        content: 'Feel the impact of authentic connection. Using Fiction\'s storytelling framework, we\'ve achieved 10X ROI on our marketing investment.',
        media: stock.getRandomByTags(['person', 'aspect:landscape']),
        href: '#case-study-sofia',
        user: {
          fullName: 'Sofia Rodriguez',
          avatar: stock.getRandomByTags(['person', 'aspect:square']),
          title: 'Marketing Strategist',
        },
      },
      {
        title: 'From Local to Global Reach',
        content: 'Experience the power of strategic storytelling. Within months of implementing Fiction, we expanded from local markets to global opportunities.',
        media: stock.getRandomByTags(['person', 'aspect:landscape']),
        user: {
          fullName: 'Alex Foster',
          avatar: stock.getRandomByTags(['person', 'aspect:square']),
          title: 'Growth Director',
          href: '#case-study-alex',
        },
      },
    ],
  }
}

// Demo Configuration showing layout variations
export async function getConfig(args: { factory: CardFactory, templateId: string }){
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()
  const userConfig = await getUserConfig({ stock })

  return {
    schema,
    options,
    userConfig,
    demoPage: {
      cards: [
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'mega',
            standard: {
              headers: {
                superTitle: { text: 'High-Impact Stories' },
                title: 'Create Instant [text_effect]Credibility[/text_effect]',
                subTitle: 'Watch how the mega layout amplifies your most powerful customer stories. Perfect for featuring industry leaders or remarkable transformations.',
              },
            },
          },
        },
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'masonry',
            standard: {
              headers: {
                superTitle: { text: 'Social Proof at Scale' },
                title: 'Build a Wall of Trust',
                subTitle: 'Notice how multiple stories create an overwhelming sense of credibility. Ideal for showcasing diverse experiences and results.',
              },
            },
          },
        },
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'slider',
            standard: {
              headers: {
                superTitle: { text: 'Guided Discovery' },
                title: 'Tell Your Story Step by Step',
                subTitle: 'Experience how the slider layout creates a natural progression of trust. Perfect for walking prospects through a journey of transformation.',
              },
            },
          },
        },
      ],
    },
  }
}
