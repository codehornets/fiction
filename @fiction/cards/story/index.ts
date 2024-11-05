import type { Site } from '@fiction/site'
import { MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'story'

const schema = z.object({
  items: z.array(z.object({
    title: z.string().optional().describe('Title for the story paragraph'),
    content: z.string().optional().describe('Html content, 15 to 35 words, 2 to 3 paragraphs, sep with <p> tags'),
    media: MediaBasicSchema.optional().describe('media to complement the story'),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
    })).optional(),
  })).describe('Story paragraph with text, media, and actions [ai seconds=10 label="Story Sections"]').optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', props: { itemName: 'paragraph' }, options: [
    new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
    new InputOption({ key: 'content', label: 'Content', input: 'InputProse' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
    new InputOption({ key: 'actions', label: 'Actions', input: 'InputList', options: [
      new InputOption({ key: 'name', label: 'Button Label', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'Button Link', input: 'InputText' }),
    ] }),
  ] }),
]

async function defaultConfig(args: { site?: Site }): Promise<UserConfig> {
  return {
    items: [
      {
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. In my final year, a surprising opportunity arose, leading to a series of events that would forever change the trajectory of my career. Phasellus euismod, risus ac suscipit convallis, erat lacus dignissim sapien, in varius lacus odio ut lorem. This marked the beginning of an odyssey into unexplored territories.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:square']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
      {
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, urna vitae efficitur dictum, metus orci laoreet velit, vel porttitor nunc mi vel erat. I was taken to a secluded location for intense training. Curabitur laoreet consectetur ante, sit amet sollicitudin ex posuere et. Duis feugiat, arcu non aliquam venenatis, mauris ligula vehicula eros, ac posuere ligula arcu a risus. This rigorous regimen transformed me into a more resilient individual.`,
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
      },
      {
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent euismod urna vitae urna bibendum, at interdum nisi dictum. Beyond the physical challenges, there was a focus on intellectual and strategic development. Vestibulum ac leo felis. Morbi gravida consequat neque, ac dictum tortor cursus nec. Etiam condimentum leo orci, vitae efficitur nisl ultrices at. I honed various skills that prepared me for future complex situations.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:square']),
      },
      {
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non mi a libero tincidunt sollicitudin. Curabitur id scelerisque sem. Phasellus convallis est id orci sollicitudin, non tristique nisl fermentum. Quisque consequat, nisl sed laoreet feugiat, sapien metus viverra risus, vel pulvinar leo neque eget augue. My first mission was a significant test of everything I had learned, and it paved the way for the challenges to come.`,
        media: stockMediaHandler.getRandomByTags(['video']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
    ],
  }
}

export const template = cardTemplate({
  templateId,
  category: ['content'],
  description: 'Text that reveals itself as you scroll, with scrolling media items',
  icon: 'i-tabler-compass',
  colorTheme: 'green',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  options,
  isPublic: true,
  schema,
  getUserConfig: async args => defaultConfig(args),
  demoPage: async (args) => {
    const userConfig = await defaultConfig(args)
    return {
      cards: [
        { templateId, userConfig },
      ],
    }
  },
})
