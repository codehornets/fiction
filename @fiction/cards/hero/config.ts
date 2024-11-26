import type { CardFactory } from '@fiction/site/cardFactory'
import { actionAreaSchema, ActionButtonSchema, MediaBasicSchema, MediaIconSchema, superTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema for visual layer overlays that enhance the hero's depth
const LayerMediaScheme = z.object({
  media: z.object({ url: z.string().optional() }).optional(),
  opacity: z.number().optional(),
  position: z.enum(['top', 'bottom', 'left', 'right', 'center', 'bottomRight', 'topRight', 'bottomLeft', 'topLeft']).optional(),
  widthPercent: z.number().optional(),
})

// Core schema defining all hero section capabilities
export const schema = z.object({
  layout: z.enum(['justify', 'center', 'left', 'right']).optional().describe('Visual arrangement of content - affects text and image positioning'),
  title: z.string().optional().describe('Primary headline that captures attention (3-13 words) [ai]'),
  subTitle: z.string().optional().describe('Supporting message that explains your value proposition (10-30 words) [ai]'),
  superTitle: superTitleSchema.optional().describe('Eyebrow text with icon and color [ai]'),
  splash: MediaBasicSchema.optional().describe('Hero\'s focal image or illustration [ai]'),
  caption: z.string().optional().describe('Optional text description for the splash image'),
  action: actionAreaSchema.optional().describe('Primary call-to-action area'),
  overlays: z.array(LayerMediaScheme).optional().describe('Decorative image layers for visual depth [ai]'),
})

type UserConfig = z.infer<typeof schema>

// Default configuration showcasing best practices
const defaultContent: UserConfig = {
  title: 'Enter Your Title',
  subTitle: 'Write a sentence or two that adds context to your headline',
  action: {
    buttons: [],
  },
}

// Structured input options for the design interface
export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'content',
      label: 'Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Main Headline',
          input: 'InputText',
          description: 'Your primary message (3-13 words)',
          props: { placeholder: 'e.g., Transform Your Ideas Into Reality' },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Supporting Message',
          input: 'InputTextarea',
          description: 'Expand on your value proposition',
          props: { rows: 3, placeholder: 'Describe your core offering or unique value proposition' },
        }),
        new InputOption({
          key: 'superHeading',
          label: 'Eyebrow Text',
          input: 'InputText',
          description: 'Short text above headline (2-5 words)',
          props: { placeholder: 'e.g., New Release • Limited Time • Featured' },
        }),
      ],
    }),
    new InputOption({
      key: 'style',
      label: 'Style',
      input: 'group',
      options: [
        new InputOption({
          key: 'layout',
          label: 'Layout Style',
          input: 'InputSelect',
          props: {
            list: [
              { label: 'Centered Focus', value: 'center' },
              { label: 'Left Aligned', value: 'left' },
              { label: 'Right Aligned', value: 'right' },
              { label: 'Full Width', value: 'justify' },
            ],
          },
        }),
        new InputOption({
          key: 'superColor',
          label: 'Accent Color',
          input: 'InputColorScheme',
          description: 'Color theme for the eyebrow text',
        }),
        new InputOption({
          key: 'superIcon',
          label: 'Accent Icon',
          input: 'InputIcon',
          description: 'Icon to complement the eyebrow text',
        }),
      ],
    }),
    new InputOption({
      key: 'media',
      label: 'Media',
      input: 'group',
      options: [
        new InputOption({
          key: 'splash',
          label: 'Hero Image',
          input: 'InputMedia',
          description: 'Main visual element',
        }),
        new InputOption({
          key: 'caption',
          label: 'Image Caption',
          input: 'InputText',
          description: 'Optional descriptive text for the image',
        }),
      ],
    }),
    new InputOption({
      key: 'actions',
      label: 'Call-to-Action',
      input: 'InputActions',
      description: 'Buttons to drive user engagement',
    }),
  ]
}

// Demo configurations showing various use cases
async function getDemoPage(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const splash = (aspect: 'aspect:square' | 'aspect:portrait' = 'aspect:square') => stock.getRandomByTags(['object', aspect])

  const cards: { templateId: string, userConfig: UserConfig }[] = [
    // Product Launch Hero
    {
      templateId,
      userConfig: {
        layout: 'right',
        title: 'Revolutionize Your Workspace',
        subTitle: 'Experience the future of productivity with our AI-powered platform. Automate tasks, collaborate seamlessly, and achieve more in less time.',
        superTitle: { text: 'New Release', icon: { class: 'i-tabler-sparkles' }, theme: 'blue' },

        splash: splash('aspect:portrait'),
        action: {
          buttons: [
            { label: 'Start Free Trial', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'Watch Demo', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    // Service Showcase Hero
    {
      templateId,
      userConfig: {
        layout: 'left',
        title: 'Craft Your Perfect Digital Presence',
        subTitle: 'From stunning websites to powerful marketing tools, we provide everything you need to grow your online business and connect with your audience.',
        superTitle: { text: 'Professional Services', icon: { class: 'i-tabler-brush' }, theme: 'purple' },
        splash: splash('aspect:portrait'),
        action: {
          buttons: [
            { label: 'Explore Services', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'View Portfolio', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    // Event Promotion Hero
    {
      templateId,
      userConfig: {
        layout: 'center',
        title: 'Join the Future of Tech',
        subTitle: 'Be part of the largest virtual tech conference of 2024. Connect with industry leaders, discover emerging trends, and shape the future of technology.',
        superTitle: { text: 'Virtual Summit 2024', icon: { class: 'i-tabler-calendar-event' }, theme: 'indigo' },
        splash: splash(),
        action: {
          buttons: [
            { label: 'Register Now', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'View Schedule', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    {
      templateId,
      userConfig: defaultContent,
    },
  ]

  return {
    cards,
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options: getOptions(),
    userConfig: defaultContent,
    demoPage: await getDemoPage(args),
  }
}

export type { UserConfig }
export type OverlayConfig = z.infer<typeof LayerMediaScheme>
