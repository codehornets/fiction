import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import { ActionButtonSchema, MediaBasicSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const schema = z.object({
  items: z.array(z.object({
    content: z.string().optional().describe('Your story text - aim for 2-3 engaging paragraphs that draw readers in'),
    media: MediaBasicSchema.optional()
      .describe('Visual element that enhances your story - choose images that create emotional connection'),
    actions: z.array(ActionButtonSchema).optional().describe('Optional calls-to-action to engage readers at key moments'),
  })).describe('Story sections that reveal as users scroll'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'items',
    label: 'Story Sections',
    description: 'Create your narrative flow section by section',
    input: 'InputList',
    props: { itemLabel: 'Story Section' },
    options: [
      new InputOption({
        key: 'content',
        label: 'Story Text',
        description: 'Share your narrative in a compelling way',
        input: 'InputProse',
        props: {
          placeholder: 'Begin telling your story...',
          rows: 4,
        },
      }),
      new InputOption({
        key: 'media',
        label: 'Visual Element',
        description: 'Choose imagery that amplifies your message',
        input: 'InputMedia',
        props: { aspectRatio: '1:1' },
      }),
      new InputOption({
        key: 'actions',
        label: 'Call to Action',
        description: 'Add engaging next steps for your readers',
        input: 'InputActions',
      }),
    ],
  }),
]

async function getDefaultConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const stock = await args.factory.getStockMedia()

  return {
    items: [
      {
        content: `<p>Notice how your story begins to unfold as readers scroll down the page. This engaging format naturally draws attention and keeps your audience immersed in your narrative.</p>
                 <p>See how the images beside your text create visual anchor points, helping readers connect with key moments in your story while maintaining a smooth reading flow.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
      },
      {
        content: `<p>Watch how each new section reveals itself at just the right moment. This pacing helps build anticipation and keeps readers engaged with your content.</p>
                 <p>Experience how the clean layout ensures your message remains front and center, while supporting visuals add depth without overwhelming.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
      },
      {
        content: `<p>Feel the natural rhythm as text and images work together to tell your story. This balanced approach helps maintain reader interest while effectively communicating your message.</p>
                 <p>Imagine your own narrative unfolding this way - whether you're sharing a company history, showcasing a project, or telling your brand story.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
        actions: [{ label: 'Start Your Story', href: '#' }],
      },
    ],
  }
}

async function getDemoConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const stock = await args.factory.getStockMedia()

  return {
    items: [
      {
        content: `<p>[text_effect]Imagine[/text_effect] stepping into a world where innovation meets possibility. Our journey began in a small garage, with nothing but a vision and an unwavering determination to change how people interact with technology.</p>
                 <p>See how that simple beginning transformed into something extraordinary - a revolution in human-computer interaction that would touch millions of lives.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
      },
      {
        content: `<p>Watch as years of research and countless iterations culminated in our breakthrough moment. The team's persistence paid off when we finally achieved what many had deemed impossible.</p>
                 <p>Feel the excitement as our first prototype exceeded all expectations, setting new standards for what technology could achieve.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
      },
      {
        content: `<p>Today, witness the impact of our innovation across industries, transforming how businesses operate and people connect. But this is just the beginning of our story.</p>
                 <p>Join us as we continue pushing boundaries and imagine what's possible when vision meets determination.</p>`,
        media: stock.getRandomByTags(['aspect:square']),
        actions: [{ label: 'Join Our Journey', href: '#', theme: 'primary' }],
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }){
  return {
    schema,
    options,
    userConfig: await getDefaultConfig(args),
    demoPage: {
      cards: [{
        templateId: args.templateId,
        userConfig: await getDemoConfig(args),
      }],
    },
  }
}
