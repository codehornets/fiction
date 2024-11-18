import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { MediaBasicSchema, MediaIconSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'profile'

export const schema = z.object({
  title: z.string().optional().describe('Primary headline for profile 3 to 8 words [ai]'),
  content: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]'),
  superTitle: z.string().optional().describe('Shorter badge above headline, 2 to 5 words [ai]'),
  layout: z.union([z.literal('left'), z.literal('right')]).optional().describe('Media on left or right'),
  detailsTitle: z.string().optional().describe('Title for list of details [ai]'),
  mediaItems: z.array(z.object({
    media: MediaBasicSchema.optional().describe('Media item with image or video'),
  })).optional().describe('Splash picture in portrait format  [ai seconds=40]'),
  details: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    icon: z.string().optional(),
    href: z.string().optional(),
  })).optional().describe('List of details with contact details, location, etc.'),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    media: MediaIconSchema.optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'layout',
    input: 'InputSelect',
    label: 'Layout',
    list: [
      { name: 'Media on Left', value: 'left' },
      { name: 'Media on Right', value: 'right' },
    ],
  }),
  new InputOption({ key: 'mediaItems', input: 'InputList', label: 'Media', props: { itemName: 'Image / Video' }, options: [
    new InputOption({ key: 'media', input: 'InputMedia' }),
  ] }),
  new InputOption({ key: 'title', input: 'InputText', label: 'Headline' }),
  new InputOption({ key: 'superTitle', input: 'InputText', label: 'Tagline' }),
  new InputOption({ key: 'content', input: 'InputProse', label: 'Profile Content' }),
  new InputOption({ key: 'detailsTitle', input: 'InputText', label: 'Details Title' }),
  new InputOption({ key: 'details', input: 'InputList', props: { itemName: 'Profile Detail' }, options: [
    new InputOption({ key: 'name', input: 'InputText', label: 'Detail Name' }),
    new InputOption({ key: 'desc', input: 'InputText', label: 'Detail Description' }),
    new InputOption({ key: 'icon', input: 'InputIcon', label: 'Detail Icon' }),
    new InputOption({ key: 'href', input: 'InputText', label: 'Detail Link' }),
  ] }),
  new InputOption({ key: 'socials', input: 'InputList', label: 'Social / Links', props: { itemName: 'Social Media' }, options: [
    new InputOption({ key: 'name', input: 'InputText', label: 'Social Name' }),
    new InputOption({ key: 'href', input: 'InputUrl', label: 'Social Link' }),
    new InputOption({ key: 'media', input: 'InputIcon', label: 'Social Icon' }),
  ] }),
]

async function getUserConfig(args: { factory: CardFactory }): Promise<UserConfig & SiteUserConfig> {
  const { factory } = args
  const stock = await factory.getStockMedia()
  return {
    superTitle: 'Name or Tagline',
    title: 'A Few Words That Describe What You Do',
    content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
    mediaItems: [
      {
        media: stock.getRandomByTags(['aspect:portrait', 'person']),
      },
      {
        media: stock.getRandomByTags(['aspect:portrait', 'person']),
      },
    ],
    detailsTitle: 'Let\'s Connect',
    details: [
      { name: 'Location', desc: 'Somewhere, USA' },
      { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
      { name: 'Phone', desc: '123-456-7890' },
    ],
    socials: [
      { name: 'follow @fictionco on facebook', href: '#', media: { iconId: 'facebook' } },
      { name: 'follow @fictionco on x', href: '#', media: { iconId: 'x' } },
      { name: 'connect with @fictionco on linkedin', href: '#', media: { iconId: 'linkedin' } },
    ],
  }
}

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
  icon: 'i-tabler-user',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getUserConfig: args => getUserConfig(args),
  isPublic: true,
  options,
  schema,
  demoPage: async (args) => {
    return { cards: [
      { templateId, userConfig: { ...(await getUserConfig(args)) } },
      { templateId, userConfig: { ...(await getUserConfig(args)), layout: 'left' as const } },
    ] }
  },
})
