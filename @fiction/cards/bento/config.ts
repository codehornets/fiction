import type { ConfigResponse } from '@fiction/site/card.js'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { ActionButtonSchema, colorTheme, colorThemeUser, MediaDisplaySchema, MediaIconSchema, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const BentoItemSchema = z.object({
  cols: z.number().min(1).max(12).optional(),
  rows: z.number().min(1).max(12).optional(),
  superTitle: z.string().optional(),
  superIcon: MediaIconSchema.optional(),
  superColor: z.enum(colorThemeUser).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  media: MediaDisplaySchema.optional(),
  bg: MediaDisplaySchema.optional(),
  href: z.string().optional(),
  actions: z.array(ActionButtonSchema).optional(),
  theme: z.enum(colorThemeUser).optional(),
  themeMode: z.enum(['light', 'dark', 'auto']).optional(),
  verticalPosition: z.enum(['top', 'center', 'bottom']).optional(),
  horizontalPosition: z.enum(['left', 'center', 'right']).optional(),
})

const schema = z.object({
  items: z.array(BentoItemSchema),
  gapSize: SizeSchema.optional(),
  animate: z.enum(['expand', 'swipe', '']).optional(),
})

export type BentoItem = z.infer<typeof BentoItemSchema>
export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'items',
    label: 'Bento Items',
    input: 'InputList',
    options: [
      new InputOption({ key: 'cols', label: 'Columns', input: 'InputNumber', props: { min: 1, max: 12 } }),
      new InputOption({ key: 'rows', label: 'Rows', input: 'InputNumber', props: { min: 1, max: 12 } }),
      new InputOption({ key: 'superTitle', label: 'Super Title', input: 'InputText' }),
      new InputOption({ key: 'superIcon', label: 'Super Icon', input: 'InputIcon' }),
      new InputOption({ key: 'superColor', label: 'Super Color', input: 'InputSelect', props: { list: colorTheme } }),
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputTextarea' }),
      new InputOption({ key: 'actions', label: 'Actions', input: 'InputActions' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
      new InputOption({ key: 'bg', label: 'Background', input: 'InputMedia', props: { isBackground: true } }),
      new InputOption({ key: 'href', label: 'Link URL', input: 'InputUrl' }),
      new InputOption({ key: 'theme', label: 'Theme', input: 'InputSelect', props: { list: colorTheme } }),
      new InputOption({ key: 'themeMode', label: 'Theme Mode', input: 'InputSelect', props: { list: ['light', 'dark', 'auto'] } }),
      new InputOption({ key: 'verticalPosition', label: 'Vertical Position', input: 'InputSelect', props: { list: ['top', 'center', 'bottom'] } }),
      new InputOption({ key: 'horizontalPosition', label: 'Horizontal Position', input: 'InputSelect', props: { list: ['left', 'center', 'right'] } }),
    ],
  }),
  new InputOption({ key: 'gapSize', label: 'Gap', input: 'InputSelect', props: { list: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] } }),
  new InputOption({ key: 'animate', label: 'Animation', input: 'InputSelect', props: { list: ['expand', 'swipe'] } }),
]

export async function getUserConfig(args: { factory: CardFactory, templateId: string, stock: StockMedia }): Promise<UserConfig> {
  const { factory, stock } = args
  const actions = [
    { name: 'Learn More', href: '#', design: 'solid' as const },
    { name: 'Get Started', href: '#' },
  ]
  return {
    items: [
      {
        cols: 4,
        rows: 2,
        title: 'Feature Title Here',
        superTitle: 'Badge Text', // Optional upper badge/label
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        actions,
      },
      {
        cols: 4,
        rows: 2,
        title: 'Second Feature',
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        actions,
      },
      {
        cols: 4,
        rows: 2,
        title: 'Third Feature',
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        actions,
      },
      {
        cols: 12,
        rows: 2,
        title: 'Card With Media',
        content: 'Add media or background images to create visual interest.',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.4 }, // Adjust overlay opacity: 0-1
        },
        verticalPosition: 'center', // Try: top, center, bottom
        horizontalPosition: 'center', // Try: left, center, right
        actions,
      },
    ],
  }
}

