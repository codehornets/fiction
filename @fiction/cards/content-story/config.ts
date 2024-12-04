import type { CardFactory } from '@fiction/site/cardFactory'
import { PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const fields = PostSchema.pick({
  title: true,
  content: true,
  media: true,
  action: true,
}).shape

const StorySectionSchema = z.object({
  ...fields,
  title: fields.title.describe('Headline that captures this story section'),
  content: fields.content.describe('2-3 engaging paragraphs that draw readers in'),
  media: fields.media.describe('Visual element that enhances your story'),
  action: fields.action.describe('Optional calls-to-action at key moments'),
})

const schema = z.object({
  items: z.array(StorySectionSchema).describe('Story sections that reveal as users scroll'),
  layout: z.enum(['left', 'right']).optional().describe('Media on left or right'),
  scrollHandling: z.enum(['sticky', 'scrolling']).optional().describe('Media behavior on scroll'),
})

export type UserConfig = z.infer<typeof schema>
type StorySection = z.infer<typeof StorySectionSchema>

const options = [
  createOption({
    schema,
    key: 'sectionsGroup',
    input: 'group',
    label: 'Story Sections',
    icon: { class: 'i-tabler-book' },
    options: [
      createOption({
        schema,
        key: 'items',
        input: 'InputList',
        props: {
          itemName: 'Section',
          itemLabel: ({ item }) => {
            const section = item as StorySection
            if (section.title)
              return section.title

            // Remove HTML and get preview
            const plainText = section.content?.replace(/<[^>]*>/g, '') || ''
            return plainText.slice(0, 100) || 'Untitled'
          },
        },
        options: [
          createOption({
            schema,
            key: 'title',
            label: 'Title',
            input: 'InputText',
            placeholder: 'Enter a headline...',
          }),
          createOption({
            schema,
            key: 'content',
            label: 'Content',
            input: 'InputProse',
            placeholder: 'Write your story...',
          }),
          createOption({
            schema,
            key: 'media',
            label: 'Media',
            input: 'InputMedia',
          }),
          createOption({
            schema,
            key: 'action',
            label: 'Call to Action',
            input: 'InputActionArea',
          }),
        ],
      }),
    ],
  }),
  createOption({
    schema,
    key: 'settingsGroup',
    input: 'group',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'layout',
        input: 'InputRadioButton',
        label: 'Layout Style',
        list: [
          { name: 'Media on Left', value: 'left' },
          { name: 'Media on Right', value: 'right' },
        ],
      }),
      createOption({
        schema,
        key: 'scrollHandling',
        input: 'InputRadioButton',
        label: 'Scroll Behavior',
        subLabel: 'Standard scrolling or sticky media',
        list: [
          { name: 'Standard Scrolling', value: 'scrolling' },
          { name: 'Sticky Media', value: 'sticky' },
        ],
      }),
    ],
  }),
]

async function getDefaultConfig(args: { factory: CardFactory, numItems?: number }): Promise<UserConfig> {
  const { numItems = 10, factory } = args
  const stock = await factory.getStockMedia()

  const defaultItems: StorySection[] = [
    {
      content: `<p>[text_effect]Your story[/text_effect] begins to unfold as readers scroll down the page. This engaging format naturally draws attention and keeps your audience immersed in your narrative.</p>
               <p>See how the images beside your text create visual anchor points, helping readers connect with key moments in your story while maintaining a smooth reading flow.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
    },
    {
      content: `<p>Each new section reveals itself at just the right moment. This pacing helps build anticipation and keeps readers engaged with your content.</p>
               <p>Experience how the clean layout ensures your message remains front and center, while supporting visuals add depth without overwhelming.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
    },
    {
      content: `<p>Feel the natural rhythm as text and images work together to tell your story. This balanced approach helps maintain reader interest while effectively communicating your message.</p>
               <p>Imagine your own narrative unfolding this way - whether you're sharing a company history, showcasing a project, or telling your brand story.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
      action: { buttons: [{ label: 'Start Your Story', href: '#' }] },
    },
  ]

  return {
    layout: 'left',
    scrollHandling: 'scrolling',
    items: defaultItems.slice(0, numItems),
  }
}

async function getDemoConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const defaultUserConfig = await getDefaultConfig({ ...args })

  return {
    ...defaultUserConfig,
    scrollHandling: 'sticky',
    layout: 'right',
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options,
    userConfig: await getDefaultConfig({ ...args, numItems: 1 }),
    demoPage: {
      cards: [{
        templateId: args.templateId,
        userConfig: await getDemoConfig(args),
      }],
    },
  }
}
