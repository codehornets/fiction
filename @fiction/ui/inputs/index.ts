import type { ActionButton, ListItem, MediaObject } from '@fiction/core'
import type { z } from 'zod'
import { FictionObject, removeUndefined, vue } from '@fiction/core'
import InputColorTheme from './InputColorTheme.vue'
import InputStandardSize from './InputStandardSize.vue'

const def = vue.defineAsyncComponent

type InputEntry = { el: vue.Component, shape?: string[] }

export const inputs = {
  InputColorTheme: { el: def(() => import('./InputColorTheme.vue')) },
  InputSuperTitle: { el: def(() => import('./InputSuperTitle.vue')) },
  InputStandardSize: { el: def(() => import('./InputStandardSize.vue')) },
  InputNav: { el: def(() => import('./InputNav.vue')) },
  InputNavMenu: { el: def(() => import('./InputNavMenu.vue')) },
  InputBrand: { el: def(() => import('./InputBrand.vue')) },
  InputActionArea: { el: def(() => import('./InputActionArea.vue')) },
  InputControl: { el: def(() => import('./InputControl.vue')) },
  InputProse: { el: def(() => import('./InputProse.vue')) },
  InputActionList: { el: def(() => import('./InputActionList.vue')) },
  InputActions: { el: def(() => import('./InputActions.vue')), shape: ['0.testId', '0.design', '0.href', '0.icon', '0.iconAfter', '0.name', '0.size', '0.target', '0.theme', '0.rounding', '0.disabled', '0.format', '0.loading'] },
  InputItems: { el: def(() => import('./InputItems.vue')) },
  InputUsername: { el: def(() => import('./InputUsername.vue')) },
  InputImage: { el: def(() => import('./InputImage.vue')) },
  InputMarkdown: { el: def(() => import('./InputMarkdown.vue')) },
  InputList: { el: def(() => import('./InputList.vue')) },
  InputEmail: { el: def(() => import('./InputEmail.vue')) },
  InputOneTimeCode: { el: def(() => import('./InputOneTimeCode.vue')) },
  InputText: { el: def(() => import('./InputText.vue')) },
  InputUrl: { el: def(() => import('./InputUrl.vue')) },
  InputToggle: { el: def(() => import('./InputToggle.vue')) },
  InputCheckbox: { el: def(() => import('./InputCheckbox.vue')) },
  InputCheckboxMulti: { el: def(() => import('./InputCheckboxMulti.vue')) },
  InputRadio: { el: def(() => import('./InputRadio.vue')) },
  InputRadioButton: { el: def(() => import('./InputRadioButton.vue')) },
  InputSelect: { el: def(() => import('./InputSelect.vue')) },
  InputSelectCustom: { el: def(() => import('./InputSelectCustom.vue')) },
  InputTimezone: { el: def(() => import('./InputTimezone.vue')) },
  InputPrice: { el: def(() => import('./InputPrice.vue')) },
  InputPhone: { el: def(() => import('./InputPhone.vue')) },
  InputSubmit: { el: def(() => import('./InputSubmit.vue')) },
  InputPassword: { el: def(() => import('./InputPassword.vue')) },
  InputTextarea: { el: def(() => import('./InputTextarea.vue')) },
  InputWeight: { el: def(() => import('./InputWeight.vue')) },
  InputNumber: { el: def(() => import('./InputNumber.vue')) },
  InputPosts: { el: def(() => import('./InputPosts.vue')), shape: ['entries.*', 'media.*', 'query.*', 'limit', 'offset', 'format'] },
  InputLogo: { el: def(() => import('./InputLogo.vue')), shape: ['url', 'format', 'html', 'el', 'typography.*', 'class', 'iconId'] },
  InputIcon: { el: def(() => import('./InputIcon.vue')), shape: ['url', 'format', 'html', 'iconId', 'el', 'class', 'props'] },
  InputMedia: { el: def(() => import('./InputMedia.vue')), shape: ['*'] },
  InputMediaUpload: { el: def(() => import('./InputMediaUpload.vue')), shape: ['url'] },
  InputRanking: { el: def(() => import('./InputRanking.vue')) },
  InputMultipleChoice: { el: def(() => import('./InputMultipleChoice.vue')) },
  InputRating: { el: def(() => import('./InputRating.vue')) },
  InputChoice: { el: def(() => import('./InputChoice.vue')) },
  InputDate: { el: def(() => import('./InputDate.vue')) },
  InputColor: { el: def(() => import('./InputColor.vue')) },
  InputFont: { el: def(() => import('./InputFont.vue')) },
  InputColorScheme: { el: def(() => import('./InputColorScheme.vue')) },
  InputRange: { el: def(() => import('./InputRange.vue')) },
  InputDropDown: { el: def(() => import('./InputDropDown.vue')) },
  InputOverlay: { el: def(() => import('./InputOverlay.vue')) },
  InputGradient: { el: def(() => import('./InputGradient.vue')), shape: ['angle', 'stops', 'stops.0.color', 'stops.0.percent', 'css'] },
} as const satisfies Record<string, InputEntry>

export type InputProps<T extends keyof typeof inputs> = InstanceType<(typeof inputs)[T]['el']>['$props'] & { [key: string]: any }

