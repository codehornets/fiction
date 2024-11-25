import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { createStockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'
import { getOptions as getHeroOptions, schema as heroSchema } from '../hero/config'

const templateId = 'tour'

const schema = z.object({
  items: z.array(heroSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: getHeroOptions() }),
]

async function defaultConfig(): Promise<UserConfig> {
  const stock = await createStockMediaHandler()
  const userConfig: UserConfig = {
    items: [
      {
        title: 'Catchy Headline',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stock.getRandomByTags(['object', 'aspect:landscape']),
        layout: 'left' as const,
        overlays: [
          { media: stock.getRandomByTags(['object', 'aspect:landscape']), position: 'bottomLeft' },
          { media: stock.getRandomByTags(['object', 'aspect:landscape']), position: 'topRight' },
        ],
        actions: [
          { label: 'View Projects', href: '#', theme: 'primary' },
          { label: 'Case Studies', href: '#', design: 'textOnly' },
        ],
        // content: 'Led brand refresh initiatives for Coca-Cola, Nintendo, and Burberry. These projects involved modernizing visual identities while preserving brand heritage, resulting in average engagement increases of 28% across campaigns.'
      },
      {
        title: 'Another Catchy Headline',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stock.getRandomByTags(['object', 'aspect:landscape']),
        layout: 'right' as const,
        overlays: [{ media: stock.getRandomByTags(['aspect:square']), position: 'bottomLeft' }],
        actions: [
          { label: 'Explore Work', href: '#', theme: 'primary' },
          { label: 'UX Insights', href: '#', theme: 'naked' as const },
        ],
        // content: 'Spearheaded UX/UI redesigns for Google, Spotify, and Amazon. Projects focused on enhancing user engagement, simplifying complex processes, and improving accessibility. Achieved an average 22% increase in user satisfaction scores.'
      },
      {
        title: 'Yet Another Catchy Headline',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stock.getRandomByTags(['background', 'aspect:landscape', 'video']),
        overlays: [
          { media: stock.getRandomByTags(['object', 'aspect:landscape']) },
          { media: stock.getRandomByTags(['object', 'aspect:square']), position: 'bottomLeft' },
          { media: stock.getRandomByTags(['object', 'aspect:portrait']), position: 'topRight', widthPercent: 15 },
        ],
        actions: [
          { label: 'View Campaigns', href: '#', theme: 'primary' },
          { label: 'Results & Metrics', href: '#', theme: 'naked' as const },
        ],
      //  content: 'Created and executed integrated marketing campaigns for Nike, Apple, and Starbucks. These campaigns spanned digital, print, and experiential mediums, driving brand awareness and sales. Notable achievements include a 45% boost in social media engagement for Nike and a 30% increase in product launch sales for Apple.'
      },
    ],
  }

  return userConfig
}

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A tour section with left and right hero images and text',
  icon: 'i-tabler-compass',
  colorTheme: 'green',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  schema,
  options,
  isPublic: true,
  getUserConfig: async () => defaultConfig(),
  demoPage: async () => {
    const userConfig = await defaultConfig()
    return {
      cards: [
        { templateId, userConfig },
      ],
    }
  },
})
