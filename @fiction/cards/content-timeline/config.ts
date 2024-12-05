import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const MilestoneSchema = PostSchema.pick({
  title: true,
  subTitle: true,
  content: true,
  media: true,
  icon: true,
  action: true,
}).extend({
  date: z.string().optional(),
  endDate: z.string().optional(),
  badges: ActionAreaSchema.optional(),
})

export const schema = z.object({
  milestones: z.array(MilestoneSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>
type MilestoneConfig = z.infer<typeof MilestoneSchema>

export function getOptions() {
  return [

    createOption({
      schema,
      key: 'milestones',
      label: 'Milestones',
      input: 'InputList',
      props: {
        itemName: 'Milestone',
        itemLabel: args => (args?.item as MilestoneConfig)?.title ?? 'Untitled',
      },
      options: [

        createOption({
          input: 'group',
          key: 'dateRange',
          label: 'Date Range',
          options: [

            createOption({
              schema,
              key: 'date',
              label: 'Start Date',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'endDate',
              label: 'End Date',
              input: 'InputText',
            }),
          ],
        }),
        createOption({
          input: 'group',
          key: 'milestoneContentGroup',
          label: 'Content',
          options: [
            createOption({
              schema,
              key: 'icon',
              label: 'Icon',
              input: 'InputIcon',
            }),
            createOption({
              schema,
              key: 'title',
              label: 'Milestone Title',
              input: 'InputText',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'subTitle',
              label: 'Milestone Subtitle',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'content',
              label: 'Description',
              input: 'InputTextarea',
            }),
            createOption({
              schema,
              key: 'media',
              label: 'Image',
              input: 'InputMedia',
            }),
            createOption({
              schema,
              key: 'badges',
              label: 'Badges',
              input: 'InputActionArea',
              props: { variants: ['buttons'] },
            }),
          ],
        }),

        createOption({
          schema,
          key: 'action',
          input: 'InputActionArea',
        }),
      ],
    }),
  ]
}

export function getDemoConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    milestones: [
      {
        date: '2024',
        endDate: 'Present',
        title: 'Major Product Launch',
        subTitle: 'Led Development of Core Platform',
        content: 'Orchestrated successful launch of company\'s flagship analytics platform. Increased monthly recurring revenue by 127% and reduced customer onboarding time from 14 days to 48 hours.',
        icon: { iconId: 'rocket' },
        badges: {
          variant: 'buttons',
          buttons: [
            { label: 'Tech Lead', theme: 'emerald' },
            { label: 'Launch', theme: 'blue' },
          ],
        },
        media: stock.getRandomByTags(['aspect:landscape']),
        action: {
          buttons: [
            { label: 'View Case Study', href: '#', theme: 'primary' },
          ],
        },
      },
      {
        date: '2023',
        endDate: '2024',
        title: 'Team Expansion & Process Optimization',
        subTitle: 'Engineering Excellence Initiative',
        content: 'Scaled engineering team from 4 to 15 while maintaining code quality. Implemented CI/CD pipeline reducing deployment time by 65% and cutting production incidents by half.',
        icon: { iconId: 'users-plus' },
        badges: {
          variant: 'buttons',
          buttons: [
            { label: 'Leadership', theme: 'violet' },
            { label: 'DevOps', theme: 'amber' },
          ],
        },
      },
      {
        date: '2022',
        endDate: '2023',
        title: 'Infrastructure Modernization',
        subTitle: 'Cloud Migration Project',
        content: 'Successfully migrated legacy systems to cloud infrastructure, resulting in 40% cost reduction and 99.99% uptime. Introduced microservices architecture improving system scalability.',
        icon: { iconId: 'cloud' },
        badges: {
          buttons: [
            { label: 'Architecture', theme: 'cyan' },
            { label: 'Cloud', theme: 'slate' },
          ],
        },
      },
    ],
  }
}

export function getDefaultConfig(): UserConfig {
  return {
    milestones: [
      {
        date: new Date().toISOString(),
        title: 'Achievement Title',
        subTitle: 'Role or Project Focus',
        content: 'Describe the impact: Include metrics, scale, and business outcomes.',
        icon: { class: 'i-tabler-flag' },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        {
          templateId,
          userConfig: getDemoConfig({ ...args, stock }),
        },
      ],
    },
  }
}
