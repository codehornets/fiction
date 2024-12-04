import { colorThemeUser, MediaIconSchema, navListItemSchema, numberFormats } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const metricSchema = navListItemSchema.pick({
  label: true,
  description: true,
  value: true,
  icon: true,
  theme: true,
  emphasis: true,
}).extend({
  format: z.enum(numberFormats).optional(),
})

export type MetricItem = z.infer<typeof metricSchema>

export const schema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  layout: z.enum(['grid', 'inline', 'featured']).optional(),
  metrics: z.array(metricSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'content',
    label: 'Content',
    input: 'group',
    options: [
      new InputOption({
        key: 'title',
        label: 'Title',
        input: 'InputText',
        props: {
          placeholder: 'e.g., "Our Growth Story in Numbers"',
        },
      }),
      new InputOption({
        key: 'subtitle',
        label: 'Subtitle',
        input: 'InputText',
        props: {
          placeholder: 'Add context to your metrics',
        },
      }),
    ],
  }),
  new InputOption({
    key: 'layout',
    label: 'Layout Style',
    input: 'InputRadioButton',
    props: {
      options: [
        { label: 'Grid (3 columns)', value: 'grid' },
        { label: 'Inline Row', value: 'inline' },
        { label: 'Featured (Highlight Key Metric)', value: 'featured' },
      ],
    },
  }),
  new InputOption({
    key: 'metrics',
    label: 'Metrics',
    input: 'InputList',
    props: {
      itemLabel: 'Metric',
    },
    options: [
      new InputOption({
        key: 'name',
        label: 'Metric Name',
        input: 'InputText',
        props: {
          placeholder: 'e.g., "Customer Growth"',
        },
      }),
      new InputOption({
        key: 'desc',
        label: 'Description',
        input: 'InputText',
        props: {
          placeholder: 'Add context or timeframe',
        },
      }),
      new InputOption({
        key: 'value',
        label: 'Value',
        input: 'InputNumber',
      }),
      new InputOption({
        key: 'format',
        label: 'Number Format',
        input: 'InputSelect',
        props: {
          list: numberFormats,
        },
      }),
      new InputOption({
        key: 'icon',
        label: 'Icon',
        input: 'InputIcon',
      }),
      new InputOption({
        key: 'theme',
        label: 'Color Theme',
        input: 'InputSelect',
        props: {
          list: colorThemeUser,
        },
      }),
      new InputOption({
        key: 'isHighlight',
        label: 'Highlight This Metric',
        input: 'InputToggle',
        description: 'Makes this metric more prominent in featured layout',
      }),
    ],
  }),
]

function getBrandGrowthDemo(): UserConfig {
  return {
    title: 'Watch Our Brand Impact Grow',
    subtitle: 'See how we\'ve helped businesses transform their digital presence',
    layout: 'grid',
    metrics: [
      {
        label: 'Client Revenue Growth',
        description: 'Average increase in annual revenue',
        value: 127,
        format: 'percent',
        icon: { class: 'i-tabler-chart-arrows-vertical' },
        theme: 'emerald',
      },
      {
        label: 'Brand Recognition',
        description: 'Increase in brand awareness surveys',
        value: 83,
        format: 'percent',
        icon: { class: 'i-tabler-sparkles' },
        theme: 'violet',
      },
      {
        label: 'Success Stories',
        description: 'Brands transformed',
        value: 250,
        format: 'number',
        icon: { class: 'i-tabler-building-store' },
        theme: 'blue',
      },
    ],
  }
}

function getEngagementDemo(): UserConfig {
  return {
    title: 'Engagement That Drives Results',
    subtitle: 'Metrics from our most successful campaigns',
    layout: 'featured',
    metrics: [
      {
        label: 'Social Engagement',
        description: 'Monthly interactions across platforms',
        value: 1200000,
        format: 'abbreviated',
        icon: { class: 'i-tabler-heart-handshake' },
        theme: 'red',
        emphasis: 'highlighted',
      },
      {
        label: 'Conversion Rate',
        description: 'Average campaign performance',
        value: 12.5,
        format: 'percent',
        icon: { class: 'i-tabler-target-arrow' },
        theme: 'amber',
      },
      {
        label: 'ROI Multiple',
        description: 'Average return on ad spend',
        value: 4.7,
        icon: { class: 'i-tabler-chart-dots' },
        theme: 'emerald',
      },
    ],
  }
}

function getEcommerceDemo(): UserConfig {
  return {
    title: 'Our eCommerce Success Story',
    subtitle: 'Key performance indicators that drive our growth',
    layout: 'inline',
    metrics: [
      {
        label: 'Sales Growth',
        description: 'Year over year increase',
        value: 215,
        format: 'percent',
        icon: { class: 'i-tabler-shopping-cart' },
        theme: 'blue',
      },
      {
        label: 'Customer LTV',
        description: 'Average lifetime value',
        value: 2850,
        format: 'dollar',
        icon: { class: 'i-tabler-user-circle' },
        theme: 'emerald',
      },
      {
        label: 'New Markets',
        description: 'Countries expanded to',
        value: 12,
        format: 'number',
        icon: { class: 'i-tabler-world' },
        theme: 'indigo',
      },
    ],
  }
}

export async function getConfig(args: { templateId: string }) {
  return {
    schema,
    options,
    userConfig: getBrandGrowthDemo(),
    demoPage: {
      cards: [
        { templateId: args.templateId, userConfig: getBrandGrowthDemo() },
        { templateId: args.templateId, userConfig: getEngagementDemo() },
        { templateId: args.templateId, userConfig: getEcommerceDemo() },
      ],
    },
  }
}
