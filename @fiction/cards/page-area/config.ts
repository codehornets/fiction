import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import { deepMerge } from '@fiction/core'
import { z } from 'zod'

export type UserConfig = SiteUserConfig

// Demo helper to create content cards
function getDemoContent(type: string) {
  return [
    {
      templateId: 'contentHero',
      userConfig: {
        title: type,
        subTitle: 'Showcase different area styles and capabilities',
        alignment: 'center',
      },
    },
  ]
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  // Enhanced demo configurations
  const demoConfigs: Record<string, SiteUserConfig> = {
    // Clean modern look
    modern: {
      standard: {
        scheme: {
          base: { bg: { backgroundColor: '#1a1a1a' }, theme: 'slate', primary: 'purple' },
          light: { bg: { backgroundColor: '#ffffff' }, theme: 'gray', primary: 'violet' },
        },
        fontStyle: {
          title: { family: 'Plus+Jakarta+Sans', weight: '600' },
          body: { family: 'Inter' },
        },
      },
    },

    // Gradient background
    gradient: {
      standard: {
        scheme: {
          base: {
            bg: {
              gradient: {
                angle: 135,
                stops: [
                  { color: '#1e3a8a', percent: 0 },
                  { color: '#3b82f6', percent: 50 },
                  { color: '#60a5fa', percent: 100 },
                ],
              },
            },
            theme: 'blue',
            primary: 'orange',
          },
        },
      },
    },

    // Elegant serif style
    elegant: {
      standard: {
        scheme: {
          base: { bg: { backgroundColor: '#d02020' }, theme: 'amber', primary: 'rose' },
        },
        fontStyle: {
          title: { family: 'Playfair+Display', weight: '400' },
          body: { family: 'Lora' },
        },
      },
    },

    // Video background
    videoHero: {
      standard: {
        scheme: {
          base: {
            bg: {
              ...stock.getRandomByTags(['video']),
              overlay: { color: 'rgba(0,0,0,0.6)' },
            },
            theme: 'overlay',
            primary: 'cyan',
          },
        },
        fontStyle: {
          title: { family: 'Space+Grotesk', weight: '500' },
        },
      },
    },

    // Image with overlay
    imageOverlay: {
      standard: {
        scheme: {
          base: {
            bg: {
              ...stock.getRandomByTags(['aspect:landscape']),
              overlay: {
                color: 'rgba(15,23,42,0.8)',
                blendMode: 'multiply',
              },
            },
            theme: 'overlay',
            primary: 'emerald',
          },
        },
      },
    },

    // Monochrome style
    monochrome: {
      standard: {
        scheme: {
          base: { bg: { backgroundColor: '#0a0a0a' }, theme: 'gray' },
          light: { bg: { backgroundColor: '#fafafa' }, theme: 'gray' },
        },
        fontStyle: {
          title: { family: 'DM+Sans', weight: '500' },
          body: { family: 'DM+Sans' },
        },
      },
    },

    // Vibrant color
    vibrant: {
      standard: {
        scheme: {
          base: {
            bg: {
              gradient: {
                angle: 45,
                stops: [
                  { color: '#7c3aed', percent: 0 },
                  { color: '#db2777', percent: 100 },
                ],
              },
            },
            theme: 'slate',
            primary: 'pink',
          },
        },
        fontStyle: {
          title: { family: 'DM+Sans', weight: '500' },
        },
      },
    },

    // Minimal light
    minimal: {
      standard: {
        scheme: {
          reverse: true,
          base: { bg: { backgroundColor: '#ffffff' }, theme: 'gray', primary: 'slate' },
        },
        fontStyle: {
          title: { family: 'Satoshi', weight: '500' },
          body: { family: 'Satoshi' },
        },
      },
    },
  } as const

  return {
    schema: z.object({}),
    options: [],
    userConfig: {},
    demoPage: {
      cards: [
        // Modern bases
        { templateId, userConfig: demoConfigs.modern, cards: getDemoContent('Modern Style') },
        { templateId, userConfig: demoConfigs.minimal, cards: getDemoContent('Minimal Light') },
        { templateId, userConfig: demoConfigs.monochrome, cards: getDemoContent('Monochrome') },

        // Rich backgrounds
        { templateId, userConfig: demoConfigs.gradient, cards: getDemoContent('Gradient Background') },
        { templateId, userConfig: deepMerge([demoConfigs.modern, demoConfigs.videoHero]), cards: getDemoContent('Video Background') },
        { templateId, userConfig: demoConfigs.imageOverlay, cards: getDemoContent('Image Overlay') },

        // Typography focused
        { templateId, userConfig: demoConfigs.elegant, cards: getDemoContent('Elegant Serif') },
        { templateId, userConfig: demoConfigs.vibrant, cards: getDemoContent('Vibrant Style') },
      ],
    },
  }
}
