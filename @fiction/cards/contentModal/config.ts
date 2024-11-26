import type { CardFactory } from '@fiction/site/cardFactory'
import type { UserConfig as FeaturesUserConfig } from '../features/config'
import { z } from 'zod'

// Simple schema for global modal settings
export const schema = z.object({
  // No user configuration needed as this is handled via URL parameters
})

export type UserConfig = z.infer<typeof schema>

// Default user config is empty since this is a global utility
function getUserConfig(): UserConfig {
  return {}
}

// Demo using a features card to showcase media modal functionality
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId } = args

  // Create a features card to demonstrate the modal
  const demoFeatures = {
    templateId: 'features',
    userConfig: {
      layout: {
        style: 'grid',
        columns: '3',
        spacing: 'normal',
        align: 'center',
      },
      features: [
        {
          title: 'Watch Product Demo',
          description: 'See our platform in action with our newly released demo video. Click to watch in high-definition.',
          icon: { iconId: 'play' },
          color: 'blue',
          action: {
            buttons: [{
              label: 'Watch Demo',
              icon: { iconId: 'play' },
              theme: 'primary',
              href: '?_pop=https://www.youtube.com/watch?v=6bDrYTXQLu8&autoplay=1',
            }],
          },
        },
        {
          title: 'Behind The Scenes',
          description: 'Get an exclusive look at how we create and deliver value for our customers.',
          icon: { iconId: 'video' },
          color: 'violet',
          action: {
            buttons: [{
              label: 'Watch Now',
              icon: { iconId: 'play' },
              theme: 'violet',
              href: '?_pop=https://vimeo.com/824804225&width=90vw',
            }],
          },
        },
        {
          title: 'Product Updates',
          description: 'Explore the latest features and improvements we\'ve added to the platform.',
          icon: { iconId: 'presentation' },
          color: 'emerald',
          action: {
            buttons: [{
              label: 'Latest Updates',
              icon: { iconId: 'play' },
              theme: 'emerald',
              href: '?_pop=https://www.youtube.com/watch?v=6bDrYTXQLu8&size=large',
            }],
          },
        },
      ],
      style: {
        iconSize: 'lg',
        iconStyle: 'duotone',
      },
    } satisfies FeaturesUserConfig,
  }

  // Include contentModal
  const contentModal = {
    templateId,
    userConfig: getUserConfig(),
  }

  return {
    schema,
    options: [], // No options needed since configuration is via URL
    userConfig: getUserConfig(),
    demoPage: {
      cards: [
        demoFeatures,
        contentModal,
      ],
    },
  }
}
