import type { ConfigResponse } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { actionAreaSchema, ActionButtonSchema, colorThemeUser, navListItemSchema, superTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definitions
const detailSchema = navListItemSchema.pick({
  label: true,
  description: true,
  value: true,
  icon: true,
  href: true,
})

const mediaSchema = navListItemSchema.pick({
  media: true,
})

export const schema = z.object({
  title: z.string().optional().describe('Primary headline for profile 3 to 8 words [ai]'),
  content: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]'),
  superTitle: superTitleSchema.optional(),
  layout: z.enum(['left', 'right']).optional().describe('Media on left or right'),
  theme: z.enum(colorThemeUser).optional().describe('Color theme for the profile'),
  mediaItems: z.array(mediaSchema).optional().describe('Splash pictures in portrait format [ai seconds=40]'),
  detailsTitle: z.string().optional().describe('Title for list of details [ai]'),
  details: z.array(detailSchema).optional().describe('List of details with contact details, location, etc.'),
  links: actionAreaSchema.optional().describe('List of social media links'),
})

export type UserConfig = z.infer<typeof schema>

// Input options configuration
const options: InputOption[] = [
  new InputOption({
    key: 'layout',
    input: 'InputSelect',
    label: 'Layout Style',
    list: [
      { name: 'Media on Left', value: 'left' },
      { name: 'Media on Right', value: 'right' },
    ],
  }),
  new InputOption({
    key: 'theme',
    input: 'InputSelect',
    label: 'Color Theme',
    props: { list: colorThemeUser },
  }),
  new InputOption({
    key: 'mediaItems',
    label: 'Profile Media',
    input: 'InputList',
    props: { itemName: 'Image / Video' },
    options: [new InputOption({ key: 'media', input: 'InputMedia' })],
  }),
  new InputOption({ key: 'title', input: 'InputText', label: 'Main Headline' }),
  new InputOption({ key: 'superTitle.text', input: 'InputText', label: 'Upper Tagline' }),
  new InputOption({ key: 'content', input: 'InputProse', label: 'Profile Content' }),
  new InputOption({ key: 'detailsTitle', input: 'InputText', label: 'Details Section Title' }),
  new InputOption({
    key: 'details',
    input: 'InputList',
    props: { itemName: 'Contact Detail' },
    options: [
      new InputOption({ key: 'label', input: 'InputText', label: 'Label' }),
      new InputOption({ key: 'description', input: 'InputText', label: 'Value' }),
      new InputOption({ key: 'icon', input: 'InputIcon', label: 'Icon' }),
      new InputOption({ key: 'href', input: 'InputUrl', label: 'Link URL' }),
    ],
  }),
  new InputOption({
    key: 'links.buttons',
    input: 'InputList',
    label: 'Links',
    props: { itemName: 'Link' },
    options: [
      new InputOption({ key: 'label', input: 'InputText', label: 'Label' }),
      new InputOption({ key: 'href', input: 'InputUrl', label: 'URL' }),
      new InputOption({ key: 'icon', input: 'InputIcon', label: 'Icon' }),
    ],
  }),
]

// Default content with instructional copy
async function getUserConfig(args: { factory: CardFactory }): Promise<UserConfig & SiteUserConfig> {
  const { factory } = args
  const stock = await factory.getStockMedia()

  return {
    superTitle: { text: 'Your Professional Role' },
    title: 'Crafting Your Perfect Professional Story',
    content: `<p>Notice how a well-structured bio can capture attention instantly? Start with your most compelling achievements or unique value proposition. Keep it concise yet impactful.</p>
<p>Imagine connecting with your audience through carefully chosen words that reflect your authentic voice while maintaining professional credibility. Remember to highlight your expertise and what makes you uniquely qualified.</p>`,
    theme: 'blue',
    mediaItems: [
      { media: stock.getRandomByTags(['aspect:portrait']) },
      { media: stock.getRandomByTags(['aspect:portrait']) },
    ],
    detailsTitle: 'Let\'s Connect',
    details: [
      { label: 'Location', value: 'Your City, Country', icon: { iconId: 'map' } },
      { label: 'Email', value: 'hello@yourdomain.com', href: 'mailto:hello@example.com', icon: { iconId: 'mail' } },
      { label: 'Availability', value: 'Open to Opportunities', icon: { iconId: 'calendar' } },
      { label: 'Phone', value: '(555) 123-4567', href: 'tel:+15551234567', icon: { iconId: 'phone' } },
    ],
    links: {
      buttons: [
        { label: 'Connect on LinkedIn', href: '#', icon: { iconId: 'linkedin' } },
        { label: 'Follow on X', href: '#', icon: { iconId: 'x' } },
        { label: 'View Portfolio', href: '#', icon: { iconId: 'external-link' } },
      ],
    },
  }
}

