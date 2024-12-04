import type { Card } from './card'
import { colorTheme, colorThemeBright, HeaderLayoutSchema, SizeSchema, SizeSchemaComplete } from '@fiction/core'
import { createOption, InputOption } from '@fiction/ui'
import InputAi from './ai/InputAi.vue'
import { SiteUserConfigSchema as schema } from './schema'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return createOption({ key: 'standard', label: 'Standard Options', input: 'group', options: [
    createOption({
      key: 'contentGen',
      icon: { class: 'i-tabler-sparkles' },
      isClosed: true,
      label: 'AI Content Generation',
      input: 'group',
      options: [
        createOption({
          key: 'purpose',
          input: InputAi,
          isUtility: true,
          props: { site: card.site },
        }),
      ],
    }),
    createOption({ key: 'standardHeaders', icon: { class: 'i-tabler-heading' }, isClosed: true, label: 'Text Headers', input: 'group', options: [
      createOption({
        input: 'group',
        key: 'headersGroup',
        label: 'Header Content',
        options: [
          createOption({ key: 'standard.headers.title', label: 'Title', input: 'InputText', schema }),
          createOption({ key: 'standard.headers.subTitle', label: 'Sub Title', input: 'InputText', schema }),
          createOption({ key: 'standard.headers.superTitle', input: 'InputSuperTitle', schema, isClosed: true }),

        ],
      }),
      createOption({
        input: 'group',
        key: 'headersStyleGroup',
        label: 'Header Styling',
        options: [
          createOption({ key: 'standard.headers.layout', label: 'Layout', input: 'InputSelectCustom', list: HeaderLayoutSchema.options, schema }),
          createOption({ key: 'standard.headers.size', label: 'Size', input: 'InputSelectCustom', list: SizeSchema.options, schema }),
        ],
      }),

    ] }),
    createOption({ key: 'standardSpacing', icon: { class: 'i-tabler-viewport-wide' }, isClosed: true, label: 'Width / Spacing', input: 'group', options: [
      createOption({ key: 'standard.spacing.contentWidth', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
      createOption({ key: 'standard.spacing.verticalSpacing', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
    ] }),
    createOption({ key: 'standardBackground', icon: { class: 'i-tabler-background' }, isClosed: true, label: 'Color / Background', input: 'group', options: [
      createOption({
        input: 'group',
        key: 'baseColorGroup',
        label: 'Base Colors and Background',
        options: [
          createOption({ key: 'standard.scheme.base.bg', label: 'Background', input: 'InputMedia', props: { isBackground: true }, schema }),
          createOption({ key: 'standard.scheme.base.primary', label: 'Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
          createOption({ key: 'standard.scheme.base.theme', label: 'Theme Color', input: 'InputSelectCustom', list: colorTheme, schema }),
        ],
      }),
      createOption({
        input: 'group',
        key: 'lightColorGroup',
        label: 'Light Mode Only',
        options: [
          createOption({ key: 'standard.scheme.light.bg', label: 'Light Mode Background', input: 'InputMedia', props: { isBackground: true }, schema }),
          createOption({ key: 'standard.scheme.light.primary', label: 'Light Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
          createOption({ key: 'standard.scheme.light.theme', label: 'Light Theme Color', input: 'InputSelectCustom', list: colorTheme, schema }),
        ],
      }),
      createOption({
        input: 'group',
        key: 'specialColorGroup',
        label: 'Color Handling',
        options: [
          createOption({
            key: 'standard.scheme.reverse',
            label: 'Reverse Light Mode',
            subLabel: 'If site is in light mode, use dark mode colors (and vice versa)',
            input: 'InputToggle',
            schema,
          }),
        ],
      }),

    ] }),
    createOption({
      key: 'standardFont',
      icon: { class: 'i-tabler-text-size' },
      isClosed: true,
      label: 'Font',
      input: 'group',
      options: [
        createOption({
          key: 'standard.fontStyle.title',
          label: 'Title',
          subLabel: 'Used for titles and headers',
          input: 'InputFont',
          schema,
        }),
        createOption({
          key: 'standard.fontStyle.body',
          label: 'Body',
          subLabel: 'Used for prose and general text',
          input: 'InputFont',
          schema,
        }),
        createOption({
          key: 'standard.fontStyle.highlight',
          label: 'Highlight',
          subLabel: 'Used for accents and callouts',
          input: 'InputFont',
          schema,
        }),
      ],
    }),
    createOption({
      key: 'standardHandling',
      icon: { class: 'i-tabler-status-change' },
      isClosed: true,
      label: 'Page Handling',
      input: 'group',
      options: [
        createOption({
          key: 'standard.handling.hideOnPage',
          label: 'Hide on Page',
          input: 'InputToggle',
          description: `Hide this element by default on the page. Useful for controlling elements on cards vs pages.`,
          schema,
        }),
        createOption({
          key: 'standard.handling.showOnSingle',
          label: 'Show When Viewing Post',
          input: 'InputToggle',
          description: `Show this element when viewing a post, by default all elements are hidden unless configured otherwise.`,
          schema,
        }),
      ],
    }),
  ] })
}
