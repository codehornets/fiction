import { ActionButtonSchema, colorThemeUser, MediaBasicSchema, MediaIconSchema, NavListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Updated schema with new structure
export const schema = z.object({

  title: z.string().optional(),
  subTitle: z.string().optional(),
  super: z.object({
    text: z.string().optional(),
    icon: MediaIconSchema.optional(),
    color: z.enum(colorThemeUser).optional(),
  }).optional(),
  benefits: z.object({
    title: z.string().optional(),
    items: z.array(NavListItemSchema).optional(),
  }).optional(),
  actions: z.object({
    type: z.enum(['buttons', 'subscribe']).optional(),
    buttons: z.array(ActionButtonSchema).optional(),
    subscribe: z.object({
      placeholder: z.string().optional(),
      buttonText: z.string().optional(),
      successTitle: z.string().optional(),
      successMessage: z.string().optional(),
    }).optional(),
  }).optional(),

  communityJoin: z.object({
    isEnabled: z.boolean().default(true),
    text: z.string().optional(),
    count: z.number().optional(),
    thumbCount: z.number().optional(),
  }).optional(),
  media: MediaBasicSchema.optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'content',
      label: 'Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'superTitle',
          label: 'Super Title',
          input: 'InputText',
          props: {
            placeholder: 'e.g., Weekly insights',
          },
        }),
        new InputOption({
          key: 'title',
          label: 'Main Title',
          input: 'InputText',
          isRequired: true,
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Sub Title',
          input: 'InputTextarea',
          props: {
            rows: 2,
          },
        }),
      ],
    }),

    new InputOption({
      key: 'benefits',
      label: 'Benefits',
      input: 'group',
      options: [
        new InputOption({
          key: 'benefitsTitle',
          label: 'Benefits Section Title',
          input: 'InputText',
        }),
        new InputOption({
          key: 'benefits',
          label: 'Benefit Items',
          input: 'InputList',
          props: {
            itemLabel: 'Benefit',
          },
          options: [
            new InputOption({
              key: 'title',
              label: 'Title',
              input: 'InputText',
              isRequired: true,
            }),
            new InputOption({
              key: 'content',
              label: 'Description',
              input: 'InputText',
            }),
            new InputOption({
              key: 'media',
              label: 'Icon',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),

    new InputOption({
      key: 'action',
      label: 'Call to Action',
      input: 'group',
      options: [
        new InputOption({
          key: 'actionType',
          label: 'Action Type',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Subscribe Form', value: 'subscribe' },
              { label: 'Button', value: 'button' },
            ],
          },
        }),
        new InputOption({
          key: 'subscribe',
          label: 'Subscribe Settings',
          input: 'InputControl',
          options: [
            new InputOption({
              key: 'placeholder',
              label: 'Input Placeholder',
              input: 'InputText',
            }),
            new InputOption({
              key: 'buttonText',
              label: 'Button Text',
              input: 'InputText',
            }),
            new InputOption({
              key: 'successTitle',
              label: 'Success Title',
              input: 'InputText',
            }),
            new InputOption({
              key: 'successMessage',
              label: 'Success Message',
              input: 'InputText',
            }),
          ],
        }),
      ],
    }),

    new InputOption({
      key: 'communityJoin',
      label: 'Community Bar',
      input: 'group',
      options: [
        new InputOption({
          key: 'isEnabled',
          label: 'Show Community Bar',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'text',
          label: 'Text',
          input: 'InputText',
        }),
        new InputOption({
          key: 'count',
          label: 'Member Count',
          input: 'InputNumber',
        }),
        new InputOption({
          key: 'thumbCount',
          label: 'Thumbnail Count',
          input: 'InputNumber',
          props: {
            min: 1,
            max: 5,
          },
        }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    super: {
      text: 'Customizable CTA Section',
      icon: { class: 'i-tabler-star' },
    },
    title: 'Design Your Perfect Call-to-Action',
    subTitle: 'This template helps you create compelling CTAs. Edit the content below to match your goals - whether it\'s growing your newsletter, showcasing benefits, or driving conversions.',

    benefits: {
      title: 'Key Benefits',
      items: [
        {
          title: 'Choose Your Action Type',
          content: 'Switch between email subscription and custom buttons',
          media: { class: 'i-tabler-adjustments' },
        },
        {
          title: 'Social Proof',
          content: 'Enable community bar to showcase your audience',
          media: { class: 'i-tabler-users-group' },
        },
        {
          title: 'Visual Hierarchy',
          content: 'Organize content with super title, main title, and subtitle',
          media: { class: 'i-tabler-layout-list' },
        },
      ],
    },
    actions: {
      type: 'subscribe',
      subscribe: {
        placeholder: 'Your email address',
        buttonText: 'Get Started',
        successTitle: 'Perfect!',
        successMessage: 'Watch your inbox for our welcome message',
      },
    },
    communityJoin: {
      isEnabled: true,
      text: 'already using this template',
      count: 1250,
      thumbCount: 3,
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    newsletter: {
      templateId,
      userConfig: {
        super: {
          text: 'Limited Time Offer',
          icon: { class: 'i-tabler-star' },
          color: 'orange',
        },
        title: 'Master the Art of Digital Marketing',
        subTitle: 'Join our premium newsletter and get battle-tested strategies that helped 100+ brands scale their online presence. Delivered fresh to your inbox every Tuesday.',
        benefits: {
          title: 'You\'ll Master:',
          items: [
            {
              title: 'Growth Psychology',
              content: 'Understand what makes audiences click, engage, and convert',
              media: { class: 'i-tabler-brain' },
            },
            {
              title: 'Content Alchemy',
              content: 'Transform simple ideas into magnetic content that attracts leads',
              media: { class: 'i-tabler-wand' },
            },
            {
              title: 'ROI Mastery',
              content: 'Maximize your marketing budget with data-driven decisions',
              media: { class: 'i-tabler-chart-dots' },
            },
          ],
        },
        actions: {
          type: 'subscribe',
          subscribe: {
            placeholder: 'Enter your email address',
            buttonText: 'Claim Your Spot',
            successTitle: 'Welcome to the inner circle!',
            successMessage: 'Your first strategy brief is on its way',
          },
        },
        communityJoin: {
          isEnabled: true,
          text: 'marketers growing their brands',
          count: 15430,
          thumbCount: 4,
        },
      },
    },
    saas: {
      templateId,
      userConfig: {
        super: {
          text: 'Power Up Your Workflow',
          icon: { class: 'i-tabler-bolt' },
          color: 'blue',
        },
        title: 'Your Team\'s Command Center',
        subTitle: 'Streamline collaboration, automate busywork, and watch your team\'s productivity soar. Built for modern teams who value efficiency.',
        benefits: {
          title: 'Platform Benefits:',
          items: [
            {
              title: 'Smart Automation',
              content: 'Save 15+ hours per week with AI-powered workflows',
              media: { class: 'i-tabler-robot' },
            },
            {
              title: 'Real-time Sync',
              content: 'Keep your team aligned with instant updates',
              media: { class: 'i-tabler-refresh' },
            },
            {
              title: 'Analytics Dashboard',
              content: 'Make data-driven decisions with powerful insights',
              media: { class: 'i-tabler-chart-bar' },
            },
          ],
        },
        actions: {
          type: 'buttons',
          buttons: [
            {
              name: 'Start Free Trial',
              theme: 'primary',
              icon: { class: 'i-tabler-rocket' },
            },
            {
              name: 'Watch Demo',
              theme: 'default',
              icon: { class: 'i-tabler-player-play' },
            },
          ],
        },
        communityJoin: {
          isEnabled: true,
          text: 'teams boosting productivity',
          count: 8750,
          thumbCount: 5,
        },
      },
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        ...Object.values(getDemoConfigs(templateId)),
      ],
    },
  }
}
