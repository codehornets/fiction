import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { MediaBasicSchema, MediaIconSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const schema = z.object({
  layout: z.enum(['mediabox', 'grid']).optional(),
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  superHeading: z.string().optional(),
  profiles: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    title: z.string().optional(),
    media: MediaBasicSchema.optional(),
    social: z.array(z.object({
      name: z.string().optional(),
      media: MediaIconSchema.optional(),
      href: z.string().optional(),
    })).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'layout',
      input: 'InputSelect',
      label: 'Layout Style',
      list: [
        { value: 'mediabox', label: 'Media Box - Large photos with overlay text' },
        { value: 'grid', label: 'Grid - Traditional grid layout' },
      ],
    }),
    new InputOption({
      key: 'heading',
      input: 'InputText',
      label: 'Main Heading',
      placeholder: 'e.g. Meet Our Team',
    }),
    new InputOption({
      key: 'subHeading',
      input: 'InputText',
      label: 'Supporting Text',
      placeholder: 'Add context about your team',
    }),
    new InputOption({
      key: 'superHeading',
      input: 'InputText',
      label: 'Small Heading Above',
      placeholder: 'e.g. The People Behind Our Success',
    }),
    new InputOption({
      key: 'profiles',
      input: 'InputList',
      label: 'Team Members',
      props: { itemLabel: 'Team Member' },
      options: [
        new InputOption({ key: 'name', input: 'InputText', label: 'Full Name', isRequired: true }),
        new InputOption({ key: 'title', input: 'InputText', label: 'Job Title' }),
        new InputOption({ key: 'desc', input: 'InputText', label: 'Brief Bio' }),
        new InputOption({
          key: 'media',
          input: 'InputMedia',
          label: 'Profile Photo',
          props: { formats: { url: true }, aspectRatio: '4:5' },
        }),
        new InputOption({
          key: 'social',
          input: 'InputList',
          label: 'Social Links',
          props: { itemLabel: 'Social Profile' },
          options: [
            new InputOption({ key: 'name', input: 'InputText', label: 'Platform Name' }),
            new InputOption({ key: 'href', input: 'InputText', label: 'Profile URL' }),
            new InputOption({
              key: 'media',
              input: 'InputIcon',
              label: 'Social Icon',
              props: { defaultIcon: 'i-tabler-brand-linkedin' },
            }),
          ],
        }),
      ],
    }),
  ]
}

async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    heading: 'Meet Our Team',
    subHeading: 'Edit this section to introduce your team members. Add photos, bios, and social links to help visitors connect with your organization.',
    profiles: [{
      name: 'Add Team Member',
      title: 'Role / Position',
      desc: 'Share a brief bio highlighting expertise and accomplishments',
      media: stock.getRandomByTags(['person']),
      social: [{
        media: { class: 'i-tabler-brand-linkedin' },
        href: 'https://linkedin.com/in/username',
      }],
    }],
  }
}

async function getDemoConfigs(args: { stock: StockMedia }): Promise<Record<string, UserConfig>> {
  const { stock } = args
  return {
    executive: {
      layout: 'grid',
      superHeading: 'Leadership',
      heading: 'Meet Our Executive Team',
      subHeading: 'With decades of combined experience, our leadership team brings vision and expertise to drive innovation.',
      profiles: [{
        name: 'Sarah Chen',
        title: 'Chief Executive Officer',
        desc: 'Former VP at Fortune 500, led digital transformation initiatives across APAC region.',
        media: stock.getRandomByTags(['woman']),
        social: [
          { media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { media: { class: 'i-tabler-brand-x' }, href: '#' },
        ],
      }, {
        name: 'Marcus Rodriguez',
        title: 'Chief Technology Officer',
        desc: '15+ years in enterprise architecture, scaled multiple unicorn startups.',
        media: stock.getRandomByTags(['man']),
        social: [
          { media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { media: { class: 'i-tabler-brand-github' }, href: '#' },
        ],
      }],
    },
    advisors: {
      layout: 'mediabox',
      superHeading: 'Advisory Board',
      heading: 'Industry Experts',
      subHeading: 'Our advisors provide strategic guidance and deep domain expertise.',
      profiles: [{
        name: 'Dr. Emma Williams',
        title: 'AI Ethics Advisor',
        desc: 'Leading researcher in ethical AI development, published author, and frequent keynote speaker.',
        media: stock.getRandomByTags(['woman']),
        social: [
          { media: { class: 'i-tabler-brand-x' }, href: '#' },
          { media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
        ],
      }, {
        name: 'James Park',
        title: 'Growth Strategy',
        desc: 'Serial entrepreneur with 3 successful exits, angel investor, and startup mentor.',
        media: stock.getRandomByTags(['man']),
        social: [
          { media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { media: { class: 'i-tabler-brand-medium' }, href: '#' },
        ],
      }],
    },
  }
}

export async function getConfig(args: { factory: CardFactory, templateId: string }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const demos = await getDemoConfigs({ stock })
  return {
    schema,
    options: getOptions(),
    userConfig: await getDefaultConfig({ stock }),
    demoPage: {
      cards: Object.entries(demos).map(([_key, config]) => ({
        templateId,
        userConfig: config,
      })),
    },
  }
}
