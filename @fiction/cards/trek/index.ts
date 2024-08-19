import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'trek'

const schema = z.object({
  items: z.array(z.object({
    header: z.string().optional(),
    subHeader: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      video: z.string().optional(),
      format: z.enum(['url', 'video']).optional(),
    }).optional(),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      btn: z.enum(['primary', 'default', 'minimal']).optional(),
    })).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [
    new InputOption({ key: 'header', label: 'Header', input: 'InputText' }),
    new InputOption({ key: 'subHeader', label: 'Sub Header', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMediaDisplay' }),
  ] }),
]

async function defaultConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        header: `Meet Tom`,
        subHeader: `Visionary Creative Director shaping brand narratives.`,
        media: { url: 'https://videos.pexels.com/video-files/7251409/7251409-uhd_1440_2560_25fps.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: '#' }],
      },
      {
        header: `NYC Creative Director`,
        subHeader: `Tom's work has been featured in the New York Times.`,
        media: { url: `https://videos.pexels.com/video-files/5828488/5828488-uhd_1440_2560_24fps.mp4`, format: 'video' },

        actions: [{ name: 'Learn More', href: '#' }],
      },
      {
        header: 'The Williams Exhibit',
        subHeader: 'Check out Tom\'s latest exhibit at the Williams Gallery.',
        media: { url: 'https://videos.pexels.com/video-files/1713836/1713836-hd_1080_1920_30fps.mp4', format: 'video' },

      },
      {
        header: `Let's Connect`,
        subHeader: `Tom is always looking for new collaborators. Reach out to him today.`,
        media: { url: 'https://videos.pexels.com/video-files/1884287/1884287-hd_720_1280_30fps.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: '#' }],
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content'],
    description: 'A tour card with sticky content and parallaxed images',
    icon: 'i-tabler-compass',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    schema,
    isPublic: false,
    getBaseConfig: () => {
      return { standard: { spacing: { contentWidth: 'none' } } }
    },
    getUserConfig: async () => defaultConfig(),
    demoPage: async () => {
      const userConfig = await defaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
