import { colorThemeUser, fontFamilySchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

export const SchemaTicker = z.object({
  text: z.string().optional().describe('Text content to display'),
  href: z.string().optional().describe('Optional link URL'),

  // Animation
  speed: z.number().min(0).max(100).default(50).optional().describe('Base animation speed'),
  direction: z.enum(['left', 'right']).default('left').optional().describe('Scroll direction'),

  // Styling
  font: fontFamilySchema.optional().describe('Custom font family'),
  backgroundColor: z.string().optional().describe('Background color in light mode'),
  backgroundColorDark: z.string().optional().describe('Background color in dark mode'),
  textColor: z.enum(colorThemeUser).optional().describe('Text color theme'),
  outline: z.boolean().default(false).optional().describe('Apply text outline effect'),

  // 3D Transform
  transform: z.object({
    rotateX: z.number().min(-30).max(30).default(0).optional().describe('3D rotation around X-axis'),
    rotateY: z.number().min(-30).max(30).default(0).optional().describe('3D rotation around Y-axis'),
    rotateZ: z.number().min(-30).max(30).default(0).optional().describe('3D rotation around Z-axis'),
  }).default({}).optional(),
})

// Schema with improved organization and descriptions
export const schema = z.object({
  settings: z.object({
    fontSize: z.number().min(5).max(15).optional().describe('Base font size in viewport width units'),
    scrollEffect: z.boolean().default(true).optional().describe('Enable scroll-based animation speed effect'),
    scrollIntensity: z.number().min(0).max(100).default(25).optional().describe('How much scroll position affects animation speed (%)'),
  }).optional().describe('Global ticker settings'),

  items: z.array(SchemaTicker).default([]).describe('Array of ticker items [ai label=Ticker Items]'),
})

export type UserConfig = z.infer<typeof schema>

export type TickerConfig = z.infer<typeof SchemaTicker>

export function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'settings',
      label: 'Global Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'fontSize',
          label: 'Font Size',
          input: 'InputRange',
          props: { min: 5, max: 15, step: 0.5 },
        }),
        new InputOption({
          key: 'scrollEffect',
          label: 'Scroll Animation',
          input: 'InputToggle',
          description: 'Speed up animation while scrolling',
        }),
        new InputOption({
          key: 'scrollIntensity',
          label: 'Scroll Effect Intensity',
          input: 'InputRange',
          props: { min: 0, max: 100, step: 5 },
          description: 'How much scroll affects animation speed',
        }),
      ],
    }),
    new InputOption({
      key: 'items',
      label: 'Ticker Items',
      input: 'InputList',
      description: 'Add scrolling text elements',
      props: {
        itemLabel: 'Ticker',
      },
      options: [
        new InputOption({
          key: 'text',
          label: 'Text',
          input: 'InputText',
          isRequired: true,
        }),
        new InputOption({
          key: 'href',
          label: 'Link URL',
          input: 'InputUrl',
        }),
        new InputOption({
          key: 'animation',
          label: 'Animation',
          input: 'group',
          options: [
            new InputOption({
              key: 'speed',
              label: 'Speed',
              input: 'InputRange',
              props: { min: 0, max: 100, step: 5 },
            }),
            new InputOption({
              key: 'direction',
              label: 'Direction',
              input: 'InputRadio',
              props: {
                options: [
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' },
                ],
              },
            }),
          ],
        }),
        new InputOption({
          key: 'appearance',
          label: 'Appearance',
          input: 'group',
          options: [
            new InputOption({
              key: 'font',
              label: 'Font',
              input: 'InputFont',
            }),
            new InputOption({
              key: 'backgroundColor',
              label: 'Background Color',
              input: 'InputColor',
            }),
            new InputOption({
              key: 'backgroundColorDark',
              label: 'Dark Mode Background',
              input: 'InputColor',
            }),
            new InputOption({
              key: 'textColor',
              label: 'Text Color',
              input: 'InputColorScheme',
            }),
            new InputOption({
              key: 'outline',
              label: 'Text Outline',
              input: 'InputToggle',
            }),
          ],
        }),
        new InputOption({
          key: 'transform',
          label: '3D Transform',
          input: 'group',
          options: [
            new InputOption({
              key: 'rotateX',
              label: 'Tilt Forward/Back',
              input: 'InputRange',
              props: { min: -30, max: 30, step: 1 },
            }),
            new InputOption({
              key: 'rotateY',
              label: 'Tilt Left/Right',
              input: 'InputRange',
              props: { min: -30, max: 30, step: 1 },
            }),
            new InputOption({
              key: 'rotateZ',
              label: 'Rotate',
              input: 'InputRange',
              props: { min: -30, max: 30, step: 1 },
            }),
          ],
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return {
    settings: {
      fontSize: 8,
      scrollEffect: true,
      scrollIntensity: 25,
    },
    items: [{
      text: 'Add your first ticker message here — perfect for announcements, news, or promotions.',
      speed: 30,
      direction: 'left',
      transform: {
        rotateX: 5,
        rotateY: 5,
        rotateZ: -2,
      },
    }],
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    business: {
      templateId,
      userConfig: {
        settings: {
          fontSize: 6,
          scrollEffect: true,
          scrollIntensity: 25,
        },
        items: [
          {
            text: '🎉 Special offer: Get 20% off all products with code SUMMER2024',
            speed: 40,
            direction: 'left',
            backgroundColor: '#2563eb',
            backgroundColorDark: '#1e40af',
            href: '#special-offer',
          },
          {
            text: '📦 Free shipping on orders over $50 • Limited time only',
            speed: 45,
            direction: 'right',
            backgroundColor: '#059669',
            backgroundColorDark: '#065f46',
          },
        ],
      },
    },
    creative: {
      templateId,
      userConfig: {
        settings: {
          fontSize: 7,
          scrollEffect: true,
          scrollIntensity: 35,
        },
        items: [
          {
            text: 'Create • Innovate • Inspire',
            speed: 30,
            direction: 'left',
            outline: true,
            transform: {
              rotateX: -5,
              rotateY: 10,
              rotateZ: 2,
            },
          },
          {
            text: 'Design • Develop • Deploy',
            speed: 35,
            direction: 'right',
            font: { family: 'highlight' },
            transform: {
              rotateX: 5,
              rotateY: -10,
              rotateZ: -2,
            },
          },
        ],
      },
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
