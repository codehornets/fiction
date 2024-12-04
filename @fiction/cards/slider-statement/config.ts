import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { actionAreaSchema, ActionButtonSchema, colorThemeUser } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Core schema for individual statement content
export const StatementSchema = z.object({
  title: z.string().optional().describe('The headline that captures attention (3-8 words) [ai]'),
  content: z.string().optional().describe('The main message that drives your point home'),
  action: actionAreaSchema.optional().describe('call-to-action area'),
})

export type Statement = z.infer<typeof StatementSchema>

// Main configuration schema
export const schema = z.object({
  items: z.array(StatementSchema).optional().describe('A series of powerful statements to showcase'),
  autoplay: z.boolean().optional().describe('Automatically transition between statements'),
  transition: z.enum(['fade', 'slide']).optional().describe('How statements transition'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

// Input configuration with intuitive labels and guidance
const options: InputOption[] = [
  new InputOption({
    input: 'InputList',
    key: 'items',
    label: 'Statement Slides',
    description: 'Create a sequence of impactful messages that tell your story',
    props: { itemLabel: 'Statement' },
    options: [
      new InputOption({
        key: 'title',
        label: 'Headline',
        input: 'InputText',
        description: 'Capture attention with a bold, clear message',
        placeholder: 'Transform Your Ideas Into Reality',
      }),
      new InputOption({
        key: 'content',
        label: 'Message',
        input: 'InputTextarea',
        description: 'Expand on your headline with compelling details',
        placeholder: 'Share the value you provide in 2-3 impactful sentences',
      }),
      new InputOption({
        key: 'actions',
        label: 'Call to Action',
        description: 'Guide visitors to take the next step',
        input: 'InputList',
        options: [
          new InputOption({ key: 'name', label: 'Button Text', input: 'InputText', placeholder: 'Get Started' }),
          new InputOption({ key: 'href', label: 'Link URL', input: 'InputUrl', placeholder: '/contact' }),
          new InputOption({ key: 'theme', label: 'Color Theme', input: 'InputSelect', list: colorThemeUser }),
          new InputOption({ key: 'design', label: 'Style', input: 'InputSelect', list: ['solid', 'outline', 'ghost'] }),
        ],
      }),
    ],
  }),
  new InputOption({
    key: 'autoplay',
    label: 'Auto-Advance',
    input: 'InputToggle',
    description: 'Automatically transition between statements',
  }),
  new InputOption({
    key: 'transition',
    label: 'Transition Effect',
    input: 'InputSelect',
    props: { list: ['fade', 'slide'] },
    description: 'Choose how statements transition',
  }),
]

// Default configuration shows best practices
export async function getUserConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        title: 'Transform Your Vision Into Reality',
        content: 'Notice how this statement immediately engages your audience with a powerful promise. Each word is chosen to create emotional impact and paint a picture of possibilities.',
        action: { buttons: [{ label: 'Start Your Journey', href: '#', theme: 'primary', design: 'solid' }] },
      },
      {
        title: 'See Your Impact Multiply',
        content: 'Feel the momentum build as each statement connects with your audience. This example shows how to maintain engagement through a story arc that builds excitement and trust.',
        action: { buttons: [{ label: 'Learn Our Method', href: '#', theme: 'primary', design: 'outline' }] },
      },
      {
        title: 'Become an Industry Leader',
        content: 'Imagine your message resonating with perfect clarity. This final statement demonstrates how to close with a compelling vision that motivates action.',
        action: { buttons: [{ label: 'Join Leading Brands', href: '#', theme: 'primary', design: 'ghost' }] },
      },
    ],
    transition: 'fade',
    autoplay: true,

  }
}

// Additional demo configurations showcase versatility
export async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    items: [
      {
        title: 'Revolutionize Your Customer Experience',
        content: 'Watch as our AI-powered platform transforms every interaction into an opportunity for growth. Our solutions have helped companies increase satisfaction by an average of 47%.',
        action: { buttons: [{ label: 'Schedule Demo', href: '#', theme: 'blue', design: 'solid' }] },
      },
      {
        title: 'Data-Driven Decisions Made Simple',
        content: 'Experience the clarity of seeing your entire business at a glance. Our intuitive dashboards turn complex data into actionable insights that drive growth.',
        action: { buttons: [{ label: 'Try It Free', href: '#', theme: 'emerald', design: 'solid' }] },
      },
    ],
    standard: {
      scheme: {
        base: {
          bg: {
            ...stock.getRandomByTags(['background']),
            overlay: {
              opacity: 80,
              color: 'black',
            },
          },
        },

      },

    },
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }){
  const { factory } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig(),
    demoPage: {
      cards: [
        { templateId: 'statement', userConfig: await getUserConfig() },
        { templateId: 'statement', userConfig: await getDemoConfig({ stock }) },
      ],
    },
  }
}
