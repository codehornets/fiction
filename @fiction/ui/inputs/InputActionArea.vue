<script lang="ts" setup>
import type { ActionArea } from '@fiction/core'
import { ActionAreaSchema as schema, vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputActionArea' })

const { modelValue, variants, defaultVariant = 'buttons' } = defineProps<{
  modelValue?: ActionArea
  variants?: ActionArea['variant'][]
  defaultVariant?: ActionArea['variant']
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ActionArea): void
}>()

const val = vue.computed(() => {
  return {
    variant: variants ? variants[0] : defaultVariant,
    ...modelValue,
  }
})

const subscribeOptions = [
  createOption({
    key: 'subscribe',
    label: 'Subscribe Form',
    icon: { class: 'i-tabler-mail-check' },
    input: 'group',
    schema,
    options: [
      createOption({
        key: 'subscribe.placeholder',
        label: 'Input Placeholder',
        placeholder: 'e.g. Enter your email',
        input: 'InputText',
        schema,
      }),
      createOption({
        key: 'subscribe.button.label',
        label: 'Button Text',
        input: 'InputText',
        schema,
      }),
      createOption({
        key: 'subscribe.success.title',
        label: 'Success Title',
        input: 'InputText',
        schema,
      }),
      createOption({
        key: 'subscribe.success.content',
        label: 'Success Message',
        input: 'InputText',
        schema,
      }),
    ],
  }),
]

const actionButtonOptions = [
  createOption({
    key: 'buttons',
    label: 'Buttons / Links',
    input: 'InputActions',
    schema,
  }),
]

const options = vue.computed(() => {
  const variantsList = [
    { label: 'Buttons', value: 'button' },
    { label: 'Subscribe Form', value: 'subscribe' },
  ].filter(v => !variants || variants?.includes(v.value as ActionArea['variant']))

  const variantOption = createOption({
    key: 'variant',
    input: 'InputRadioButton',
    props: {
      list: variantsList,
    },
    schema,
  })

  const o = [
    ...(!variants || variants.length > 1 ? [variantOption] : []),
    ...(modelValue?.variant === 'subscribe' ? subscribeOptions : actionButtonOptions),
  ]

  return [
    createOption({
      key: 'actionAreaGroup',
      label: 'Action Area',
      input: 'group',
      icon: { class: 'i-tabler-click' },
      schema,
      options: o,
    }),
  ]
})
</script>

<template>
  <div>
    <FormEngine
      state-key="actionAreaInput"
      :depth="1"
      :model-value="val"
      ui-size="md"
      :options
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
