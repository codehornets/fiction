import type { ConfigResponse } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionButtonSchema, MediaBasicSchema, MediaIconSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const schema = z.object({
  layout: z.enum(['accordion', 'toggle', 'visible']).optional().describe('Display style: accordion (one at a time), toggle (multiple), or visible (all shown)'),
  items: z.array(z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    icon: MediaIconSchema.optional(),
    media: MediaBasicSchema.optional(),
    isHighlighted: z.boolean().optional(),
  })).optional().describe('FAQ items with questions and detailed answers'),
  support: z.object({
    text: z.string().optional(),
    actions: z.array(ActionButtonSchema).optional(),
  }).optional().describe('Optional support section shown below FAQs'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'layout',
    label: 'Layout Style',
    input: 'InputRadio',
    props: {
      options: [
        { label: 'Accordion (Single)', value: 'accordion' },
        { label: 'Toggle (Multiple)', value: 'toggle' },
        { label: 'Visible (All)', value: 'visible' },
      ],
    },
  }),
  new InputOption({
    key: 'items',
    label: 'FAQ Items',
    input: 'InputList',
    props: { itemLabel: 'FAQ Item' },
    options: [
      new InputOption({
        key: 'title',
        label: 'Question/Title',
        input: 'InputText',
        props: { placeholder: 'What would you like to know?' },
      }),
      new InputOption({
        key: 'content',
        label: 'Answer/Content',
        input: 'InputTextarea',
        props: { rows: 3, placeholder: 'Provide a clear, engaging answer' },
      }),
      new InputOption({
        key: 'icon',
        label: 'Icon',
        input: 'InputIcon',
      }),
      new InputOption({
        key: 'media',
        label: 'Media',
        input: 'InputMedia',
      }),
      new InputOption({
        key: 'isHighlighted',
        label: 'Highlight Item',
        input: 'InputToggle',
      }),
    ],
  }),
  new InputOption({
    key: 'support',
    label: 'Support Section',
    input: 'InputControl',
    options: [
      new InputOption({
        key: 'text',
        label: 'Support Text',
        input: 'InputText',
        props: { placeholder: 'Need additional help?' },
      }),
      new InputOption({
        key: 'actions',
        label: 'Action Buttons',
        input: 'InputActions',
      }),
    ],
  }),
]

function getDefaultConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    layout: 'accordion',
    items: [
      {
        title: 'How can I make my FAQ section more engaging?',
        content: 'Imagine your FAQ as a friendly conversation guide. Notice how icons add visual interest, and see how highlighted items draw attention to key information. Try organizing questions from most to least common, and use clear, conversational language.',
        icon: { class: 'i-tabler-message-circle-2' },
        isHighlighted: true,
      },
      {
        title: 'Which FAQ layout should I choose?',
        content: 'Picture how your visitors will interact: Accordion keeps things compact, Toggle allows multiple open sections for comparison, while Visible displays everything at once. Consider your content length and user needs.',
        icon: { class: 'i-tabler-layout-grid' },
      },
      {
        title: 'Should I add media to my FAQ answers?',
        content: 'Visual elements can transform complex explanations. Notice how diagrams, screenshots, or illustrations make concepts clearer. Imagine your answer enhanced with a helpful visual guide.',
        icon: { class: 'i-tabler-photo' },
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
    support: { },
  }
}

function getDemoConfigs(args: { templateId: string, factory: CardFactory, stock: StockMedia }) {
  const { templateId, stock } = args
  const demos: Record<string, { templateId: string, userConfig: UserConfig }> = {
    product: {
      templateId,
      userConfig: {
        layout: 'accordion',
        items: [
          {
            title: 'What sets our AI platform apart?',
            content: 'Picture an AI assistant that truly understands your business context. See how it analyzes your data in real-time, suggesting optimizations you might have missed. Notice the seamless integration with your existing workflows.',
            icon: { class: 'i-tabler-brain' },
            isHighlighted: true,
            media: stock.getRandomByTags(['aspect:landscape']),
          },
          {
            title: 'How quickly can we get started?',
            content: 'Imagine being up and running in minutes, not weeks. Watch as your team adapts naturally to the intuitive interface. See your first insights emerge within hours of implementation.',
            icon: { class: 'i-tabler-rocket' },
          },
          {
            title: 'What about data security?',
            content: 'Envision your data protected by military-grade encryption. Notice how granular permissions give you complete control. Feel confident knowing every interaction is logged and monitored.',
            icon: { class: 'i-tabler-shield-lock' },
          },
        ],
        support: {
          text: 'Ready to see it in action?',
          actions: [
            {
              label: 'Watch Demo',
              theme: 'primary',
              icon: { class: 'i-tabler-player-play' },
            },
            {
              label: 'Book Consultation',
              theme: 'default',
              icon: { class: 'i-tabler-calendar' },
            },
          ],
        },
      },
    },
    help: {
      templateId,
      userConfig: {
        layout: 'visible',
        items: [
          {
            title: 'How do I create my first automation?',
            content: 'Follow along as we build your first workflow. Notice how the visual builder makes complex automations simple. See your productivity multiply as repetitive tasks become automated.',
            icon: { class: 'i-tabler-arrows-right-left' },
            media: stock.getRandomByTags(['aspect:landscape']),
          },
          {
            title: 'Can I customize the interface?',
            content: 'Imagine your perfect workspace. Drag and drop elements to match your workflow. Watch as your dashboard transforms to show exactly what you need, when you need it.',
            icon: { class: 'i-tabler-palette' },
          },
        ],
        support: {
          text: 'Looking for advanced customization?',
          actions: [
            {
              label: 'View API Docs',
              theme: 'primary',
              icon: { class: 'i-tabler-code' },
            },
          ],
        },
      },
    },
    troubleshoot: {
      templateId,
      userConfig: {
        layout: 'toggle',
        items: [
          {
            title: 'Why isn\'t my integration working?',
            content: 'Let\'s walk through common connection issues. First, check if you see the green status indicator. Notice any error messages in the logs. Watch how the system responds as we test the connection.',
            icon: { class: 'i-tabler-plug' },
            isHighlighted: true,
          },
          {
            title: 'How do I restore a backup?',
            content: 'Picture your data safely stored in our cloud. See how our time-machine interface lets you browse previous versions. Experience the peace of mind of one-click restoration.',
            icon: { class: 'i-tabler-clock' },
            media: stock.getRandomByTags(['aspect:landscape']),
          },
        ],
        support: {
          text: 'Need immediate assistance?',
          actions: [
            {
              label: 'Live Chat',
              theme: 'primary',
              icon: { class: 'i-tabler-message-circle' },
            },
          ],
        },
      },
    },
    default: {
      templateId,
      userConfig: getDefaultConfig({ stock }),
    },
  }

  return demos
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const defaultConfig = getDefaultConfig({ stock })
  return {
    schema,
    options,
    userConfig: defaultConfig,
    demoPage: {
      cards: Object.values(getDemoConfigs({ ...args, stock })),
    },
  }
}
