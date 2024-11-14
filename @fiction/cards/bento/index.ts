import type { CardFactory } from '@fiction/site/cardFactory'
import { ActionButtonSchema, colorTheme, MediaDisplaySchema, MediaIconSchema, SizeSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { animate } from '@fiction/ui/anim/gradientUtil'
import { z } from 'zod'

const BentoItemSchema = z.object({
  cols: z.number().min(1).max(12).optional(),
  rows: z.number().min(1).max(12).optional(),
  superTitle: z.string().optional(),
  superIcon: MediaIconSchema.optional(),
  superColor: z.enum(colorTheme).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  media: MediaDisplaySchema.optional(),
  bg: MediaDisplaySchema.optional(),
  href: z.string().optional(),
  actions: z.array(ActionButtonSchema).optional(),
  theme: z.enum(colorTheme).optional(),
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

async function getDefaultConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const { factory } = args

  const uc: UserConfig = {
    animate: 'expand',
    gapSize: '2xl',
    items: [
      {
        cols: 12,
        rows: 4,
        title: 'Transform Your Digital Presence',
        content: 'Build stunning websites and powerful marketing campaigns with our comprehensive platform.',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        bg: {
          url: factory.stock.getRandomByTags(['person', 'aspect:landscape']).url,
          overlay: {
            opacity: 0.2,
          },
        },
      },
      {
        cols: 6,
        rows: 3,
        title: 'Design with Confidence',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.',
        theme: 'blue',
        themeMode: 'dark',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: {
            opacity: 0.4,
          },
        },
      },
      {
        cols: 3,
        rows: 3,
        title: 'Build Faster',
        superTitle: 'New',
        content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        theme: 'emerald',
        themeMode: 'light',
        media: factory.stock.getRandomByTags(['person']),
      },
      {
        cols: 3,
        rows: 3,
        title: 'Stay Focused',
        content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        theme: 'rose',
        themeMode: 'dark',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: {
            opacity: 0.5,
          },
        },
      },
      {
        cols: 4,
        rows: 2,
        title: 'Work Smarter',
        content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
        theme: 'amber',
        themeMode: 'light',
      },
      {
        cols: 4,
        rows: 2,
        title: 'Scale Better',
        content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.',
        theme: 'violet',
        themeMode: 'dark',
      },
      {
        cols: 4,
        rows: 2,
        title: 'Ship Reliably',
        superTitle: 'Featured',
        content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut.',
        theme: 'cyan',
        themeMode: 'dark',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: {
            opacity: 0.6,
          },
        },
      },
      // Hero bento - full width with left-aligned text
      {
        cols: 12,
        rows: 4,
        title: 'Transform Your Digital Presence',
        content: 'Build stunning websites and powerful marketing campaigns with our comprehensive platform.',
        theme: 'blue',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: { opacity: 0.2 },
        },
      },

      // Tall side panel with centered content
      {
        cols: 4,
        rows: 6,
        title: 'Discover More',
        content: 'Explore our extensive library of templates and tools designed to elevate your online presence.',
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
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: { opacity: 0.3 },
        },
      },

      // Wide but short banner with right-aligned text
      {
        cols: 8,
        rows: 2,
        title: 'Start Creating Today',
        superTitle: 'Limited Time',
        content: 'Join thousands of successful businesses who have already transformed their digital presence.',
        theme: 'rose',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'right',
        media: {
          displayWidthPercent: 15,
          format: 'html',
          html: `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 506.522"><path fill="currentColor" fill-rule="nonzero" d="M0 392.217h13.513c.973 17.285 6.086 29.337 15.338 36.153 9.251 6.818 23.98 10.226 44.188 10.226h99.697l-.73-24.468c-38.711-7.791-74.013-29.337-105.906-64.639-31.893-35.302-47.84-79.855-47.84-133.66 0-59.648 22.216-110.531 66.647-152.65C129.339 21.06 187.344.001 258.922 0c69.386.001 126.112 19.904 170.179 59.709 44.066 39.807 66.099 90.75 66.1 152.833-.001 50.397-13.695 93.185-41.084 128.365-27.39 35.18-64.457 59.587-111.201 73.221l-3.652 24.468h101.523c23.129 0 38.406-4.382 45.832-13.147 7.425-8.764 11.381-19.842 11.869-33.232H512v114.305H307.492l9.495-110.288c62.813-19.72 94.219-77.786 94.22-174.197-.001-63.056-15.399-111.383-46.197-144.981-30.798-33.598-66.891-50.396-108.28-50.397-44.066.001-80.525 17.834-109.375 53.501-28.85 35.667-43.275 81.256-43.275 136.764 0 40.172 6.452 76.752 19.355 109.741 12.904 32.989 37.615 56.178 74.134 69.569l6.939 110.288H0V392.217z"/></svg>`,
        },
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: { opacity: 0.4 },
        },
      },

      // Square feature with top-aligned text
      {
        cols: 4,
        rows: 4,
        title: 'AI-Powered Tools',
        superTitle: 'New Feature',
        content: 'Harness the power of artificial intelligence to create content that converts.',
        theme: 'violet',
        themeMode: 'light',
        verticalPosition: 'top',
        horizontalPosition: 'left',
      },
      {
        cols: 4,
        rows: 4,
        title: 'Global CDN',
        superTitle: 'Performance',
        theme: 'indigo',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },

      // Wide content panel with centered text
      {
        cols: 8,
        rows: 3,
        title: 'Enterprise Solutions',
        content: 'Scalable infrastructure designed for growing businesses. Deploy with confidence.',
        theme: 'green',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },

      // Small highlight boxes
      {
        cols: 4,
        rows: 3,
        title: '24/7 Support',
        superTitle: 'Always On',
        theme: 'cyan',
        themeMode: 'light',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
      },

      {
        cols: 2,
        rows: 2,
        title: '99.9% Uptime',
        superTitle: 'Reliable',
        theme: 'teal',
        themeMode: 'light',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },
      {
        cols: 2,
        rows: 2,
        title: '99.9% Happiness',
        superTitle: 'Satisfied',
        theme: 'green',
        themeMode: 'light',
        verticalPosition: 'top',
        horizontalPosition: 'center',
      },
      {
        cols: 2,
        rows: 2,
        title: '99.9% Success',
        superTitle: 'Results',
        theme: 'red',
        themeMode: 'light',
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
      {
        cols: 2,
        rows: 2,
        title: '99.9% Uptime',
        superTitle: 'Reliable',
        theme: 'rose',
        themeMode: 'light',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },
      {
        cols: 2,
        rows: 2,
        title: '99.9% Happiness',
        superTitle: 'Satisfied',
        theme: 'sky',
        themeMode: 'light',
        verticalPosition: 'top',
        horizontalPosition: 'center',
      },
      {
        cols: 2,
        rows: 2,
        title: '99.9% Success',
        superTitle: 'Results',
        theme: 'gray',
        themeMode: 'light',
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },

      // Full-width bottom banner with center-aligned text
      {
        cols: 12,
        rows: 3,
        title: 'Ready to Get Started?',
        content: 'Join over 10,000 businesses already using our platform to grow their online presence.',
        theme: 'purple',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: { opacity: 0.5 },
        },
      },

      // Extra tall showcase with bottom text
      {
        cols: 6,
        rows: 8,
        title: 'Built for Growth',
        content: 'Scale your business with confidence using our enterprise-grade infrastructure and tools.',
        theme: 'sky',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        bg: {
          url: factory.stock.getRandomByTags(['background']).url,
          overlay: { opacity: 0.3 },
        },
      },

      // Complementary panels
      {
        cols: 3,
        rows: 4,
        title: 'Analytics',
        content: 'Real-time insights into your business performance.',
        theme: 'fuchsia',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
      },
      {
        cols: 3,
        rows: 4,
        title: 'Security',
        content: 'Enterprise-grade protection for your data.',
        theme: 'green',
        themeMode: 'light',
        verticalPosition: 'top',
        horizontalPosition: 'right',
      },

    ],
  }

  return uc
}

export const template = cardTemplate({
  templateId: 'bento',
  category: ['layout', 'content'],
  description: 'Create a dynamic bento grid layout',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'violet',
  isPublic: true,
  schema,
  el: vue.defineAsyncComponent(async () => import('./ElBento.vue')),
  options,
  getUserConfig: async args => getDefaultConfig(args),
  demoPage: async (args) => {
    const uc = await getDefaultConfig(args)

    return { cards: [{ templateId: 'bento', userConfig: uc }] }
  },
})
