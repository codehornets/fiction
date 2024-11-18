import { MediaIconSchema, NavListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Define basic button schema for reuse
const ButtonSchema = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
  theme: z.string().optional(),
  icon: z.string().optional(),
  isNewsletter: z.boolean().optional(),
})

export const schema = z.object({
  kicker: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  benefitsTitle: z.string().optional(),
  benefits: z.array(NavListItemSchema).optional(),
  action: ButtonSchema.optional(),
  newsletterConfig: z.object({
    placeholder: z.string().optional(),
    buttonText: z.string().optional(),
    successMessage: z.string().optional(),
  }).optional(),
  media: z.object({
    url: z.string().optional(),
    alt: z.string().optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getDefaultConfig(): UserConfig {
  return {
    kicker: 'Weekly newsletter',
    title: 'Turn Your Vision Into a Lasting Legacy',
    description: 'Get the clarity and confidence to make decisions that echo through decades',
    benefitsTitle: 'Imagine yourself...',
    benefits: [
      {
        title: 'Spotting Hidden Opportunities',
        content: 'Identify emerging trends months before others catch on',
        media: { class: 'i-tabler-eye' },
      },
      {
        title: 'Building Your Authority',
        content: 'Build a name that carries weight in any room you enter',
        media: { class: 'i-tabler-chart-line' },
      },
      {
        title: 'Leading Others to Success',
        content: 'Make decisions today that shape your industry tomorrow',
        media: { class: 'i-tabler-compass' },
      },
    ],
    action: {
      label: 'Unlock insights',
      isNewsletter: true,
    },
    newsletterConfig: {
      placeholder: 'Enter your email',
      buttonText: 'Subscribe',
      successMessage: 'Thanks for subscribing!',
    },
  } as const
}

export function getOptions(): InputOption[] {
  return [
    // Content Section
    new InputOption({
      key: 'content',
      label: 'Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'kicker',
          label: 'Kicker Text',
          input: 'InputText',
          props: {
            placeholder: 'e.g., Weekly newsletter',
          },
        }),
        new InputOption({
          key: 'title',
          label: 'Main Heading',
          input: 'InputText',
          isRequired: true,
          props: {
            placeholder: 'Enter your main headline',
          },
        }),
        new InputOption({
          key: 'description',
          label: 'Description',
          input: 'InputTextarea',
          props: {
            placeholder: 'Describe your offer',
          },
        }),
      ],
    }),

    // Benefits Section
    new InputOption({
      key: 'benefits',
      label: 'Benefits',
      input: 'InputList',
      props: {
        itemName: 'Benefit',
        addButtonText: 'Add Benefit',
      },
      options: [
        new InputOption({
          key: 'title',
          label: 'Benefit Title',
          input: 'InputText',
        }),
        new InputOption({
          key: 'description',
          label: 'Benefit Description',
          input: 'InputText',
        }),
        new InputOption({
          key: 'icon',
          label: 'Icon',
          input: 'InputIcon',
        }),
      ],
    }),

    // Action Section
    new InputOption({
      key: 'action',
      label: 'Call to Action',
      input: 'group',
      options: [
        new InputOption({
          key: 'isNewsletter',
          label: 'Newsletter Signup',
          input: 'InputToggle',
          description: 'Enable newsletter signup form instead of button',
        }),
        new InputOption({
          key: 'label',
          label: 'Button Text',
          input: 'InputText',
        }),
        new InputOption({
          key: 'href',
          label: 'Button Link',
          input: 'InputUrl',
          description: 'Only needed if not using newsletter signup',
        }),
      ],
    }),

    // Newsletter Config
    new InputOption({
      key: 'newsletterConfig',
      label: 'Newsletter Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'placeholder',
          label: 'Input Placeholder',
          input: 'InputText',
        }),
        new InputOption({
          key: 'buttonText',
          label: 'Submit Button Text',
          input: 'InputText',
        }),
        new InputOption({
          key: 'successMessage',
          label: 'Success Message',
          input: 'InputText',
        }),
      ],
    }),
  ]
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    standard: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    minimal: {
      templateId,
      userConfig: {
        title: 'Join Our Community',
        description: 'Get weekly insights delivered straight to your inbox',
        action: {
          label: 'Subscribe Now',
          isNewsletter: true,
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
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
