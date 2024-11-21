import type { ConfigResponse } from '@fiction/site/card'
import { BlendModesSchema, UiOriginSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

// Individual shape properties
const ShapeSchema = z.object({
  shape: z.enum([
    'circle',
    'square',
    'triangle',
    'hexagon',
    'diamond',
    'star',
  ]).optional().describe('Geometric shape to display'),

  style: z.object({
    color: z.string().optional().describe('Custom color (hex or rgb)'),
    theme: z.enum(['primary', 'theme']).optional().describe('Use theme color'),
    opacity: z.number().min(0).max(100).optional().describe('Shape transparency'),
    blendMode: BlendModesSchema.optional().describe('Blend mode with background'),
    scale: z.number().min(0.1).max(5).optional().describe('Size multiplier'),
  }).optional(),

  animation: z.object({
    rotate: z.number().min(-360).max(360).optional().describe('Rotation angle'),
    duration: z.number().min(0).max(10).optional().describe('Animation duration in seconds'),
    delay: z.number().min(0).max(10).optional().describe('Animation start delay'),
  }).optional(),

  position: z.object({
    origin: UiOriginSchema.optional().describe('Anchor point position'),
    offsetX: z.number().min(-100).max(100).optional().describe('Horizontal offset in %'),
    offsetY: z.number().min(-100).max(100).optional().describe('Vertical offset in %'),
    zIndex: z.number().min(-10).max(10).optional().describe('Stack order'),
  }).optional(),
}).describe('Individual shape configuration')

// Main schema for shape effect
export const schema = z.object({
  shapes: z.array(ShapeSchema).optional().describe('Array of shapes to display'),
  responsive: z.object({
    mobileScale: z.number().min(0.1).max(2).optional().describe('Scale factor for mobile devices'),
    tabletScale: z.number().min(0.1).max(2).optional().describe('Scale factor for tablet devices'),
  }).optional(),
  interaction: z.object({
    mouseFollow: z.boolean().optional().describe('Shapes follow mouse movement'),
    hoverEffect: z.enum(['none', 'scale', 'rotate', 'fade']).optional().describe('Effect when hovering over shapes'),
  }).optional(),
}).describe('Shape effect configuration')

export type Shape = z.infer<typeof ShapeSchema>
export type UserConfig = z.infer<typeof schema>

const PRESETS: Record<string, UserConfig> = {
  // Basic shapes with rotation
  basicShapes: {
    shapes: [
      {
        shape: 'circle',
        style: {
          opacity: 15,
          scale: 2,
          color: '#3B82F6', // blue
          blendMode: 'multiply',
        },
        position: {
          origin: 'topRight',
          offsetX: -20,
          offsetY: 20,
        },
        animation: {
          rotate: 360,
          duration: 20,
        },
      },
      {
        shape: 'triangle',
        style: {
          opacity: 12,
          scale: 1.5,
          color: '#10B981', // green
          blendMode: 'multiply',
        },
        position: {
          origin: 'bottomLeft',
          offsetX: 20,
          offsetY: -20,
        },
        animation: {
          rotate: -360,
          duration: 25,
          delay: 2,
        },
      },
    ],
  },

  // Interactive shapes
  interactive: {
    shapes: [
      {
        shape: 'hexagon',
        style: {
          opacity: 20,
          scale: 1.8,
          color: '#6366F1', // indigo
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleLeft',
          offsetX: 30,
        },
        animation: {
          rotate: 360,
          duration: 30,
        },
      },
      {
        shape: 'star',
        style: {
          opacity: 15,
          scale: 1.2,
          color: '#EC4899', // pink
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleRight',
          offsetX: -30,
        },
        animation: {
          rotate: -360,
          duration: 35,
          delay: 3,
        },
      },
    ],
    interaction: {
      mouseFollow: true,
      hoverEffect: 'scale',
    },
  },

  // Blending demonstration
  blendingShapes: {
    shapes: [
      {
        shape: 'circle',
        style: {
          opacity: 20,
          scale: 2.5,
          color: '#8B5CF6', // purple
          blendMode: 'overlay',
        },
        position: {
          origin: 'middleLeft',
          offsetX: 40,
        },
        animation: {
          rotate: 360,
          duration: 40,
        },
      },
      {
        shape: 'circle',
        style: {
          opacity: 20,
          scale: 2.5,
          color: '#F59E0B', // amber
          blendMode: 'multiply',
        },
        position: {
          origin: 'middleRight',
          offsetX: -40,
        },
        animation: {
          rotate: -360,
          duration: 45,
          delay: 4,
        },
      },
    ],
  },
}

function getOptions(): InputOption[] {
  return [
    new InputOption({
      key: 'shapes',
      label: 'Shape Elements',
      input: 'InputList',
      props: {
        itemLabel: 'Shape',
        sortable: true,
      },
      options: [
        new InputOption({
          key: 'shape',
          label: 'Shape Type',
          input: 'InputSelect',
          props: {
            options: [
              { label: 'Circle', value: 'circle' },
              { label: 'Square', value: 'square' },
              { label: 'Triangle', value: 'triangle' },
              { label: 'Hexagon', value: 'hexagon' },
              { label: 'Diamond', value: 'diamond' },
              { label: 'Star', value: 'star' },
            ],
          },
        }),

        new InputOption({
          key: 'style',
          label: 'Appearance',
          input: 'group',
          options: [
            new InputOption({
              key: 'color',
              label: 'Color',
              input: 'InputColor',
            }),
            new InputOption({
              key: 'theme',
              label: 'Use Theme Color',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Primary', value: 'primary' },
                  { label: 'Theme', value: 'theme' },
                ],
              },
            }),
            new InputOption({
              key: 'opacity',
              label: 'Opacity',
              input: 'InputRange',
              props: {
                min: 0,
                max: 100,
                step: 5,
              },
            }),
            new InputOption({
              key: 'blendMode',
              label: 'Blend Mode',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Normal', value: 'normal' },
                  { label: 'Multiply', value: 'multiply' },
                  { label: 'Screen', value: 'screen' },
                  { label: 'Overlay', value: 'overlay' },
                ],
              },
            }),
            new InputOption({
              key: 'scale',
              label: 'Size Scale',
              input: 'InputRange',
              props: {
                min: 0.1,
                max: 5,
                step: 0.1,
              },
            }),
          ],
        }),

        new InputOption({
          key: 'position',
          label: 'Position',
          input: 'group',
          options: [
            new InputOption({
              key: 'origin',
              label: 'Anchor Point',
              input: 'InputSelect',
              props: {
                options: [
                  { label: 'Top Left', value: 'topLeft' },
                  { label: 'Top Center', value: 'topCenter' },
                  { label: 'Top Right', value: 'topRight' },
                  { label: 'Middle Left', value: 'middleLeft' },
                  { label: 'Middle Center', value: 'middleCenter' },
                  { label: 'Middle Right', value: 'middleRight' },
                  { label: 'Bottom Left', value: 'bottomLeft' },
                  { label: 'Bottom Center', value: 'bottomCenter' },
                  { label: 'Bottom Right', value: 'bottomRight' },
                ],
              },
            }),
            new InputOption({
              key: 'offsetX',
              label: 'X Offset (%)',
              input: 'InputRange',
              props: {
                min: -100,
                max: 100,
                step: 5,
              },
            }),
            new InputOption({
              key: 'offsetY',
              label: 'Y Offset (%)',
              input: 'InputRange',
              props: {
                min: -100,
                max: 100,
                step: 5,
              },
            }),
            new InputOption({
              key: 'zIndex',
              label: 'Layer Order',
              input: 'InputRange',
              props: {
                min: -10,
                max: 10,
                step: 1,
              },
            }),
          ],
        }),

        new InputOption({
          key: 'animation',
          label: 'Animation',
          input: 'group',
          options: [
            new InputOption({
              key: 'rotate',
              label: 'Rotation (deg)',
              input: 'InputRange',
              props: {
                min: -360,
                max: 360,
                step: 45,
              },
            }),
            new InputOption({
              key: 'duration',
              label: 'Duration (s)',
              input: 'InputRange',
              props: {
                min: 0,
                max: 45,
                step: 5,
              },
            }),
            new InputOption({
              key: 'delay',
              label: 'Delay (s)',
              input: 'InputRange',
              props: {
                min: 0,
                max: 10,
                step: 0.5,
              },
            }),
          ],
        }),
      ],
    }),

    new InputOption({
      key: 'responsive',
      label: 'Responsive Settings',
      input: 'group',
      options: [
        new InputOption({
          key: 'mobileScale',
          label: 'Mobile Scale',
          input: 'InputRange',
          props: { min: 0.1, max: 2, step: 0.1 },
        }),
        new InputOption({
          key: 'tabletScale',
          label: 'Tablet Scale',
          input: 'InputRange',
          props: { min: 0.1, max: 2, step: 0.1 },
        }),
      ],
    }),

    new InputOption({
      key: 'interaction',
      label: 'Interactive Features',
      input: 'group',
      options: [
        new InputOption({
          key: 'mouseFollow',
          label: 'Follow Mouse',
          input: 'InputToggle',
        }),
        new InputOption({
          key: 'hoverEffect',
          label: 'Hover Effect',
          input: 'InputSelect',
          props: {
            options: [
              { label: 'None', value: 'none' },
              { label: 'Scale', value: 'scale' },
              { label: 'Rotate', value: 'rotate' },
              { label: 'Fade', value: 'fade' },
            ],
          },
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return PRESETS.basicShapes
}

export async function getConfig(args: { templateId: string }): Promise<ConfigResponse> {
  const { templateId } = args

  const demoPage = {
    cards: [
      // Basic shapes and positioning
      {
        templateId: 'hero',
        userConfig: {
          heading: 'Basic Shapes & Rotation',
          subHeading: 'Basic example showing shape positioning and continuous rotation animations. Notice the gentle circular and triangular motion.',
          mode: 'centered',
          actions: [
            { name: 'Configure Shapes', theme: 'primary' },
            { name: 'Watch Demo', theme: 'default' },
          ],
        },
        effects: [
          { templateId, userConfig: PRESETS.basicShapes },
        ],
      },

      // Interactive features
      {
        templateId: 'hero',
        userConfig: {
          heading: 'Interactive Shapes',
          subHeading: 'Move your cursor around to see the shapes follow. Hover over the shapes to trigger scale effects. The shapes maintain continuous rotation while following movement.',
          mode: 'centered',
          actions: [
            { name: 'Try Interaction', theme: 'primary' },
            { name: 'Learn More', theme: 'default' },
          ],
        },
        effects: [
          { templateId, userConfig: PRESETS.interactive },
        ],
      },

      // Blending demonstration
      {
        templateId: 'hero',
        userConfig: {
          heading: 'Blend Modes & Opacity',
          subHeading: 'Demonstration of overlapping shapes with different blend modes. The circles use "overlay" and "multiply" blend modes with increased opacity for rich color mixing.',
          mode: 'centered',
          actions: [
            { name: 'Explore Blending', theme: 'primary' },
            { name: 'View Guide', theme: 'default' },
          ],
        },
        effects: [
          { templateId, userConfig: PRESETS.blendingShapes },
        ],
      },
    ],
  }

  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage,
  }
}
