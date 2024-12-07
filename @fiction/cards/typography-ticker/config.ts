import { fontFamilySchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

export const SchemaTicker = z.object({
  text: z.string().optional().describe('Text content to display'),
  href: z.string().optional().describe('Optional link URL'),

  // Animation
  speed: z.number().min(0).max(100).default(50).optional().describe('Base animation speed'),
  direction: z.enum(['left', 'right']).default('left').optional().describe('Scroll direction'),

  // Styling
  font: fontFamilySchema.optional().describe('Custom font family'),
  backgroundColor: z.string().optional().describe('Background color'),
  backgroundColorLight: z.string().optional().describe('Background color in light mode'),
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
  fontSize: z.number().min(5).max(15).optional().describe('Base font size in viewport width units'),
  scrollEffect: z.boolean().default(true).optional().describe('Enable scroll-based animation speed effect'),
  scrollIntensity: z.number().min(0).max(100).default(25).optional().describe('How much scroll position affects animation speed (%)'),

  items: z.array(SchemaTicker).default([]).describe('Array of ticker items [ai label=Ticker Items]'),
})

export type UserConfig = z.infer<typeof schema>

export type TickerConfig = z.infer<typeof SchemaTicker>

export function getOptions() {
  return [
    createOption({
      schema,
      key: 'group.ticker',
      label: 'Ticker Items',
      input: 'group',
      icon: { class: 'i-tabler-arrow-autofit-width' },
      options: [
        createOption({
          schema,
          key: 'items',
          label: 'Ticker Items',
          input: 'InputList',
          description: 'Add scrolling text elements',
          props: {
            itemName: 'Ticker',
            itemLabel: args => (args?.item as TickerConfig)?.text ?? 'Untitled',
          },
          options: [
            createOption({
              schema,
              key: 'items.0.text',
              label: 'Text',
              input: 'InputText',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'items.0.href',
              label: 'Link URL',
              input: 'InputUrl',
            }),
            createOption({
              schema,
              key: 'items.0.animation',
              label: 'Animation',
              input: 'group',
              options: [
                createOption({
                  schema,
                  key: 'items.0.speed',
                  label: 'Speed',
                  input: 'InputRange',
                  props: { min: 0, max: 100, step: 5 },
                }),
                createOption({
                  schema,
                  key: 'items.0.direction',
                  label: 'Direction',
                  input: 'InputRadioButton',
                  list: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                }),
              ],
            }),
            createOption({
              schema,
              key: 'appearance',
              label: 'Appearance',
              input: 'group',
              options: [
                createOption({
                  schema,
                  key: 'items.0.font',
                  label: 'Font',
                  input: 'InputFont',
                }),
                createOption({
                  schema,
                  key: 'items.0.backgroundColor',
                  label: 'Background Color',
                  input: 'InputColor',
                }),
                createOption({
                  schema,
                  key: 'items.0.backgroundColorLight',
                  label: 'Background Color (Light Mode)',
                  input: 'InputColor',
                }),

                createOption({
                  schema,
                  key: 'items.0.outline',
                  label: 'Text Outline',
                  input: 'InputToggle',
                }),
              ],
            }),
            createOption({
              schema,
              key: 'transform',
              label: '3D Transform',
              input: 'group',
              options: [
                createOption({
                  schema,
                  key: 'items.0.transform.rotateX',
                  label: 'Tilt Forward/Back',
                  input: 'InputRange',
                  props: { min: -30, max: 30, step: 1 },
                }),
                createOption({
                  schema,
                  key: 'items.0.transform.rotateY',
                  label: 'Tilt Left/Right',
                  input: 'InputRange',
                  props: { min: -30, max: 30, step: 1 },
                }),
                createOption({
                  schema,
                  key: 'items.0.transform.rotateZ',
                  label: 'Rotate',
                  input: 'InputRange',
                  props: { min: -30, max: 30, step: 1 },
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'group.settings',
      label: 'Settings',
      input: 'group',
      icon: { class: 'i-tabler-settings' },
      options: [
        createOption({
          schema,
          key: 'fontSize',
          label: 'Font Size',
          input: 'InputRange',
          props: { min: 5, max: 15, step: 0.5 },
        }),
        createOption({
          schema,
          key: 'scrollEffect',
          label: 'Scroll Animation',
          input: 'InputToggle',
          description: 'Speed up animation while scrolling',
        }),
        createOption({
          schema,
          key: 'scrollIntensity',
          label: 'Scroll Effect Intensity',
          input: 'InputRange',
          props: { min: 0, max: 100, step: 5 },
          description: 'How much scroll affects animation speed',
        }),
      ],
    }),

  ]
}

function getDefaultConfig(): UserConfig {
  return {
    fontSize: 8,
    scrollEffect: true,
    scrollIntensity: 25,
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
        fontSize: 6,
        scrollEffect: true,
        scrollIntensity: 25,
        items: [
          {
            text: '🎉 Special offer: Get 20% off all products with code SUMMER2024',
            speed: 40,
            direction: 'left',
            backgroundColorLight: '#2563eb',
            backgroundColor: '#1e40af',
            href: '#special-offer',
          },
          {
            text: '📦 Free shipping on orders over $50 • Limited time only',
            speed: 45,
            direction: 'right',
            backgroundColorLight: '#059669',
            backgroundColor: '#065f46',
          },
        ],
      },
    },
    creative: {
      templateId,
      userConfig: {
        fontSize: 7,
        scrollEffect: true,
        scrollIntensity: 35,
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
