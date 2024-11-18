// config.ts
import { MediaIconSchema } from '@fiction/core'
import { NavListItemSchema } from '@fiction/core/schemas/schemas'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  menus: z.array(NavListItemSchema).optional(),
  additional: z.object({
    list1: z.array(NavListItemSchema).optional(),
    list2: z.array(NavListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getDefaultConfig(): UserConfig {
  return {
    title: 'Professional Brand Name',
    subTitle: 'Your Vision, Our Digital Solutions',
    menus: [
      {
        itemsTitle: 'Quick Links',
        items: [
          { name: 'Our Story', href: '/about' },
          { name: 'What We Offer', href: '/services' },
          { name: 'Recent Work', href: '/portfolio' },
        ],
      },
      {
        itemsTitle: 'Let\'s Connect',
        items: [
          {
            title: 'Email',
            name: 'contact@example.com',
            href: 'mailto:contact@example.com',
            media: { iconId: 'email' },
          },
          {
            title: 'Phone',
            name: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
            media: { iconId: 'phone' },
          },
          {
            title: 'Location',
            name: 'San Francisco, CA',
            media: { iconId: 'map' },
          },
        ],
      },
    ],
    additional: {
      list1: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
      ],
      list2: [
        { name: '© 2024 Your Brand. All rights reserved.' },
        { name: 'Built with ♥ by Your Studio' },
      ],
    },
  } as const
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    // Professional Business Style
    standard: {
      templateId,
      userConfig: getDefaultConfig(),
    },

    // Personal Portfolio Style
    portfolio: {
      templateId,
      userConfig: {
        title: 'Sarah Anderson',
        subTitle: 'UX Designer & Digital Artist',
        menus: [
          {
            itemsTitle: 'Portfolio',
            items: [
              { name: 'Case Studies', href: '/case-studies' },
              { name: 'Design Process', href: '/process' },
              { name: 'Testimonials', href: '/testimonials' },
              { name: 'Awards', href: '/awards' },
            ],
          },
          {
            itemsTitle: 'Connect',
            items: [
              {
                title: 'Email',
                name: 'hello@sarahanderson.design',
                href: 'mailto:hello@sarahanderson.design',
                media: { iconId: 'email' },
              },
              {
                title: 'LinkedIn',
                name: 'Sarah Anderson',
                href: 'https://linkedin.com/in/sarahanderson',
                media: { iconId: 'linkedin' },
              },
              {
                title: 'Dribbble',
                name: '@sarahanderson',
                href: 'https://dribbble.com/sarahanderson',
                media: { iconId: 'dribbble' },
              },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Image Rights', href: '/image-rights' },
          ],
          list2: [
            { name: '© 2024 Sarah Anderson. All rights reserved.' },
            { name: 'Designed & Built with Purpose' },
          ],
        },
      },
    },

    // Startup/SaaS Style
    startup: {
      templateId,
      userConfig: {
        title: 'LaunchPad',
        subTitle: 'Empower Your Team\'s Productivity',
        menus: [
          {
            itemsTitle: 'Product',
            items: [
              { name: 'Features', href: '/features' },
              { name: 'Pricing', href: '/pricing' },
              { name: 'Security', href: '/security' },
              { name: 'Enterprise', href: '/enterprise' },
              { name: 'Roadmap', href: '/roadmap' },
            ],
          },
          {
            itemsTitle: 'Resources',
            items: [
              { name: 'Documentation', href: '/docs' },
              { name: 'API Reference', href: '/api' },
              { name: 'Status', href: '/status' },
              { name: 'Blog', href: '/blog' },
            ],
          },
          {
            itemsTitle: 'Company',
            items: [
              { name: 'About', href: '/about' },
              { name: 'Careers', href: '/careers' },
              { name: 'Press Kit', href: '/press' },
              { name: 'Contact', href: '/contact' },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Cookie Settings', href: '/cookies' },
            { name: 'Acceptable Use', href: '/acceptable-use' },
          ],
          list2: [
            { name: '© 2024 LaunchPad Technologies, Inc.' },
            { name: 'Made with ♥ in San Francisco' },
          ],
        },
      },
    },

    // Freelancer/Consultant Style
    consultant: {
      templateId,
      userConfig: {
        title: 'Michael Chen',
        subTitle: 'Business Strategy Consultant',
        menus: [
          {
            itemsTitle: 'Services',
            items: [
              { name: 'Strategy Consulting', href: '/services/strategy' },
              { name: 'Digital Transformation', href: '/services/digital' },
              { name: 'Workshop Facilitation', href: '/services/workshops' },
              { name: 'Speaking Engagements', href: '/speaking' },
            ],
          },
          {
            itemsTitle: 'Resources',
            items: [
              { name: 'Case Studies', href: '/case-studies' },
              { name: 'Articles', href: '/articles' },
              { name: 'Newsletter', href: '/newsletter' },
              { name: 'Free Templates', href: '/templates' },
            ],
          },
          {
            itemsTitle: 'Contact',
            items: [
              {
                title: 'Book a Call',
                name: 'Schedule Consultation',
                href: '/schedule',
                media: { iconId: 'calendar' },
              },
              {
                title: 'Email',
                name: 'michael@chenstrategic.com',
                href: 'mailto:michael@chenstrategic.com',
                media: { iconId: 'email' },
              },
              {
                title: 'Location',
                name: 'Available Worldwide',
                media: { iconId: 'globe' },
              },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Client Portal', href: '/portal' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Engagement', href: '/terms' },
          ],
          list2: [
            { name: '© 2024 Chen Strategic Consulting' },
            { name: 'Member of International Consulting Alliance' },
          ],
        },
      },
    },

    // Agency Style
    agency: {
      templateId,
      userConfig: {
        title: 'Pixel Perfect',
        subTitle: 'Digital Agency & Creative Studio',
        menus: [
          {
            itemsTitle: 'Services',
            items: [
              { name: 'Brand Strategy', href: '/services/branding' },
              { name: 'Web Development', href: '/services/web' },
              { name: 'Digital Marketing', href: '/services/marketing' },
              { name: 'Motion Design', href: '/services/motion' },
            ],
          },
          {
            itemsTitle: 'Work',
            items: [
              { name: 'Featured Projects', href: '/work' },
              { name: 'Case Studies', href: '/cases' },
              { name: 'Client Success', href: '/success' },
              { name: 'Industries', href: '/industries' },
            ],
          },
          {
            itemsTitle: 'Studio',
            items: [
              {
                title: 'New Business',
                name: 'start@pixelperfect.studio',
                href: 'mailto:start@pixelperfect.studio',
                media: { iconId: 'email' },
              },
              {
                title: 'Careers',
                name: 'Join Our Team',
                href: '/careers',
                media: { iconId: 'user' },
              },
              {
                title: 'Address',
                name: 'Brooklyn, NY',
                media: { iconId: 'pin' },
              },
            ],
          },
        ],
        additional: {
          list1: [
            { name: 'Privacy', href: '/privacy' },
            { name: 'Terms', href: '/terms' },
            { name: 'Accessibility', href: '/accessibility' },
          ],
          list2: [
            { name: '© 2024 Pixel Perfect Studio LLC' },
            { name: 'An Award-Winning Digital Agency' },
          ],
        },
      },
    },
  }
}

export function getOptions(): InputOption[] {
  return [
    // Brand Identity Section
    new InputOption({
      key: 'brandIdentity',
      label: 'Brand Identity',
      input: 'group',
      options: [
        new InputOption({
          key: 'title',
          label: 'Brand Name',
          description: 'Your company or personal brand name',
          input: 'InputText',
          isRequired: true,
          props: {
            placeholder: 'e.g., Acme Studios or John Smith Design',
          },
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Brand Tagline',
          description: 'A brief, compelling description of what you do',
          input: 'InputText',
          props: {
            placeholder: 'e.g., Creative Solutions for Modern Businesses',
          },
        }),
      ],
    }),

    // Navigation Menu Section
    new InputOption({
      key: 'menus',
      label: 'Navigation Menus',
      description: 'Configure your footer navigation sections',
      input: 'InputList',
      props: {
        itemName: 'Menu Section',
        addButtonText: 'Add New Menu Section',
      },
      options: [
        new InputOption({
          key: 'itemsTitle',
          label: 'Section Title',
          input: 'InputText',
          props: {
            placeholder: 'e.g., Quick Links, Resources, Services',
          },
        }),
        new InputOption({
          key: 'items',
          label: 'Menu Items',
          input: 'InputList',
          props: {
            itemName: 'Menu Item',
            addButtonText: 'Add Menu Item',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
              props: {
                placeholder: 'e.g., About Us, Services, Contact',
              },
            }),
            new InputOption({
              key: 'href',
              label: 'Link URL',
              description: 'Full URL or relative path starting with /',
              input: 'InputUrl',
              props: {
                placeholder: 'e.g., /about or https://example.com',
              },
            }),
            new InputOption({
              key: 'media',
              label: 'Icon (Optional)',
              description: 'Select an icon to display next to the link',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),

    // Legal & Copyright Section
    new InputOption({
      key: 'additional',
      label: 'Legal & Copyright',
      description: 'Configure legal links and copyright information',
      input: 'group',
      options: [
        new InputOption({
          key: 'list1',
          label: 'Legal Links',
          description: 'Add important legal and policy links',
          input: 'InputList',
          props: {
            itemName: 'Legal Link',
            addButtonText: 'Add Legal Link',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Link Text',
              input: 'InputText',
              props: {
                placeholder: 'e.g., Privacy Policy, Terms of Service',
              },
            }),
            new InputOption({
              key: 'href',
              label: 'Link URL',
              input: 'InputUrl',
              props: {
                placeholder: 'e.g., /privacy or /terms',
              },
            }),
          ],
        }),
        new InputOption({
          key: 'list2',
          label: 'Copyright Text',
          description: 'Add copyright and attribution information',
          input: 'InputList',
          props: {
            itemName: 'Copyright Line',
            addButtonText: 'Add Copyright Line',
          },
          options: [
            new InputOption({
              key: 'name',
              label: 'Text',
              input: 'InputText',
              props: {
                placeholder: 'e.g., © 2024 Your Brand. All rights reserved.',
              },
            }),
          ],
        }),
      ],
    }),
  ]
}

export async function getFooterConfig(args: { templateId: string }) {
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