export type InputOptionGeneration = {
  prompt?: string
  isUserEnabled?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

export type InputControlSurface = Partial<{
  key: string
  value: string | number | boolean | any[] | Record<string, unknown> | undefined
}>

export type ReactiveOrStatic<T> = T | vue.Ref<T> | vue.ComputedRef<T>

export type ValueResponse = {
  status: 'ready' | 'enabled' | 'disabled' | 'incomplete' | 'optional'
  data?: unknown
  message?: string
  format?: 'text' | 'html' | 'media'
}

type InputComponent = keyof typeof inputs | 'title' | 'group' | 'hidden' | vue.Component

export interface InputOptionSettings {
  testId?: string
  key?: string
  aliasKey?: string
  label?: string
  description?: string
  subLabel?: string
  placeholder?: string
  input?: InputComponent
  isRequired?: boolean
  isClosed?: boolean
  disabled?: boolean | string
  props?: Record<string, unknown>
  options?: InputOption[] | ((args: { input: InputOption }) => InputOption[])
  list?: (ListItem | string)[] | readonly (ListItem | string)[]
  schema?: z.Schema
  generation?: InputOptionGeneration
  isHidden?: boolean
  isUtility?: boolean
  shape?: string[]
  inputClass?: string
  uiFormat?: 'standard' | 'naked' | 'fullWidth'
  getDefaultValue?: () => unknown
  icon?: MediaObject
  format?: 'control' | 'input'
  actions?: (args: { input: InputOption }) => ActionButton[]
  modalActions?: (args: { input: InputOption }) => ActionButton[]
  valueDisplay?: (args: { input: InputOption }) => ValueResponse
}

export type OptArgs = (Partial<InputOptionSettings> & Record<string, unknown>) | undefined

type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

export class InputOption extends FictionObject<InputOptionSettings> {
  key = vue.ref(this.settings.key || '*')
  aliasKey = vue.ref(this.settings.aliasKey || this.key)
  input = vue.shallowRef(this.settings.input)
  shape = vue.ref(typeof this.input.value === 'string' ? (inputs as Record<string, InputEntry>)[this.input.value]?.shape || [] : [])
  label = vue.ref(this.settings.label)
  subLabel = vue.ref(this.settings.subLabel)
  placeholder = vue.ref(this.settings.placeholder)
  isRequired = vue.ref(this.settings.isRequired || false)
  isClosed = vue.ref(this.settings.isClosed || false)
  isHidden = vue.ref(this.settings.isHidden || false)
  description = vue.ref(this.settings.description)

  // modal control options
  isModalOpen = vue.ref(false) // allows for modal input visible
  tempValue = vue.ref<Record<string, any> | undefined>() // temp value for modal input
  actions = vue.computed(() => this.settings.actions?.({ input: this }))
  modalActions = vue.computed(() => this.settings.modalActions?.({ input: this }))
  valueDisplay = vue.computed(() => this.settings.valueDisplay?.({ input: this }))

  props = vue.shallowRef(this.settings.props)
  options = vue.computed(() => (typeof this.settings.options === 'function' ? this.settings.options({ input: this }) : this.settings.options) || [])
  list = vue.shallowRef(this.settings.list)
  schema = vue.shallowRef(this.settings.schema)
  generation = vue.ref(this.settings.generation || {})

  outputProps = vue.computed(() => {
    if (this.input.value === 'InputControl') {
      return {
        disabled: this.settings.disabled,
        options: this.options.value?.map(option => option.toConfig()),
        ...this.props.value,
      }
    }
    else {
      return {
        label: this.label.value,
        subLabel: this.subLabel.value,
        description: this.description.value,
        placeholder: this.placeholder.value,
        required: this.isRequired.value,
        key: this.key.value,
        options: this.options.value,
        list: this.list.value,
        disabled: this.settings.disabled,
        ...this.props.value,
      }
    }
  })

  update(config: Partial<InputOptionSettings>) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof typeof this]))
        (this[key as keyof typeof this] as vue.Ref).value = value
    })

    return this
  }

  constructor(settings: InputOptionSettings) {
    super('InputOption', settings)
  }

  toConfig(): InputOptionConfig {
    const subOptions = this.options.value?.map(option => option.toConfig())
    return removeUndefined({
      key: this.key.value,
      aliasKey: this.aliasKey.value,
      label: this.label.value,
      description: this.description.value,
      input: this.input.value,
      props: { ...this.outputProps.value, options: subOptions },
      options: subOptions,
      shape: this.shape.value,
    })
  }
}

type OptionPrimitive = string | number | boolean | undefined | null

type PathsToStringProps<T> = T extends OptionPrimitive
  ? never
  : T extends any[]
    ? never
    : T extends object
      ? {
          [K in keyof T & string]: T[K] extends OptionPrimitive
            ? K
            : T[K] extends any[]
              ? K | `${K}.${number}` | `${K}.${number}.${PathsToStringProps<T[K][number]>}` | PathsToStringProps<T[K][number]>
              : K | `${K}.${PathsToStringProps<T[K]>}`
        }[keyof T & string]
      : never

// Remove undefined from optional properties
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export type UtilitySchemaDotPaths<T extends object> = PathsToStringProps<NonNullableFields<T>>

type ValidKey<
  TSchema extends z.ZodObject<any> | undefined,
  TInput extends InputComponent | undefined,
> = TInput extends 'group' | 'title'
  ? string
  : TSchema extends z.ZodObject<any>
    ? UtilitySchemaDotPaths<z.infer<TSchema>>
    : string

export function createOption<
  TInput extends InputComponent,
  TSchema extends z.ZodObject<any> | undefined = undefined,
>(settings: {
  input: TInput
  key: ValidKey<TSchema, TInput>
  schema?: TSchema
  props?: TInput extends keyof typeof inputs ? InputProps<TInput> : Record<string, unknown>
} & Omit<InputOptionSettings, 'key' | 'input' | 'props' | 'schema'>) {
  const { schema, ...inputSettings } = settings
  return new InputOption(inputSettings)
}
