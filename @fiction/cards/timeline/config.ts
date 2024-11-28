import { MediaBasicSchema, MediaIconSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({

  style: z.object({
    layout: z.enum(['vertical', 'alternating', 'horizontal']).optional(),
    theme: z.enum(['minimal', 'cards', 'connected']).optional(),
    animation: z.enum(['fade', 'slide', 'none']).optional(),
  }).optional(),

  milestones: z.array(z.object({
    date: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    title: z.string().optional(),
    organization: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    achievements: z.array(z.string()).optional(),
    media: MediaBasicSchema.optional(),
    icon: MediaIconSchema.optional(),
    link: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'header',
      label: 'Header',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Title',
          input: 'InputText',
          props: {
            placeholder: 'e.g., Professional Journey',
          },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Subtitle',
          input: 'InputText',
          props: {
            placeholder: 'Brief description of your journey',
          },
        }),
        new InputOption({
          key: 'media',
          label: 'Header Image',
          input: 'InputMedia',
        }),
      ],
    }),

    new InputOption({
      key: 'style',
      label: 'Display Style',
      input: 'group',
      options: [
        new InputOption({
          key: 'layout',
          label: 'Layout',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Vertical', value: 'vertical' },
              { label: 'Alternating', value: 'alternating' },
              { label: 'Horizontal', value: 'horizontal' },
            ],
          },
        }),
        new InputOption({
          key: 'theme',
          label: 'Visual Theme',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Minimal', value: 'minimal' },
              { label: 'Cards', value: 'cards' },
              { label: 'Connected', value: 'connected' },
            ],
          },
        }),
        new InputOption({
          key: 'animation',
          label: 'Animation Style',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Fade In', value: 'fade' },
              { label: 'Slide In', value: 'slide' },
              { label: 'None', value: 'none' },
            ],
          },
        }),
      ],
    }),

    new InputOption({
      key: 'milestones',
      label: 'Career Milestones',
      input: 'InputList',
      props: {
        itemLabel: 'Milestone',
      },
      options: [
        new InputOption({
          key: 'date',
          label: 'Start Date',
          input: 'InputText',
          props: { placeholder: 'e.g., Jan 2020' },
        }),
        new InputOption({
          key: 'endDate',
          label: 'End Date',
          input: 'InputText',
          props: { placeholder: 'e.g., Present' },
        }),
        new InputOption({
          key: 'isCurrent',
          label: 'Current Position',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'title',
          label: 'Position Title',
          input: 'InputText',
          isRequired: true,
        }),
        new InputOption({
          key: 'organization',
          label: 'Organization',
          input: 'InputText',
        }),
        new InputOption({
          key: 'location',
          label: 'Location',
          input: 'InputText',
        }),
        new InputOption({
          key: 'description',
          label: 'Description',
          input: 'InputTextarea',
        }),
        new InputOption({
          key: 'achievements',
          label: 'Key Achievements',
          input: 'InputList',
          props: {
            itemLabel: 'Achievement',
          },
        }),
        new InputOption({
          key: 'media',
          label: 'Image',
          input: 'InputMedia',
        }),
        new InputOption({
          key: 'icon',
          label: 'Icon',
          input: 'InputIcon',
        }),
        new InputOption({
          key: 'link',
          label: 'Learn More URL',
          input: 'InputUrl',
        }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {

    style: {
      layout: 'vertical',
      theme: 'connected',
      animation: 'fade',
    },
    milestones: [
      {
        date: 'Jan 2023',
        endDate: 'Present',
        isCurrent: true,
        title: 'Senior Product Designer',
        organization: 'Innovation Labs',
        location: 'San Francisco, CA',
        description: 'Leading design initiatives for flagship products while mentoring junior designers.',
        achievements: [
          'Launched redesigned platform increasing user engagement by 45%',
          'Built and led a team of 5 designers',
          'Established new design system reducing development time by 30%',
        ],
        icon: { class: 'i-tabler-device-laptop' },
      },
      {
        date: 'Mar 2020',
        endDate: 'Dec 2022',
        title: 'UX Designer',
        organization: 'Tech Solutions Inc.',
        location: 'Austin, TX',
        description: 'Drove user experience improvements across mobile and web platforms.',
        achievements: [
          'Redesigned core user flows increasing conversion by 25%',
          'Led user research initiatives with over 500 participants',
        ],
        icon: { class: 'i-tabler-artboard' },
      },
      {
        date: 'Jun 2018',
        endDate: 'Feb 2020',
        title: 'Junior Designer',
        organization: 'Creative Agency',
        location: 'Portland, OR',
        description: 'Started career working on diverse client projects while developing core design skills.',
        achievements: [
          'Contributed to award-winning campaigns for major brands',
          'Mastered industry-standard design tools and workflows',
        ],
        icon: { class: 'i-tabler-brush' },
      },
    ],
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
        {
          templateId,
          userConfig: getDefaultConfig(),
        },
      ],
    },
  }
}
