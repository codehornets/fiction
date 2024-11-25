import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { getOptions as getHeroOptions, schema as heroSchema } from '../hero/config'

// Main tour schema
export const schema = z.object({
  items: z.array(heroSchema).describe('Your story chapters - each a unique visual narrative'),
})

export type HeroConfig = z.infer<typeof heroSchema>
export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: getHeroOptions() }),
]

// Create engaging demo content
async function getDemoContent(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  return {
    items: [
      {
        layout: 'right',
        title: 'Witness Your Vision Take Flight',
        subTitle: 'Watch as your ideas transform into stunning reality. Our intuitive platform empowers creators to build remarkable experiences with confidence.',
        superTitle: {
          text: 'Begin Your Journey',
          icon: { class: 'i-tabler-rocket' },
          theme: 'blue',
        },
        splash: stock.getRandomByTags(['aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomLeft', widthPercent: 25 },
          { media: stock.getRandomByTags(['abstract']), position: 'topRight', widthPercent: 25 },
        ],
        actions: [
          { label: 'Start Creating', theme: 'primary', design: 'solid' },
          { label: 'See Examples', theme: 'default', design: 'ghost' },
        ],
      },
      {
        layout: 'left',
        title: 'Craft Stories That Captivate',
        subTitle: 'Feel the difference as you shape narratives that resonate. Our tools help you create emotional connections that turn visitors into devoted followers.',
        superTitle: {
          text: 'Master Storytelling',
          icon: { class: 'i-tabler-brush' },
          theme: 'purple',
        },
        splash: stock.getRandomByTags(['object', 'aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomRight', widthPercent: 30 },
        ],
        actions: [
          { label: 'Explore Tools', theme: 'primary', design: 'solid' },
          { label: 'View Gallery', theme: 'default', design: 'ghost' },
        ],
      },
      {
        layout: 'center',
        title: 'Unleash Your Creative Power',
        subTitle: 'Experience the freedom to experiment boldly. Our platform gives you the confidence to push boundaries and create unforgettable digital experiences.',
        superTitle: {
          text: 'Limitless Creativity',
          icon: { class: 'i-tabler-sparkles' },
          theme: 'indigo',
        },
        splash: stock.getRandomByTags(['abstract', 'aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomLeft', widthPercent: 25 },
          { media: stock.getRandomByTags(['object']), position: 'topRight', widthPercent: 25 },
        ],
        actions: [
          { label: 'Get Started Now', theme: 'primary', design: 'solid' },
          { label: 'Watch Demo', theme: 'default', design: 'ghost' },
        ],
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const stock = await args.factory.getStockMedia()
  const demo = await getDemoContent({ ...args, stock })

  return {
    schema,
    options,
    userConfig: {
      items: [demo.items[0]], // Start with single compelling example
    },
    demoPage: {
      cards: [{ templateId: args.templateId, userConfig: demo }],
    },
  }
}
