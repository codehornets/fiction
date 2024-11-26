import { actionAreaSchema, MediaBasicSchema, navListSchema, superTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Updated schema with new structure
export const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  superTitle: superTitleSchema.optional(),
  benefits: navListSchema.optional(),
  action: actionAreaSchema.optional(),
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
          key: 'superTitle.text',
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
    superTitle: {
      text: 'Customizable CTA Section',
      icon: { class: 'i-tabler-star' },
    },
    title: 'Design Your Perfect Call-to-Action',
    subTitle: 'This template helps you create compelling CTAs. Edit the content below to match your goals - whether it\'s growing your newsletter, showcasing benefits, or driving conversions.',

    benefits: {
      title: 'Key Benefits',
      items: [
        {
          label: 'Choose Your Action Type',
          description: 'Switch between email subscription and custom buttons',
          icon: { class: 'i-tabler-adjustments' },
        },
        {
          label: 'Social Proof',
          description: 'Enable community bar to showcase your audience',
          icon: { class: 'i-tabler-users-group' },
        },
        {
          label: 'Visual Hierarchy',
          description: 'Organize content with super title, main title, and subtitle',
          icon: { class: 'i-tabler-layout-list' },
        },
      ],
    },
    action: {
      variant: 'subscribe',
      subscribe: {
        placeholder: 'Your email address',
        button: { text: 'Get Started' },
        success: {
          title: 'Perfect!',
          message: 'Watch your inbox for our welcome message',
        },
      },
      proof: {
        community: {
          isEnabled: true,
          text: `join 1250+ others`,
          count: 1250,
          thumbCount: 3,
        },
      },
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
        superTitle: {
          text: 'Limited Time Offer',
          icon: { class: 'i-tabler-star' },
          theme: 'orange',
        },
        title: 'Master the Art of Digital Marketing',
        subTitle: 'Join our premium newsletter and get battle-tested strategies that helped 100+ brands scale their online presence. Delivered fresh to your inbox every Tuesday.',
        benefits: {
          title: 'You\'ll Master:',
          items: [
            {
              label: 'Growth Psychology',
              description: 'Understand what makes audiences click, engage, and convert',
              icon: { class: 'i-tabler-brain' },
            },
            {
              label: 'Content Alchemy',
              description: 'Transform simple ideas into magnetic content that attracts leads',
              icon: { class: 'i-tabler-wand' },
            },
            {
              label: 'ROI Mastery',
              description: 'Maximize your marketing budget with data-driven decisions',
              icon: { class: 'i-tabler-chart-dots' },
            },
          ],
        },
        action: {
          variant: 'subscribe',
          subscribe: {
            placeholder: 'Enter your email address',
            button: { text: 'Claim Your Spot' },
            success: {
              title: 'Success!',
              message: 'Check your inbox for a confirmation email',
            },
          },
          proof: {
            community: {
              isEnabled: true,
              text: 'marketers growing their brands',
              count: 15430,
              thumbCount: 4,
            },
          },

        },
      },
    },
    saas: {
      templateId,
      userConfig: {
        superTitle: {
          text: 'Power Up Your Workflow',
          icon: { class: 'i-tabler-bolt' },
          theme: 'blue',
        },
        title: 'Your Team\'s Command Center',
        subTitle: 'Streamline collaboration, automate busywork, and watch your team\'s productivity soar. Built for modern teams who value efficiency.',
        benefits: {
          title: 'Platform Benefits:',
          items: [
            {
              label: 'Smart Automation',
              description: 'Save 15+ hours per week with AI-powered workflows',
              icon: { class: 'i-tabler-robot' },
            },
            {
              label: 'Real-time Sync',
              description: 'Keep your team aligned with instant updates',
              icon: { class: 'i-tabler-refresh' },
            },
            {
              label: 'Analytics Dashboard',
              description: 'Make data-driven decisions with powerful insights',
              icon: { class: 'i-tabler-chart-bar' },
            },
          ],
        },
        action: {
          variant: 'buttons',
          buttons: [
            {
              label: 'Start Free Trial',
              theme: 'primary',
              icon: { class: 'i-tabler-rocket' },
            },
            {
              label: 'Watch Demo',
              theme: 'default',
              icon: { class: 'i-tabler-player-play' },
            },
          ],
          proof: {
            community: {
              isEnabled: true,
              text: 'teams boosting productivity',
              count: 8750,
              thumbCount: 5,
            },
          },
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
