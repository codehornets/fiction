<script lang="ts" setup>
import type { ActionArea } from '@fiction/core'
import { actionAreaSchema as schema, vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputActionArea' })

const { modelValue } = defineProps<{ modelValue?: ActionArea }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ActionArea): void
}>()

const val = vue.computed(() => {
  return {
    variant: 'button',
    ...modelValue,
  }
})

const subscribeOptions = [
  createOption({
    key: 'subscribe',
    label: 'Subscribe Form',
    input: 'group',
    schema,
    options: [
      createOption({
        key: 'subscribe.placeholder',
        label: 'Input Placeholder',
        input: 'InputText',
        schema,
      }),
      createOption({
        key: 'subscribe.button.text',
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
        key: 'subscribe.success.message',
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
  const o = [
    createOption({
      key: 'variant',
      input: 'InputRadioButton',
      props: {
        list: [
          { label: 'Buttons', value: 'button' },
          { label: 'Subscribe Form', value: 'subscribe' },
        ],
      },
      schema,
    }),
    ...(modelValue?.variant === 'subscribe' ? subscribeOptions : actionButtonOptions),
  ]

  return o
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
