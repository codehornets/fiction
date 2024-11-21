import { MediaIconSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema for contact details
export const ContactItemSchema = z.object({
  title: z.string().optional().describe('Label for the contact method'),
  content: z.string().optional().describe('The contact information or details'),
  href: z.string().optional().describe('Action link (tel:, mailto:, etc)'),
  media: MediaIconSchema.optional().describe('Icon representing the contact method'),
})

// Main configuration schema
export const schema = z.object({
  layout: z.enum(['left', 'right', 'stacked']).optional().describe('Layout style - form position relative to contact details'),

  title: z.string().optional().describe('Main heading for the contact section'),

  subtitle: z.string().optional().describe('Supporting text below the main heading'),

  groups: z.array(z.object({
    title: z.string().optional().describe('Group header for related contact methods'),
    items: z.array(ContactItemSchema).optional().describe('List of contact methods in this group'),
  })).optional().describe('Organized groups of contact information'),

  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (name)'),
    href: z.string().optional().describe('Full link for href'),
    media: MediaIconSchema.optional().describe('icon reference associated with the social media name (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),

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
          key: 'subtitle',
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
    subtitle: 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    groups: [
      {
        title: 'Contact Methods',
        items: [
          {
            title: 'Email',
            content: 'hello@example.com',
            href: 'mailto:hello@example.com',
            media: { iconId: 'email' },
          },
          {
            title: 'Phone',
            content: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
            media: { iconId: 'phone' },
          },
        ],
      },
      {
        title: 'Location',
        items: [
          {
            title: 'Office',
            content: '123 Business Ave, Suite 100, City, ST 12345',
            href: 'https://maps.google.com',
            media: { iconId: 'map' },
          },
          {
            title: 'Hours',
            content: 'Mon-Fri: 9AM-5PM EST',
            media: { iconId: 'clock' },
          },
        ],
      },
    ],
    socials: [
      {
        name: '@company at LinkedIn',
        href: 'https://linkedin.com/company',
        media: { iconId: 'linkedin' },
      },
      {
        name: '@company at X',
        href: 'https://x.com/company',
        media: { iconId: 'x' },
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
    subtitle: 'Our support team is here to help you succeed. Get in touch through any of these channels.',
    groups: [
      {
        title: 'Immediate Assistance',
        items: [
          {
            title: 'Live Chat',
            content: 'Available 24/7',
            href: '#chat',
            media: { iconId: 'chat' },
          },
          {
            title: 'Support Email',
            content: 'support@example.com',
            href: 'mailto:support@example.com',
            media: { iconId: 'email' },
          },
        ],
      },
      {
        title: 'Help Center',
        items: [
          {
            title: 'Knowledge Base',
            content: 'Browse FAQs and Tutorials',
            href: '/help',
            media: { iconId: 'book' },
          },
          {
            title: 'Community Forum',
            content: 'Connect with other users',
            href: '/community',
            media: { iconId: 'user' },
          },
        ],
      },
    ],
    socials: [
      {
        name: '@example at Discord',
        href: 'https://discord.gg/example',
        media: { iconId: 'discord' },
      },
      {
        name: '@example at GitHub',
        href: 'https://github.com/example',
        media: { iconId: 'github' },
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
    subtitle: 'Ready to scale? Our enterprise team is here to help you evaluate our enterprise plans and features.',
    groups: [
      {
        title: 'Sales Team',
        items: [
          {
            title: 'Schedule a Call',
            content: 'Book a consultation',
            href: '/schedule',
            media: { iconId: 'calendar' },
          },
          {
            title: 'Enterprise Sales',
            content: 'enterprise@example.com',
            href: 'mailto:enterprise@example.com',
            media: { iconId: 'briefcase' },
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            title: 'Case Studies',
            content: 'See customer success stories',
            href: '/case-studies',
            media: { iconId: 'file-text' },
          },
          {
            title: 'Security',
            content: 'Review our security practices',
            href: '/security',
            media: { iconId: 'shield' },
          },
        ],
      },
    ],
    socials: [
      {
        name: 'Follow us on LinkedIn',
        href: 'https://linkedin.com/company/example',
        media: { iconId: 'linkedin' },
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
