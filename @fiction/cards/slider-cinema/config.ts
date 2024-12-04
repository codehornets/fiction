import type { ConfigResponse } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { actionAreaSchema, ActionButtonSchema, MediaBasicSchema, superTitleSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
// Import media assets
import cityPhoto from './img/city-photo.jpg'
import desertPhoto from './img/desert-photo.mp4'
import mountainPhoto from './img/mountain-photo.mp4'
import nightPhoto from './img/night-photo.mp4'
import wildlifePhoto from './img/wildlife-photo.mp4'

// Core schemas
export const CinemaItemSchema = z.object({
  superTitle: superTitleSchema.optional().describe('Short text (2-5 words) appearing above main header for context or categorization'),
  title: z.string().optional().describe('Primary title text - should be compelling and descriptive'),
  subTitle: z.string().optional().describe('Supporting text that provides additional context or call to action'),
  media: MediaBasicSchema.optional().describe('Background media - supports images or videos for visual impact'),
  action: actionAreaSchema.optional(),
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
          key: 'superTitle.text',
          label: 'Context Label',
          input: 'InputText',
          description: 'Short text appearing above main title (e.g., "Portfolio", "Services")',
          placeholder: 'e.g., Portfolio',
        }),
        new InputOption({
          key: 'title',
          label: 'Main Title',
          input: 'InputText',
          description: 'Primary headline for the slide',
          placeholder: 'e.g., Mountain Expeditions',
        }),
        new InputOption({
          key: 'subTitle',
          label: 'Sub Title',
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
    superTitle: { text: 'Portfolio' },
    title: 'Mountain Expeditions',
    subTitle: 'Capturing Nature\'s Grandeur in the World\'s Highest Peaks',
    media: {
      format: 'video',
      url: mountainPhoto,
    },
    action: {
      buttons: [
        {
          label: 'View Gallery',
          href: '#',
          design: 'outline',
          icon: 'i-tabler-camera',
          theme: 'overlay',
        },
      ],
    },
  },
  {
    superTitle: { text: 'Services' },
    title: 'Desert Photography',
    subTitle: 'Professional Photography in Earth\'s Most Stunning Landscapes',
    media: {
      format: 'video',
      url: desertPhoto,
    },
    action: {
      buttons: [
        { label: 'Book a Session', href: '#', design: 'outline', theme: 'overlay' },
        { label: 'View Pricing', href: '#', design: 'textOnly', iconAfter: 'i-tabler-chevron-right' },
      ],
    },
  },
  {
    superTitle: { text: 'Projects' },
    title: 'Wildlife Photography',
    subTitle: 'Documenting Earth\'s Most Remarkable Creatures',
    media: {
      format: 'video',
      url: wildlifePhoto,
    },
    action: {
      buttons: [
        { label: 'Explore Projects', href: '#', design: 'outline', theme: 'overlay' },
      ],
    },
  },
]

const eventDemo: CinemaItem[] = [
  {
    superTitle: { text: 'Featured Event' },
    title: 'TEDx 2024',
    subTitle: 'Join us for a day of inspiring talks and connections',
    media: {
      format: 'url',
      url: cityPhoto,
    },
    action: {
      buttons: [
        { label: 'Get Tickets', href: '#', design: 'solid', theme: 'primary' },
        { label: 'Learn More', href: '#', design: 'outline', theme: 'overlay' },
      ],
    },
  },
  {
    superTitle: { text: 'After Dark' },
    title: 'Night of Innovation',
    subTitle: 'Evening networking and demonstrations',
    media: {
      format: 'video',
      url: nightPhoto,
    },
    action: {
      buttons: [
        { label: 'Register Now', href: '#', design: 'outline', theme: 'overlay' },
      ],
    },
  },
]

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
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
