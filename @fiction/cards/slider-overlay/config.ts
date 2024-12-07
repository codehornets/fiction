import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { StockMedia } from '@fiction/ui/stock'
import { MediaBasicSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  autoSlide: z.boolean().optional().describe('Animate slide transition automatically'),
  slides: z.array(
    z.object({
      media: MediaBasicSchema.optional(),
      title: z.string().optional().describe('Title for slide, fitted 2 to 6 words'),
      subTitle: z.string().optional().describe('Subtitle for slide, fitted 3 to 8 words'),
      textBlend: z.enum(['normal', 'difference']).optional().describe('Text blend mode over slide'),
    }),
  ).optional().describe('Slides for slider with media, title, and subtitle'),
})

export type UserConfig = z.infer<typeof schema>

export const options = [
  createOption({
    schema,
    input: 'group',
    key: 'group.slides',
    label: 'Slides',
    icon: { class: 'i-tabler-slideshow' },
    options: [
      createOption({
        schema,
        key: 'slides',
        label: 'Slides',
        input: 'InputList',
        props: { itemLabel: 'Slide' },
        options: [
          createOption({
            schema,
            key: 'slides.0.media',
            label: 'Background Media',
            input: 'InputMedia',
            description: 'Notice how high-quality visuals create immediate impact',
          }),
          createOption({
            schema,
            key: 'slides.0.title',
            label: 'Main Heading',
            input: 'InputText',
            props: {
              placeholder: 'Feel the impact of a powerful headline (2-6 words)',
            },
          }),
          createOption({
            schema,
            key: 'slides.0.subTitle',
            label: 'Supporting Text',
            input: 'InputText',
            props: {
              placeholder: 'Imagine your message resonating with every viewer (3-8 words)',
            },
          }),
          createOption({
            schema,
            key: 'slides.0.textBlend',
            label: 'Text Visibility',
            input: 'InputRadio',
            props: {
              options: [
                { label: 'Standard', value: 'normal' },
                { label: 'Enhanced Contrast', value: 'difference' },
              ],
            },
            description: 'Watch how different modes enhance readability across any background',
          }),
        ],
      }),
    ],
  }),
  createOption({
    schema,
    input: 'group',
    key: 'group.settings',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'autoSlide',
        label: 'Auto-Advance Slides',
        input: 'InputToggle',
        description: 'Experience smooth automatic transitions every 15 seconds',
      }),
    ],
  }),

]

export async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    autoSlide: true,
    slides: [
      {
        title: 'First and Last Name',
        subTitle: 'Tagline or Key Achievement Here',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Featured In Publications',
        subTitle: 'As Seen in Forbes, TIME, and WSJ',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Latest Book Release',
        subTitle: 'Now a #1 International Bestseller',
        textBlend: 'normal',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Next Live Event',
        subTitle: 'Join Me This Summer in New York',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
  }
}

export async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    autoSlide: true,
    slides: [
      // Visual Impact Demo
      {
        title: 'Notice the Visual Impact',
        subTitle: 'See how imagery draws attention instantly',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      // Text Contrast Demo
      {
        title: 'Experience Perfect Clarity',
        subTitle: 'Watch how text adapts to any background',
        textBlend: 'normal',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      // Motion Demo
      {
        title: 'Feel the Smooth Motion',
        subTitle: 'Imagine your content flowing effortlessly',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape', 'video']),
      },
      // Call to Action Demo
      {
        title: 'Transform Your Story',
        subTitle: 'Start creating your perfect slider now',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
  }
}

export async function getConfig({ templateId, factory }: { templateId: string, factory: CardFactory }) {
  const stock = await factory.getStockMedia()
  const defaultConfig = await getDefaultConfig({ stock })
  const demoConfig = await getDemoConfig({ stock })

  return {
    schema,
    options,
    userConfig: defaultConfig,
    demoPage: {
      cards: [
        // Personal Brand Example
        {
          templateId,
          userConfig: defaultConfig,
        },
        // Feature Demo Example
        {
          templateId,
          userConfig: demoConfig,
        },
        // Product Showcase Example
        {
          templateId,
          userConfig: {
            autoSlide: true,
            slides: [
              {
                title: 'Discover What\'s Possible',
                subTitle: 'Feel the difference our products make',
                textBlend: 'difference',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
              {
                title: 'See the Innovation',
                subTitle: 'Notice how every detail matters',
                textBlend: 'normal',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
              {
                title: 'Imagine the Impact',
                subTitle: 'Watch as your vision comes to life',
                textBlend: 'difference',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
            ],
          },
        },
      ],
    },
  }
}
