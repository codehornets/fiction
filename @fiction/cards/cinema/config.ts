import type { ConfigResponse } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { ActionButtonSchema, MediaBasicSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
// Import media assets
import cityPhoto from './city-photo.jpg'
import desertPhoto from './desert-photo.mp4'
import mountainPhoto from './mountain-photo.mp4'
import nightPhoto from './night-photo.mp4'
import wildlifePhoto from './wildlife-photo.mp4'

// Core schemas
export const CinemaItemSchema = z.object({
  superHeader: z.string().optional().describe('Short text (2-5 words) appearing above main header for context or categorization'),
  header: z.string().optional().describe('Primary heading text - should be compelling and descriptive'),
  subHeader: z.string().optional().describe('Supporting text that provides additional context or call to action'),
  media: MediaBasicSchema.optional().describe('Background media - supports images or videos for visual impact'),
  actions: z.array(ActionButtonSchema).optional().describe('Call-to-action buttons for driving engagement'),
})

export const schema = z.object({
  items: z.array(CinemaItemSchema).optional().describe('Array of slides to display in the cinema view'),
  autoSlide: z.boolean().optional().describe('Enable automatic slide transitions every 12 seconds'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig
export type CinemaItem = z.infer<typeof CinemaItemSchema>

// Input options configuration
export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'items',
      label: 'Slides',
      input: 'InputList',
      description: 'Add and configure slides with background media and content',
      options: [
        new InputOption({
          key: 'superHeader',
          label: 'Context Label',
          input: 'InputText',
          description: 'Short text appearing above main header (e.g., "Portfolio", "Services")',
          placeholder: 'e.g., Portfolio',
        }),
        new InputOption({
          key: 'header',
          label: 'Main Heading',
          input: 'InputText',
          description: 'Primary headline for the slide',
          placeholder: 'e.g., Mountain Expeditions',
        }),
        new InputOption({
          key: 'subHeader',
          label: 'Supporting Text',
          input: 'InputText',
          description: 'Additional context or call-to-action text',
          placeholder: 'e.g., Discover our latest adventures',
        }),
        new InputOption({
          key: 'media',
          label: 'Background Media',
          input: 'InputMedia',
          description: 'Full-screen background image or video',
          props: {
            formats: { url: true, image: true, video: true },
            aspectRatio: '16:9',
          },
        }),
        new InputOption({
          key: 'actions',
          label: 'Call-to-Action Buttons',
          input: 'InputActions',
          description: 'Add buttons to drive user engagement',
        }),
      ],
    }),
    new InputOption({
      key: 'autoSlide',
      label: 'Auto-Advance Slides',
      input: 'InputToggle',
      description: 'Automatically transition between slides every 12 seconds',
    }),
  ]
}

// Demo configurations showcasing different use cases
const photographyDemo: CinemaItem[] = [
  {
    superHeader: 'Portfolio',
    header: 'Mountain Expeditions',
    subHeader: 'Capturing Nature\'s Grandeur in the World\'s Highest Peaks',
    media: {
      format: 'video',
      url: mountainPhoto,
    },
    actions: [
      {
        name: 'View Gallery',
        href: '#',
        design: 'outline',
        icon: 'i-tabler-camera',
        theme: 'overlay',
      },
    ],
  },
  {
    superHeader: 'Services',
    header: 'Desert Photography',
    subHeader: 'Professional Photography in Earth\'s Most Stunning Landscapes',
    media: {
      format: 'video',
      url: desertPhoto,
    },
    actions: [
      { name: 'Book a Session', href: '#', design: 'outline', theme: 'overlay' },
      { name: 'View Pricing', href: '#', design: 'textOnly', iconAfter: 'i-tabler-chevron-right' },
    ],
  },
  {
    superHeader: 'Projects',
    header: 'Wildlife Photography',
    subHeader: 'Documenting Earth\'s Most Remarkable Creatures',
    media: {
      format: 'video',
      url: wildlifePhoto,
    },
    actions: [
      { name: 'Explore Projects', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
]

const eventDemo: CinemaItem[] = [
  {
    superHeader: 'Featured Event',
    header: 'TEDx 2024',
    subHeader: 'Join us for a day of inspiring talks and connections',
    media: {
      format: 'url',
      url: cityPhoto,
    },
    actions: [
      { name: 'Get Tickets', href: '#', design: 'solid', theme: 'primary' },
      { name: 'Learn More', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
  {
    superHeader: 'After Dark',
    header: 'Night of Innovation',
    subHeader: 'Evening networking and demonstrations',
    media: {
      format: 'video',
      url: nightPhoto,
    },
    actions: [
      { name: 'Register Now', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
]

export async function getConfig(args: { templateId: string, factory: CardFactory }): Promise<ConfigResponse> {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: {
      items: photographyDemo,
      autoSlide: true,
    },
    demoPage: {
      cards: [
        {
          templateId,
          title: 'Photography Portfolio',
          description: 'Showcase photography work with full-screen media',
          userConfig: {
            items: photographyDemo,
            autoSlide: true,
          },
        },
        {
          templateId,
          title: 'Event Promotion',
          description: 'Promote upcoming events with dramatic visuals',
          userConfig: {
            items: eventDemo,
            autoSlide: true,
          },
        },
      ],
    },
  }
}
