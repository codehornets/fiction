import { MediaBasicSchema, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets.js'

const templateId = 'capture'

const schema = z.object({
  superHeading: z.string().describe('Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"').optional(),
  heading: z.string().describe('Newsletter hook header 5 words or so').optional(),
  subHeading: z.string().describe('Specific benefits of subscribing').optional(),
  media: MediaBasicSchema.optional().describe('Image or video for the form'),
  presentationMode: z.enum(['inline', 'onScroll', 'onLoad']).optional(),
  buttonText: z.string().optional().describe('Text on the subscribe button'),
  thanksText: z.string().optional().describe('Text on the thank you message'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'presentationMode',
    label: 'Display Mode',
    input: 'InputSelect',
    list: ['inline', 'onScroll', 'onLoad'],
    description: 'Choose how to show your form: within content, as a scroll popup, or immediately on page load',
  }),
  standardOption.headers(),
  new InputOption({
    key: 'media',
    label: 'Featured Media',
    input: 'InputMedia',
  }),
  new InputOption({
    key: 'buttonText',
    label: 'Sign Up Button Text',
    input: 'InputText',
    placeholder: 'Get the Guide',
    description: 'Compelling call-to-action for your submit button',
  }),
  new InputOption({
    key: 'thanksText',
    label: 'Success Message',
    input: 'InputText',
    placeholder: 'Welcome aboard! Check your inbox.',
    description: 'Confirmation message after successful signup',
  }),
]

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  title: 'Capture',
  category: ['marketing'],
  description: 'Convert visitors into subscribers with a simple email capture form.',
  icon: 'i-tabler-mail',
  colorTheme: 'blue',
  isPublic: true,
  options,
  schema,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getUserConfig: async (args) => {
    const { getUserConfig } = await import('./config.js')
    return getUserConfig({ ...args, templateId })
  },
  demoPage: async (args) => {
    const { getDemo } = await import('./config.js')
    return getDemo({ ...args, templateId })
  },
})
