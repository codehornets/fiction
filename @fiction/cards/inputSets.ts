import type { InputOptionSettings } from '@fiction/ui/index.js'
import { ButtonDesignSchema, colorTheme, colorThemeUser, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui/index.js'

type OptArgs = (Partial<InputOptionSettings> & Record<string, unknown>) | undefined

export const standardOption = {
  media: (_: OptArgs = {}) => new InputOption({ key: 'media', label: 'Image', input: 'InputMedia', props: { formats: _?.formats }, ..._ }),
  name: (_: OptArgs = {}) => new InputOption({ key: 'name', label: 'Text', input: 'InputText', ..._ }),
  desc: (_: OptArgs = {}) => new InputOption({ key: 'desc', label: 'Description', input: 'InputTextarea', ..._ }),
  icon: (_: OptArgs = {}) => new InputOption({ key: 'icon', label: 'Icon', input: 'InputSelect', ..._ }),
  href: (_: OptArgs = {}) => new InputOption({ key: 'href', label: 'Link / Route', input: 'InputText', ..._ }),
  target: (_: OptArgs = {}) => new InputOption({ key: 'target', label: 'Target', input: 'InputSelect', list: [{ name: 'Normal', value: '_self' }, { name: 'New Window', value: '_blank' }], ..._ }),
  size: (_: OptArgs = {}) => new InputOption({ key: 'size', label: 'Size', input: 'InputSelect', list: ['default', ...SizeSchema.options], ..._ }),
  colorThemeUser: (_: OptArgs = {}) => new InputOption({ key: 'theme', label: 'Type', input: 'InputSelect', list: colorThemeUser, ..._ }),
  buttonDesign: (_: OptArgs = {}) => new InputOption({ key: 'design', label: 'Type', input: 'InputSelect', list: ['default', ...ButtonDesignSchema.options], ..._ }),
  heading: (_: OptArgs = {}) => new InputOption({
    key: 'heading',
    label: 'Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string(),
    ..._,
  }),
  subHeading: (_: OptArgs = {}) => new InputOption({
    key: 'subHeading',
    label: 'Sub Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string(),
    ..._,
  }),
  superHeading: (_: OptArgs = {}) => new InputOption({
    key: 'superHeading',
    label: 'Super Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string().optional(),
    ..._,
  }),
  groupTitle: (_: OptArgs = {}) => new InputOption({
    aliasKey: 'title',
    input: 'InputText',
    schema: ({ z }) => z.string().optional(),
    ..._,
    key: `${_?.key}Title`,
    label: `${_?.label} Title`,
  }),
  group: (_: OptArgs = {}) => new InputOption({
    input: 'group',
    key: `${_?.key}Group`,
    ..._,
  }),
  inputList: (_: OptArgs = {}) => new InputOption({
    input: 'InputList',
    aliasKey: 'group',
    schema: ({ z, subSchema }) => z.array(subSchema),
    key: `${_?.key}`,
    ..._,
  }),
  headers: (_: OptArgs = {}) => {
    const s = standardOption
    return s.group({ label: 'Headers', key: 'headers', ..._, options: [
      s.heading(),
      s.subHeading(),
      s.superHeading(),
      new InputOption({ key: 'superColor', input: 'InputSelect', label: 'Color of Super Header', list: colorTheme }),
      new InputOption({ key: 'superIcon', input: 'InputText', label: 'Super Header Icon', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),
    ] })
  },
  buttons: (_: OptArgs = {}) => {
    const s = standardOption
    return s.inputList({ label: 'Actions', key: 'actions', ..._, options: [
      s.name(),
      s.href(),
      s.colorThemeUser(),
      s.size(),
      s.buttonDesign(),
      s.target(),
      new InputOption({ key: 'icon', input: 'InputText', label: 'Icon', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),
      new InputOption({ key: 'iconAfter', input: 'InputText', label: 'Icon After', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),

    ] })
  },
  navItems: (_: OptArgs & { maxDepth?: number, itemNames?: string[] } = {}) => {
    const { maxDepth = 0, itemNames = ['Nav Item'] } = _
    const __ = { label: 'Nav Items', key: 'navItems', ..._ }
    const opts = (depth: number) => {
      const out: InputOption[] = []

      out.push(new InputOption({
        key: `${__.key}_config_${depth}`,
        label: 'Item Config',
        input: 'group',
        options: [
          new InputOption({ key: 'name', label: 'Text', input: 'InputText' }),
          new InputOption({ key: 'href', label: 'Link / Route', input: 'InputUrl' }),
          new InputOption({ key: 'media', label: 'Icon', input: 'InputIcon' }),
        ],
      }))

      if (depth < maxDepth) {
        out.push(new InputOption({
          key: `${__.key}_subnav_${depth}`,
          label: 'Item Sub Navigation',
          input: 'group',
          options: [
            new InputOption({ input: 'InputList', key: 'items', label: 'Sub Items', props: { itemName: itemNames[depth + 1] || itemNames.pop() }, options: opts(depth + 1) }),
            new InputOption({ key: 'itemsTitle', label: 'Sub Items Title', input: 'InputText' }),
            new InputOption({ key: 'subStyle', label: 'Submenu Style', input: 'InputSelect', list: ['drop', 'mega'] }),
          ],
        }))
      }

      out.push(new InputOption({
        key: `${__.key}_advanced_${depth}`,
        label: 'Item Advanced Config',
        input: 'group',
        isClosed: true,
        options: [
          new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
          new InputOption({ key: 'target', label: 'Target', input: 'InputSelect', list: [{ name: 'Normal', value: '_self' }, { name: 'New Window', value: '_blank' }] }),
          new InputOption({ key: 'itemStyle', label: 'Style', input: 'InputSelect', list: ['default', 'button', 'user'] }),
          new InputOption({ key: 'authState', label: 'Auth State', input: 'InputSelect', list: ['default', 'loggedIn', 'loggedOut'] }),
        ],
      }))

      return out
    }

    return new InputOption({ ...__, input: 'InputList', label: `${__.label} Items`, props: { itemName: itemNames[0] }, options: opts(0) })
  },
}
