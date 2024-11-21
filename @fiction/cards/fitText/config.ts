import type { ConfigResponse } from '@fiction/site/card'
import type { SiteUserConfig } from '@fiction/site/schema'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const schema = z.object({
  text: z.string().optional().describe('Text that dynamically adjusts to fill available space'),
  lines: z.number().optional().describe('Number of lines to display (1-5)'),
  minFontSize: z.number().optional().describe('Minimum font size to maintain readability'),
  maxFontSize: z.number().optional().describe('Maximum font size for visual impact'),
  font: z.string().optional().describe('Font family selection for brand personality'),
  align: z.enum(['inherit', 'left', 'center', 'right']).optional().describe('Text alignment'),
  weight: z.enum(['inherit', 'normal', 'medium', 'semibold', 'bold']).optional().describe('Font weight'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

const options: InputOption[] = [
  new InputOption({
    key: 'text',
    label: 'Message',
    description: 'Watch your text dynamically resize to perfectly fill the space',
    input: 'InputTextarea',
    props: {
      placeholder: 'Enter your message - it will automatically fit the space perfectly',
      rows: 2,
    },
  }),
  new InputOption({
    key: 'lines',
    label: 'Line Count',
    description: 'Choose how many lines your message spans:\n• 1 line: Punchy headlines\n• 2 lines: Balanced statements\n• 3+ lines: Detailed messages',
    input: 'InputNumber',
    props: {
      min: 1,
      max: 5,
    },
  }),
  new InputOption({
    key: 'font',
    label: 'Typography',
    description: 'Select a font that matches your message tone:\n• Serif: Elegant & traditional\n• Sans-serif: Modern & clean\n• Display: Bold & distinctive',
    input: 'InputFont',
  }),
  new InputOption({
    key: 'style',
    label: 'Text Style',
    input: 'group',
    options: [
      new InputOption({
        key: 'align',
        label: 'Alignment',
        input: 'InputRadioButton',
        props: {
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      }),
      new InputOption({
        key: 'weight',
        label: 'Weight',
        input: 'InputRadioButton',
        props: {
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Medium', value: 'medium' },
            { label: 'Semibold', value: 'semibold' },
            { label: 'Bold', value: 'bold' },
          ],
        },
      }),
    ],
  }),
  new InputOption({
    key: 'sizing',
    label: 'Size Controls',
    input: 'group',
    options: [
      new InputOption({
        key: 'minFontSize',
        label: 'Minimum Size',
        description: 'Smallest allowed size to maintain readability',
        input: 'InputNumber',
        props: {
          min: 12,
          max: 48,
        },
      }),
      new InputOption({
        key: 'maxFontSize',
        label: 'Maximum Size',
        description: 'Largest allowed size for visual impact',
        input: 'InputNumber',
        props: {
          min: 32,
          max: 500,
        },
      }),
    ],
  }),
]

export function getUserConfig(): UserConfig {
  return {
    text: `It's a perfect fit.`,
    lines: 1,
    minFontSize: 24,
    maxFontSize: 180,
    font: 'Poppins',
    align: 'center',
    weight: 'bold',
  }
}

function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    headline: {
      templateId,
      userConfig: {
        standard: {
          spacing: { contentWidth: 'full' },
          headers: {
            title: 'Bold Impact Headlines',
            subTitle: 'Perfect for hero sections and primary messages',
          },
        },
        text: 'Imagine The Possibilities...',
        lines: 1,
        minFontSize: 32,
        maxFontSize: 200,
        font: 'Fraunces',
        align: 'center',
      },
    },
    elegantStatement: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Elegant Multi-line Statements',
            subTitle: 'Ideal for mission statements and brand messaging',
          },
        },
        text: 'Yesterday you said tomorrow.',

        lines: 2,
        minFontSize: 28,
        maxFontSize: 120,
        font: 'Cormorant',
        align: 'center',
        weight: 'medium',
      },
    },
    modernTech: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Technical & Modern',
            subTitle: 'Great for feature highlights and technical content',
          },
        },
        text: 'Change your story. Change your life.',
        lines: 3,
        minFontSize: 24,
        maxFontSize: 90,
        font: 'Space Grotesk',
        align: 'left',
        weight: 'medium',
      },
    },
    creative: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Creative & Dynamic',
            subTitle: 'Perfect for artistic and expressive content',
          },
        },
        text: 'Let\'s create something beautiful together.',
        lines: 1,
        minFontSize: 32,
        maxFontSize: 160,
        font: 'Caveat',
        align: 'center',
        weight: 'bold',
      },
    },
    impactStatement: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'High-Impact Features',
            subTitle: 'Showcase key benefits and features',
          },
        },
        text: 'What can you do today to improve tomorrow?',
        lines: 2,
        minFontSize: 28,
        maxFontSize: 100,
        font: 'Plus Jakarta Sans',
        align: 'center',
        weight: 'semibold',
      },
    },
    default: {
      templateId,
      userConfig: getUserConfig(),
    },
  }
}

export async function getDemo(args: { templateId: string }) {
  const { templateId } = args
  return {
    cards: Object.values(getDemoConfigs(templateId)),
  }
}

export async function getConfig(args: { templateId: string }): Promise<ConfigResponse> {
  return {
    schema,
    options,
    userConfig: getUserConfig(),
    demoPage: await getDemo(args),
  }
}
