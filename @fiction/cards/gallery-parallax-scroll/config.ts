import type { ConfigResponse } from '@fiction/site/card.js'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, ActionButtonSchema, colorThemeUser, MediaBasicSchema, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const TrekItemSchema = z.object({
  title: z.string().optional().describe('Captivating headline that draws viewers into each section'),
  content: z.string().optional().describe('Evocative story that creates an emotional connection'),
  media: MediaBasicSchema.optional().describe('Stunning visuals that transport viewers into your world'),
  action: ActionAreaSchema.optional().describe('conversion actions like buttons or forms'),
  theme: z.enum(colorThemeUser).optional().describe('Visual mood and emotional tone for this section'),
  parallaxStrength: z.number().min(0).max(1).optional().describe('Visual depth intensity (0-1)'),
})

const schema = z.object({
  items: z.array(TrekItemSchema).optional().describe('Chapters in your visual story'),
  scrollSpeed: SizeSchema.optional().describe('Scrolling rhythm and flow'),
  transitionEffect: z.enum(['fade', 'slide', 'zoom']).optional().describe('Visual entrance style'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

const options: InputOption[] = [
  new InputOption({
    key: 'items',
    label: 'Story Chapters',
    input: 'InputList',
    props: { itemLabel: 'Chapter' },
    options: [
      new InputOption({
        key: 'title',
        label: 'Headline',
        input: 'InputText',
        description: 'Visualize a headline that instantly grabs attention',
        placeholder: 'e.g., "Feel the Adventure" or "Discover Wonder"',
      }),
      new InputOption({
        key: 'content',
        label: 'Narrative',
        input: 'InputTextarea',
        description: 'Paint a vivid picture that resonates with your audience',
        placeholder: 'Transport your readers into the moment...',
      }),
      new InputOption({
        key: 'media',
        label: 'Visual Impact',
        input: 'InputMedia',
        description: 'Select imagery that stirs emotions and creates atmosphere',
      }),
      new InputOption({
        key: 'actions',
        label: 'Engagement Triggers',
        input: 'InputActions',
        description: 'Create momentum with perfectly-timed calls to action',
      }),
      new InputOption({
        key: 'parallaxStrength',
        label: 'Depth Effect',
        input: 'InputRange',
        props: { min: 0, max: 1, step: 0.1, description: 'Feel how the depth changes as you adjust' },
      }),
    ],
  }),
  new InputOption({
    key: 'transitionEffect',
    label: 'Movement Style',
    input: 'InputSelect',
    props: {
      list: ['fade', 'slide', 'zoom'],
      description: 'Watch how each section enters the viewport',
    },
  }),
  new InputOption({
    key: 'scrollSpeed',
    label: 'Flow Control',
    input: 'InputSelect',
    props: {
      list: ['sm', 'md', 'lg'],
      description: 'Experience different scrolling rhythms',
    },
  }),
]

async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    transitionEffect: 'fade',
    scrollSpeed: 'md',
    items: [
      {
        title: 'Watch Your Story Come Alive',
        content: 'Notice how the background responds to your scrolling? This dynamic parallax effect instantly elevates your content, creating an immersive experience that keeps visitors engaged. Try adjusting the depth effect to find your perfect balance.',
        parallaxStrength: 0.5,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [{ label: 'Start Creating', theme: 'primary' }],
        },
      },
      {
        title: 'See Perfect Content Placement',
        content: 'Feel how smoothly your content stays in view while captivating visuals flow behind it? This creates a natural reading rhythm that guides visitors through your story. Position your key messages for maximum impact.',
        parallaxStrength: 0.4,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [{ label: 'Learn More', theme: 'default', design: 'outline' }],
        },
      },
      {
        title: 'Transform Visitors Into Action',
        content: 'Imagine your calls-to-action appearing at exactly the right moment - when engagement is at its peak. Strategic button placement turns captivated viewers into active participants in your story.',
        parallaxStrength: 0.6,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          variant: 'subscribe',
        },
      },
    ],
  }
}

async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    transitionEffect: 'fade',
    scrollSpeed: 'md',
    items: [
      {
        title: 'Step Into Paradise',
        content: 'Feel the gentle breeze as you discover pristine beaches where turquoise waters meet powder-soft sand. Every scroll reveals another breathtaking vista, carefully crafted to transport you into this island sanctuary.',
        parallaxStrength: 0.5,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Book Your Escape', theme: 'primary' },
            { label: 'View Gallery', theme: 'default', design: 'outline' },
          ],
        },
      },
      {
        title: 'Taste Culinary Excellence',
        content: 'Immerse yourself in a world where traditional flavors meet modern mastery. Watch as our chefs transform local ingredients into artistic presentations that delight all your senses.',
        parallaxStrength: 0.4,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Explore Menu', theme: 'emerald' },
          ],
        },
      },
      {
        title: 'Experience Timeless Luxury',
        content: 'Discover where sophistication meets serenity in our carefully curated suites. Feel the perfect harmony of modern comfort and natural beauty as you scroll through our virtual tour.',
        parallaxStrength: 0.6,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Reserve Now', theme: 'primary' },
            { label: 'View Amenities', theme: 'default', design: 'outline' },
          ],
        },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()
  const defaultUserConfig = await getDefaultConfig({ stock })
  return {
    schema,
    options,
    userConfig: defaultUserConfig,
    demoPage: {
      cards: [
        { templateId, userConfig: await getDemoConfig({ stock }) },
        { templateId, userConfig: { standard: {
          headers: {
            title: 'A Visual Journey',
            subTitle: 'Discover the power of parallax storytelling',
          },
        }, ...defaultUserConfig } },
      ],
    },
  }
}
