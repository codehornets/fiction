import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'ticker'

const TickerSchema = z.object({
  // Content
  text: z.string().describe('The text to display in the ticker'),
  href: z.string().optional().describe('The URL to navigate to when the ticker is clicked'),

  // Animation
  speed: z.number().min(0).max(10).optional().describe('The speed of the scrolling text'),
  direction: z.enum(['left', 'right']).optional().describe('The direction of the ticker scroll'),

  // Appearance
  font: z.string().optional().describe('The google font family of the text'),
  bgColor: z.string().optional().describe('The color background of the ticker'),
  bgColorDark: z.string().optional().describe('The color background of the ticker in dark mode'),
  outline: z.boolean().optional().describe('Whether to add an outline to the text'),

  // 3D Transform
  rotateX: z.number().optional().describe('3D rotation around X-axis (degrees)'),
  rotateY: z.number().optional().describe('3D rotation around Y-axis (degrees)'),
  rotateZ: z.number().optional().describe('3D rotation around Z-axis (degrees)'),
})

export const UserConfigSchema = z.object({
  items: z.array(TickerSchema).describe('Array of ticker items [ai label=Tickers]').optional(),
  fontSize: z.number().min(5).max(15).optional().describe('The font size of the text'),
})

export type Ticker = z.infer<typeof TickerSchema>
export type UserConfig = z.infer<typeof UserConfigSchema>

const options: InputOption[] = [
  new InputOption({ key: 'fontSize', label: 'Font Size', input: 'InputRange', props: { min: 5, max: 15 } }),

  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'text', label: 'Text', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'Link URL', input: 'InputText' }),

      // Animation
      new InputOption({ key: 'speed', label: 'Speed', input: 'InputRange', props: { min: 0, max: 100 } }),
      new InputOption({ key: 'direction', label: 'Direction', input: 'InputSelect', props: { options: ['left', 'right'] } }),

      // Appearance
      new InputOption({ key: 'font', label: 'Font', input: 'InputFont' }),
      new InputOption({ key: 'bgColor', label: 'Background', input: 'InputColor' }),
      new InputOption({ key: 'bgColorDark', label: 'Background (Dark)', input: 'InputColor' }),
      new InputOption({ key: 'outline', label: 'Outline', input: 'InputToggle' }),

      // 3D Transform
      new InputOption({ key: 'rotateX', label: 'Tilt Forward/Back', input: 'InputRange', props: { min: -30, max: 30 } }),
      new InputOption({ key: 'rotateY', label: 'Tilt Left/Right', input: 'InputRange', props: { min: -30, max: 30 } }),
      new InputOption({ key: 'rotateZ', label: 'Rotate', input: 'InputRange', props: { min: -30, max: 30 } }),
    ],
  }),
]

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'Side-scrolling ticker of text and images.',
  icon: 'i-tabler-quote',
  colorTheme: 'green',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  isPublic: true,
  options,
  schema: UserConfigSchema,
  getUserConfig: async (args) => {
    const { getUserConfig } = await import('./config')

    return getUserConfig({ templateId, ...args })
  },
  demoPage: async (args) => {
    const { getDemo } = await import('./config')

    return getDemo({ templateId, ...args })
  },
})