export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { factory, stock } = args

  const uc: UserConfig = {
    animate: 'expand',
    gapSize: 'lg',
    items: [
      {
        cols: 12,
        rows: 4,
        superTitle: 'Welcome',
        title: 'Where Vision Meets Reality',
        content: 'Some see boundaries. Others see infinite possibilities. Which one are you?',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        bg: {
          ...stock.getRandomByTags(['person', 'aspect:landscape']),
          overlay: { opacity: 0.2 },
        },
      },
      {
        cols: 6,
        rows: 3,
        title: 'Craft the Extraordinary',
        content: 'In a world of templates and trends, dare to create something that\'s unmistakably yours.',
        theme: 'blue',
        themeMode: 'dark',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.4 },
        },
      },
      {
        cols: 3,
        rows: 3,
        title: 'Think Faster',
        superTitle: 'New',
        content: 'When seconds count and ideas flow, you need tools that keep up with your imagination.',
        theme: 'emerald',
        themeMode: 'light',
        media: stock.getRandomByTags(['person']),
      },
      {
        cols: 3,
        rows: 3,
        title: 'Stay Curious',
        content: 'The best discoveries happen when you venture beyond the familiar.',
        theme: 'rose',
        themeMode: 'dark',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.5 },
        },
      },
      {
        cols: 4,
        rows: 2,
        title: 'Work Brilliantly',
        content: 'Transform complexity into clarity. Turn challenges into achievements.',
        theme: 'amber',
        themeMode: 'light',
      },
      {
        cols: 4,
        rows: 2,
        title: 'Scale Seamlessly',
        content: 'From spark to wildfire, grow without growing pains.',
        theme: 'violet',
        themeMode: 'dark',
      },
      {
        cols: 4,
        rows: 2,
        title: 'Launch Confidently',
        superTitle: 'Featured',
        content: 'Because great ideas deserve their moment in the spotlight.',
        theme: 'cyan',
        themeMode: 'dark',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.6 },
        },
      },
      {
        cols: 12,
        rows: 4,
        title: 'Rewrite the Rules',
        content: 'In a world of followers, be the one who charts the course.',
        theme: 'blue',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.2 },
        },
      },
      {
        cols: 4,
        rows: 6,
        title: 'Explore Further',
        content: 'Every great achievement started with a single step into the unknown.',
        theme: 'emerald',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        media: {
          displayWidthPercent: 25,
          format: 'html',
          html: `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 506.522"><path fill="currentColor" fill-rule="nonzero" d="M0 392.217h13.513c.973 17.285 6.086 29.337 15.338 36.153 9.251 6.818 23.98 10.226 44.188 10.226h99.697l-.73-24.468c-38.711-7.791-74.013-29.337-105.906-64.639-31.893-35.302-47.84-79.855-47.84-133.66 0-59.648 22.216-110.531 66.647-152.65C129.339 21.06 187.344.001 258.922 0c69.386.001 126.112 19.904 170.179 59.709 44.066 39.807 66.099 90.75 66.1 152.833-.001 50.397-13.695 93.185-41.084 128.365-27.39 35.18-64.457 59.587-111.201 73.221l-3.652 24.468h101.523c23.129 0 38.406-4.382 45.832-13.147 7.425-8.764 11.381-19.842 11.869-33.232H512v114.305H307.492l9.495-110.288c62.813-19.72 94.219-77.786 94.22-174.197-.001-63.056-15.399-111.383-46.197-144.981-30.798-33.598-66.891-50.396-108.28-50.397-44.066.001-80.525 17.834-109.375 53.501-28.85 35.667-43.275 81.256-43.275 136.764 0 40.172 6.452 76.752 19.355 109.741 12.904 32.989 37.615 56.178 74.134 69.569l6.939 110.288H0V392.217z"/></svg>`,
        },
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.3 },
        },
      },
      {
        cols: 8,
        rows: 2,
        title: 'Begin Your Journey',
        superTitle: 'Limited Time',
        content: 'The perfect moment exists only in hindsight. Start now.',
        theme: 'rose',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.4 },
        },
      },
      {
        cols: 4,
        rows: 4,
        title: 'Think Smarter',
        superTitle: 'New Feature',
        content: 'Let intuition guide you. Let innovation define you.',
        theme: 'violet',
        themeMode: 'light',
        verticalPosition: 'top',
        horizontalPosition: 'left',
      },
      {
        cols: 8,
        rows: 3,
        title: 'Dream Bigger',
        content: 'The ceiling of yesterday becomes the floor of tomorrow.',
        theme: 'green',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },
      {
        cols: 4,
        rows: 3,
        title: 'Always Here',
        superTitle: 'Committed',
        theme: 'cyan',
        themeMode: 'light',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
      },
      // Stats tiles with more engaging metrics
      {
        cols: 2,
        rows: 2,
        title: 'Endless Potential',
        superTitle: 'Limitless',
        theme: 'teal',
        themeMode: 'light',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },
      {
        cols: 12,
        rows: 3,
        title: 'Ready to Write Your Story?',
        content: 'Every breakthrough starts with a decision to try something new.',
        theme: 'purple',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.5 },
        },
      },
      {
        cols: 6,
        rows: 8,
        title: 'Built for Dreamers',
        content: 'Because the most extraordinary achievements begin with impossible ideas.',
        theme: 'sky',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        bg: {
          ...stock.getRandomByTags(['background']),
          overlay: { opacity: 0.3 },
        },
      },
    ],
  }

  return uc
}

export async function getDemo(args: { factory: CardFactory, templateId: string, stock: StockMedia }) {
  const { templateId, stock } = args
  const uc = await getDemoUserConfig({ ...args, stock })
  return { cards: [{ templateId, userConfig: uc }] }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }): Promise<ConfigResponse> {
  const stock = await args.factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig({ ...args, stock }),
    demoPage: await getDemo({ ...args, stock }),
  }
}
