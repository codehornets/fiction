import { ActionButtonSchema, MediaDisplaySchema, UserSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema for a single bento item
const BentoItemSchema = z.object({
  // Layout settings
  cols: z.number().min(1).max(12).default(4),
  rows: z.number().min(1).max(12).default(4),

  // Content alignment
  verticalPosition: z.enum(['top', 'center', 'bottom']).default('center'),
  horizontalPosition: z.enum(['left', 'center', 'right']).default('center'),

  // Content type
  contentType: z.enum(['slider', 'figure', 'background']),

  // Post-like fields
  superTitle: z.string().optional().describe('Super title of the item'),
  title: z.string().optional().describe('Title of the item'),
  subTitle: z.string().optional().describe('Subtitle of the item'),
  content: z.string().optional().describe('Content of the item'),
  media: MediaDisplaySchema.describe('Featured Media for the item'),
  href: z.string().optional().describe('Link URL'),
  tags: z.array(z.string()).optional().describe('Tags for the item'),
  categories: z.array(z.string()).optional().describe('Categories for the item'),
  authors: z.array(UserSchema).optional(),
  actions: z.array(ActionButtonSchema).optional().describe('Action buttons for the item'),

  // Styling
  style: z.object({
    padding: z.number().optional(),
    borderRadius: z.number().optional(),
    overlay: z.boolean().optional().describe('Show content with dark overlay on hover'),
  }).optional(),
})

// Main schema for the bento card
const schema = z.object({
  items: z.array(BentoItemSchema),
  gap: z.number().optional(),
  containerPadding: z.number().optional(),
})

export type UserConfig = z.infer<typeof schema>

// Input options for the form
const options: InputOption[] = [
  new InputOption({
    key: 'items',
    label: 'Bento Items',
    input: 'InputList',
    options: [
      // Layout settings
      new InputOption({
        key: 'cols',
        label: 'Column Span',
        input: 'InputNumber',
        props: { min: 1, max: 12 },
      }),
      new InputOption({
        key: 'rows',
        label: 'Row Span',
        input: 'InputNumber',
        props: { min: 1, max: 12 },
      }),

      // Content positioning
      new InputOption({
        key: 'verticalPosition',
        label: 'Vertical Position',
        input: 'InputSelect',
        list: ['top', 'center', 'bottom'],
      }),
      new InputOption({
        key: 'horizontalPosition',
        label: 'Horizontal Position',
        input: 'InputSelect',
        list: ['left', 'center', 'right'],
      }),

      // Content type
      new InputOption({
        key: 'contentType',
        label: 'Content Type',
        input: 'InputSelect',
        list: ['slider', 'figure', 'background'],
      }),

      // Content fields
      new InputOption({ key: 'superTitle', label: 'Super Title', input: 'InputText' }),
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'subTitle', label: 'Subtitle', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputTextarea' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
      new InputOption({ key: 'href', label: 'Link URL', input: 'InputUrl' }),
      new InputOption({ key: 'tags', label: 'Tags', input: 'InputItems' }),
      new InputOption({ key: 'categories', label: 'Categories', input: 'InputItems' }),

      // Styling
      new InputOption({
        key: 'style',
        label: 'Styling',
        input: 'InputControl',
        options: [
          new InputOption({
            key: 'padding',
            label: 'Padding',
            input: 'InputNumber',
            props: { min: 0, max: 12 },
          }),
          new InputOption({
            key: 'borderRadius',
            label: 'Border Radius',
            input: 'InputNumber',
            props: { min: 0, max: 24 },
          }),
          new InputOption({
            key: 'overlay',
            label: 'Show Overlay on Hover',
            input: 'InputToggle',
          }),
        ],
      }),
    ],
  }),
  new InputOption({
    key: 'gap',
    label: 'Grid Gap',
    input: 'InputNumber',
    props: { min: 0, max: 12 },
  }),
  new InputOption({
    key: 'containerPadding',
    label: 'Container Padding',
    input: 'InputNumber',
    props: { min: 0, max: 12 },
  }),
]

// Default configuration
async function getDefaultConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        cols: 8,
        rows: 4,
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        contentType: 'background',
        superTitle: 'Featured',
        title: 'Main Project',
        subTitle: 'Innovative Solutions',
        content: 'Discover our flagship project that showcases our expertise',
        media: {
          url: '/api/placeholder/800/600',
          format: 'image',
          alt: 'Featured project',
        },
        href: '/projects/main',
        style: {
          padding: 4,
          borderRadius: 8,
          overlay: true,
        },
        actions: [
          {
            name: 'Learn More',
            theme: 'primary',
            icon: { class: 'i-tabler-arrow-right' },
          },
        ],
      },
      {
        cols: 4,
        rows: 2,
        verticalPosition: 'center',
        horizontalPosition: 'center',
        contentType: 'figure',
        title: 'About Us',
        content: 'Learn more about our team and mission',
        media: {
          url: '/api/placeholder/400/300',
          format: 'image',
          alt: 'About us',
        },
        href: '/about',
        style: {
          overlay: true,
        },
      },
      {
        cols: 4,
        rows: 2,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        contentType: 'background',
        title: 'Our Process',
        content: 'How we work',
        media: {
          url: '/api/placeholder/400/300',
          format: 'image',
          alt: 'Our process',
        },
        style: {
          overlay: false,
        },
      },
    ],
    gap: 4,
    containerPadding: 4,
  }
}

export const template = cardTemplate({
  templateId: 'bento',
  category: ['layout', 'content'],
  description: 'Create a dynamic bento grid layout',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'violet',
  isPublic: true,
  schema,
  el: vue.defineAsyncComponent(async () => import('./ElBento.vue')),
  options,
  getUserConfig: async () => getDefaultConfig(),
  demoPage: async () => {
    const userConfig = await getDefaultConfig()
    return {
      cards: [
        { templateId: 'bento', userConfig },
      ],
    }
  },
})
