import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { MediaBasicSchema, navListItemSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition with all fields optional
const socialSchema = navListItemSchema.pick({
  label: true,
  media: true,
  href: true,
})

const schema = z.object({
  layout: z.enum(['mediabox', 'grid']).optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  profiles: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    title: z.string().optional(),
    media: MediaBasicSchema.optional(),
    social: z.array(socialSchema).optional(),
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
        { value: 'mediabox', label: 'Media Box - Large portraits with side text' },
        { value: 'grid', label: 'Grid - Modern gallery style layout' },
      ],
    }),
    new InputOption({
      key: 'title',
      input: 'InputText',
      label: 'Main Heading',
      placeholder: 'e.g., Meet the Minds Behind Our Success',
    }),
    new InputOption({
      key: 'subTitle',
      input: 'InputText',
      label: 'Supporting Message',
      placeholder: 'Share what makes your team unique',
    }),
    new InputOption({
      key: 'profiles',
      input: 'InputList',
      label: 'Team Members',
      props: { itemLabel: 'Team Member' },
      options: [
        new InputOption({
          key: 'name',
          input: 'InputText',
          label: 'Full Name',
          placeholder: 'e.g., Sarah Chen',
          isRequired: true,
        }),
        new InputOption({
          key: 'title',
          input: 'InputText',
          label: 'Role/Position',
          placeholder: 'e.g., Chief Innovation Officer',
        }),
        new InputOption({
          key: 'desc',
          input: 'InputTextarea',
          label: 'Bio',
          placeholder: 'Share their story, expertise and impact',
        }),
        new InputOption({
          key: 'media',
          input: 'InputMedia',
          label: 'Profile Photo',
          props: {
            formats: { url: true },
            aspectRatio: '4:5',
            placeholder: 'Upload a professional headshot',
          },
        }),
        new InputOption({
          key: 'social',
          input: 'InputList',
          label: 'Social Profiles',
          props: { itemLabel: 'Social Link' },
          options: [
            new InputOption({
              key: 'label',
              input: 'InputText',
              label: 'Platform',
              placeholder: 'e.g., LinkedIn, Twitter',
            }),
            new InputOption({
              key: 'href',
              input: 'InputUrl',
              label: 'Profile URL',
              placeholder: 'https://...',
            }),
            new InputOption({
              key: 'media',
              input: 'InputIcon',
              label: 'Icon',
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
    layout: 'grid',
    title: 'Build Trust with Faces',
    subTitle: 'Notice how a well-crafted team section instantly builds credibility. Add your team members to create meaningful connections with visitors.',
    profiles: [{
      name: 'Your Team Member',
      title: 'Share Their Role',
      desc: 'Imagine the impact of sharing their unique story. What expertise do they bring? What accomplishments make them stand out? Use this space to help visitors connect with your team personally.',
      media: stock.getRandomByTags(['person']),
      social: [{
        label: 'LinkedIn',
        media: { class: 'i-tabler-brand-linkedin' },
        href: 'https://linkedin.com/in/username',
      }],
    }],
  }
}

async function getDemoConfigs(args: { stock: StockMedia }): Promise<Record<string, UserConfig>> {
  const { stock } = args
  return {
    startup: {
      layout: 'grid',
      title: 'Meet Our Innovators',
      subTitle: 'Feel the energy of a team that\'s reshaping the future of technology, one breakthrough at a time.',
      profiles: [{
        name: 'Alexandra Rivera',
        title: 'Innovation Lead',
        desc: 'Visualize the possibilities with Alexandra leading the way. Previously scaled three AI startups, now revolutionizing how we approach machine learning ethics.',
        media: stock.getRandomByTags(['woman']),
        social: [
          { label: 'LinkedIn', media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { label: 'Twitter', media: { class: 'i-tabler-brand-x' }, href: '#' },
        ],
      }, {
        name: 'David Kim',
        title: 'Product Architect',
        desc: 'Experience seamless innovation through David\'s vision. His design-thinking approach has transformed user experiences for over 2M+ customers globally.',
        media: stock.getRandomByTags(['man']),
        social: [
          { label: 'LinkedIn', media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { label: 'GitHub', media: { class: 'i-tabler-brand-github' }, href: '#' },
        ],
      }],
    },
    creative: {
      layout: 'mediabox',
      title: 'Creative Minds',
      subTitle: 'Discover the artists and strategists crafting unforgettable brand experiences.',
      profiles: [{
        name: 'Sophie Laurent',
        title: 'Creative Director',
        desc: 'Watch your brand transform under Sophie\'s creative direction. Her award-winning campaigns have captured hearts and headlines across three continents.',
        media: stock.getRandomByTags(['woman']),
        social: [
          { label: 'Instagram', media: { class: 'i-tabler-brand-instagram' }, href: '#' },
          { label: 'Behance', media: { class: 'i-tabler-brand-behance' }, href: '#' },
        ],
      }, {
        name: 'Marcus Chen',
        title: 'Brand Strategist',
        desc: 'Feel the impact of strategic storytelling with Marcus at the helm. His data-driven approach has helped startups achieve 300% growth in brand recognition.',
        media: stock.getRandomByTags(['man']),
        social: [
          { label: 'LinkedIn', media: { class: 'i-tabler-brand-linkedin' }, href: '#' },
          { label: 'Medium', media: { class: 'i-tabler-brand-medium' }, href: '#' },
        ],
      }],
    },
    default: await getDefaultConfig({ stock }),
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