// Demo variants showcasing different use cases
async function getDemoUserConfig(args: { factory: CardFactory }): Promise<UserConfig[]> {
  const { factory } = args
  const stock = await factory.getStockMedia()

  return [
    // Executive Profile
    {
      layout: 'right',
      theme: 'slate',
      superTitle: { text: 'Chief Executive Officer' },
      title: 'Leading Innovation Through Vision',
      content: `<p>See how a strong executive presence can be established through thoughtful imagery and precise language? Notice the professional yet approachable tone that builds trust.</p>
<p>Feel the impact of a leadership narrative that combines strategic insight with personal authenticity. Watch how selective details reinforce executive credibility.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
      ],
      detailsTitle: 'Executive Contact',
      details: [
        { label: 'Office', value: 'Global HQ, New York', icon: { iconId: 'building' } },
        { label: 'Assistant', value: 'executive.office@company.com', href: 'mailto:example@company.com', icon: { iconId: 'mail' } },
      ],
      links: {
        buttons: [
          { label: 'View Leadership Profile', href: '#', icon: { iconId: 'briefcase' }, theme: 'primary' },
          { label: 'LinkedIn Presence', href: '#', icon: { iconId: 'linkedin' } },
        ],
      },
    },

    // Creative Professional
    {
      layout: 'left',
      theme: 'violet',
      superTitle: { text: 'Design Director & Artist' },
      title: 'Where Creativity Meets Strategy',
      content: `<p>Imagine capturing your creative spirit while maintaining professional credibility. Notice how the layout balances artistic expression with business acumen.</p>
<p>Experience the power of visual storytelling through carefully curated images and typography that reflect your creative expertise.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
        { media: stock.getRandomByTags(['object']) },
      ],
      detailsTitle: 'Studio Details',
      details: [
        { label: 'Studio', value: 'Brooklyn Design District', icon: { iconId: 'palette' } },
        { label: 'Portfolio', value: 'View Latest Work', href: '#', icon: { iconId: 'image' } },
      ],
      links: {
        buttons: [
          { label: 'Instagram Portfolio', href: '#', icon: { iconId: 'instagram' }, theme: 'violet' },
          { label: 'Behance Projects', href: '#', icon: { iconId: 'external-link' } },
        ],
      },
    },

    // Technology Expert
    {
      layout: 'right',
      theme: 'cyan',
      superTitle: {
        text: 'Tech Innovation Lead',
        theme: 'orange',
        icon: { class: 'i-tabler-briefcase' },
      },
      title: 'Engineering Tomorrow\'s Solutions',
      content: `<p>Watch how technical expertise can be communicated in an engaging, accessible way. Notice the balance between professional accomplishments and approachable personality.</p>
<p>Discover how highlighting key technologies and achievements can build credibility while maintaining a forward-thinking perspective.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
      ],
      detailsTitle: 'Tech Connect',
      details: [
        { label: 'Specialties', description: 'AI & Machine Learning', icon: { iconId: 'code' } },
        { label: 'GitHub', description: '@techleader', href: '#', icon: { iconId: 'github' } },
      ],
      links: {
        buttons: [
          { label: 'Tech Blog', href: '#', icon: { iconId: 'rss' }, theme: 'orange' },
          { label: 'Stack Overflow', href: '#', icon: { iconId: 'terminal' }, theme: 'orange', design: 'outline' },
        ],
      },
    },
  ]
}

export async function getConfig(args: { factory: CardFactory }): Promise<ConfigResponse> {
  return {
    schema,
    options,
    userConfig: await getUserConfig(args),
    demoPage: {
      cards: (await getDemoUserConfig(args)).map(userConfig => ({
        templateId: 'profile',
        userConfig,
      })),
    },
  }
}
