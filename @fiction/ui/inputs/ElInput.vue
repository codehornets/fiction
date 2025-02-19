<script lang="ts" setup>
import type { UiElementSize } from '../utils'
import { omit, vue } from '@fiction/core'
import { inputs } from '.'

defineOptions({ name: 'ElInput' })

const { modelValue, label = '', subLabel = '', description = '', inputProps = {}, uiSize = 'md', input, defaultValue } = defineProps<{
  modelValue?: any
  label?: string
  subLabel?: string
  description?: string
  inputProps?: InputProps
  uiSize?: UiElementSize
  input?: keyof typeof inputs | vue.Component | 'title' | 'group' | 'hidden'
  defaultValue?: any
}>()

const emit = defineEmits(['update:modelValue'])

type InputProps = {
  class?: string
  required?: boolean
  disabled?: boolean | string
  readonly?: boolean
  placeholder?: string
  autocomplete?: string
  autofocus?: boolean
  spellcheck?: boolean
  tabindex?: number
  inputmode?: string
  pattern?: string
  minlength?: number
  maxlength?: number
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  accept?: string
  capture?: string
  [key: string]: any
}

if (defaultValue && modelValue === undefined)
  emit('update:modelValue', defaultValue)

const attrs = vue.useAttrs() as { for?: string, class?: string, required?: string, [key: string]: any }

const inputEl = vue.ref<vue.ComponentPublicInstance>()
const valid = vue.ref<boolean | undefined>()
const inputComponent = vue.computed(() => {
  const inp = input
  if (inp === 'title' || inp === 'group' || inp === 'hidden') {
    return ''
  }
  else if (inp && typeof inp === 'string') {
    const r = inputs[inp]?.el
    return r
  }
  else {
    return input || ''
  }
})

/**
 * Set the validity of the input using the native constraint API
 */
async function setValidity(): Promise<void> {
  const el = inputEl.value?.$el as HTMLElement | HTMLInputElement

  if (el) {
    if ((el instanceof HTMLInputElement || el instanceof HTMLSelectElement) && el.checkValidity) {
      valid.value = el.checkValidity()
    }
    else if (el.querySelector) {
      const realEl = el.querySelector('input') ?? el.querySelector('select')

      // for regular inputs
      if (realEl && realEl.checkValidity)
        valid.value = realEl.checkValidity()
      else valid.value = true
    }
  }
}

async function updateValue(value: any): Promise<void> {
  await setValidity()
  emit('update:modelValue', value)
}

vue.onMounted(() => {
  // Let the child els load
  setTimeout(async () => {
    await setValidity()
  }, 300)
})

const cls = vue.computed(() => {
  const size = uiSize
  const map = {
    sm: { labelSize: 'text-[11px]' },
    md: { labelSize: 'text-xs' },
    lg: { labelSize: 'text-sm' },
  }

  return map[size as keyof typeof map] || map.md
})
</script>

<template>
  <div :key="label" class="f-el-input space-y-0.5 font-sans" :class="[valid ? 'valid' : 'not-valid', attrs.class]">
    <div v-if="label || description" class="text-input-label-size flex justify-between mb-1.5">
      <div class="text items-center" :class="cls.labelSize">
        <div class="flex items-center space-x-2 text-theme-700 dark:text-theme-0">
          <label v-if="label" class="font-medium" :for="attrs.for" v-text="label" />
          <div v-if="description" class="group relative flex items-center">
            <div class="text-lg text-theme-500 hover:text-theme-400 i-tabler-info-circle group-hover:opacity-40 cursor-help" />
            <div class="pointer-events-none bg-theme-0 dark:bg-theme-700 dark:border-theme-600 border dark:text-theme-0 absolute -left-4 top-full z-30 mt-2 opacity-0 max-h-0 w-56 origin-top-right rounded-md p-4 text-xs shadow-lg ring-1 ring-black/10 focus:outline-none group-hover:max-h-[300px] group-hover:opacity-100 transition-all">
              {{ description }}
            </div>
          </div>
        </div>
        <div v-if="subLabel" class="text-theme-400 dark:text-theme-300 text-[.9em]" v-html="subLabel" />
      </div>
      <slot name="labelRight" />
    </div>
    <div class="input-area">
      <component
        :is="inputComponent"
        v-if="inputComponent"
        ref="inputEl"
        :model-value="modelValue"
        v-bind="{ ...omit(attrs, 'class', 'data-test-id', 'data-option-path', 'model-value'), ...inputProps }"
        :ui-size="uiSize"
        @update:model-value="updateValue($event)"
      >
        <slot />
      </component>
      <slot v-else />
      <slot name="after" />
    </div>
  </div>
</template>
