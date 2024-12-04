import { navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const contactItemSchema = navListItemSchema.pick({
  label: true,
  value: true,
  href: true,
  icon: true,
})

const socialItemSchema = navListItemSchema.pick({
  label: true,
  href: true,
  icon: true,
})

// Main configuration schema
export const schema = z.object({
  layout: z.enum(['left', 'right', 'stacked']).optional().describe('Layout style - form position relative to contact details'),

  title: z.string().optional().describe('Main heading for the contact section'),

  subTitle: z.string().optional().describe('Supporting text below the main heading'),

  groups: z.array(z.object({
    title: z.string().optional().describe('Group header for related contact methods'),
    items: z.array(contactItemSchema).optional().describe('List of contact methods in this group'),
  })).optional().describe('Organized groups of contact information'),

  socials: z.array(socialItemSchema).optional().describe('List of social media links'),

  form: z.object({
    notifyEmails: z.array(z.object({ email: z.string().email() })).optional().describe('List of emails to notify when form is submitted'),
    redirectUrl: z.string().optional().describe('URL to redirect to after successful form submission'),
    successMessage: z.string().optional().describe('Message to show after successful submission'),
  }).optional().describe('Form submission settings'),
})

export type UserConfig = z.infer<typeof schema>

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'layout',
      label: 'Layout',
      input: 'InputSelect',
      props: {
        options: [
          { label: 'Form on Right', value: 'right' },
          { label: 'Form on Left', value: 'left' },
          { label: 'Stacked', value: 'stacked' },
        ],
      },
    }),

    new InputOption({
      key: 'content',
      label: 'Content',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Title',
          input: 'InputText',
          props: { placeholder: 'e.g., Get in Touch' },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Supporting Text',
          input: 'InputTextarea',
          props: { rows: 2 },
        }),
      ],
    }),

    new InputOption({
      key: 'groups',
      label: 'Contact Information',
      input: 'InputList',
      props: { itemLabel: 'Contact Group' },
      options: [
        new InputOption({
          key: 'title',
          label: 'Group Title',
          input: 'InputText',
        }),
        new InputOption({
          key: 'items',
          label: 'Contact Methods',
          input: 'InputList',
          props: { itemLabel: 'Contact Method' },
          options: [
            new InputOption({
              key: 'title',
              label: 'Label',
              input: 'InputText',
            }),
            new InputOption({
              key: 'content',
              label: 'Details',
              input: 'InputText',
            }),
            new InputOption({
              key: 'href',
              label: 'Action Link',
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
      key: 'social',
      label: 'Social Links',
      input: 'InputList',
      props: { itemLabel: 'Social Profile' },
      options: [
        new InputOption({
          key: 'name',
          label: 'Platform',
          input: 'InputText',
        }),
        new InputOption({
          key: 'handle',
          label: 'Username/Handle',
          input: 'InputText',
        }),
        new InputOption({
          key: 'href',
          label: 'Profile URL',
          input: 'InputUrl',
        }),
        new InputOption({
          key: 'media',
          label: 'Icon',
          input: 'InputIcon',
        }),
      ],
    }),

    new InputOption({
      key: 'form',
      label: 'Form Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'notifyEmails',
          label: 'Notification Emails',
          input: 'InputList',
          props: { itemLabel: 'Email' },
          options: [
            new InputOption({
              key: 'email',
              label: 'Email Address',
              input: 'InputEmail',
            }),
          ],
        }),
        new InputOption({
          key: 'redirectUrl',
          label: 'Redirect URL',
          input: 'InputUrl',
          description: 'Optional URL to redirect to after form submission',
        }),
        new InputOption({
          key: 'successMessage',
          label: 'Success Message',
          input: 'InputText',
          description: 'Message to show after successful submission',
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return {
    layout: 'right',
    title: 'Get in Touch',
    subTitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    groups: [
      {
        title: 'Contact Methods',
        items: [
          {
            label: 'Email',
            value: 'hello@example.com',
            href: 'mailto:hello@example.com',
            icon: { iconId: 'mail' },
          },
          {
            label: 'Phone',
            value: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
            icon: { iconId: 'phone' },
          },
        ],
      },
      {
        title: 'Location',
        items: [
          {
            label: 'Office',
            value: '123 Business Ave, Suite 100, City, ST 12345',
            href: 'https://maps.google.com',
            icon: { iconId: 'map' },
          },
          {
            label: 'Hours',
            value: 'Mon-Fri: 9AM-5PM EST',
            icon: { iconId: 'clock' },
          },
        ],
      },
    ],
    socials: [
      {
        label: '@company at LinkedIn',
        href: 'https://linkedin.com/company',
        icon: { iconId: 'brand-linkedin' },
      },
      {
        label: '@company at X',
        href: 'https://x.com/company',
        icon: { iconId: 'brand-x' },
      },
    ],
    form: {
      notifyEmails: [{ email: 'notifications@example.com' }],
      successMessage: 'Thank you! We\'ll be in touch soon.',
    },
  }
}

function getSupportConfig(): UserConfig {
  return {
    layout: 'left',
    title: '24/7 Customer Support',
    subTitle: 'Our support team is here to help you succeed. Get in touch through any of these channels.',
    groups: [
      {
        title: 'Immediate Assistance',
        items: [
          {
            label: 'Live Chat',
            value: 'Available 24/7',
            href: '#chat',
            icon: { iconId: 'message' },
          },
          {
            label: 'Support Email',
            value: 'support@example.com',
            href: 'mailto:support@example.com',
            icon: { iconId: 'mail' },
          },
        ],
      },
      {
        title: 'Help Center',
        items: [
          {
            label: 'Knowledge Base',
            value: 'Browse FAQs and Tutorials',
            href: '/help',
            icon: { iconId: 'book' },
          },
          {
            label: 'Community Forum',
            value: 'Connect with other users',
            href: '/community',
            icon: { iconId: 'user' },
          },
        ],
      },
    ],
    socials: [
      {
        label: '@example at Discord',
        href: 'https://discord.gg/example',
        icon: { iconId: 'brand-discord' },
      },
      {
        label: '@example at GitHub',
        href: 'https://github.com/example',
        icon: { iconId: 'brand-github' },
      },
    ],
    form: {
      notifyEmails: [{ email: 'support@example.com' }],
      successMessage: 'Support ticket created! We\'ll respond within 24 hours.',
    },
  }
}

function getEnterpriseConfig(): UserConfig {
  return {
    layout: 'stacked',
    title: 'Enterprise Sales',
    subTitle: 'Ready to scale? Our enterprise team is here to help you evaluate our enterprise plans and features.',
    groups: [
      {
        title: 'Sales Team',
        items: [
          {
            label: 'Schedule a Call',
            value: 'Book a consultation',
            href: '/schedule',
            icon: { iconId: 'calendar' },
          },
          {
            label: 'Enterprise Sales',
            value: 'enterprise@example.com',
            href: 'mailto:enterprise@example.com',
            icon: { iconId: 'briefcase' },
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            label: 'Case Studies',
            value: 'See customer success stories',
            href: '/case-studies',
            icon: { iconId: 'file' },
          },
          {
            label: 'Security',
            value: 'Review our security practices',
            href: '/security',
            icon: { iconId: 'shield' },
          },
        ],
      },
    ],
    socials: [
      {
        label: 'Follow us on LinkedIn',
        href: 'https://linkedin.com/company/example',
        icon: { iconId: 'brand-linkedin' },
      },
    ],
    form: {
      notifyEmails: [{ email: 'enterprise@example.com' }],
      successMessage: 'Thanks for your interest! Our enterprise team will contact you within 1 business day.',
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    support: {
      templateId,
      userConfig: getSupportConfig(),
    },
    enterprise: {
      templateId,
      userConfig: getEnterpriseConfig(),
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
