import { ActionButtonSchema, colorTheme, colorThemeUser, MediaDisplaySchema, MediaIconSchema, SizeSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'bento'

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

export const template = cardTemplate({
  templateId,
  category: ['layout', 'content'],
  description: 'Create a dynamic bento grid layout',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'violet',
  isPublic: true,
  schema,
  el: vue.defineAsyncComponent(async () => import('./ElBento.vue')),
  options,
  getUserConfig: async (args) => {
    const { getUserConfig } = await import('./config')
    return getUserConfig({ ...args, templateId })
  },
  demoPage: async (args) => {
    const { getDemo } = await import('./config')
    const demo = await getDemo({ templateId, ...args })

    return demo
  },
})
