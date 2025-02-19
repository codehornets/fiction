<script lang="ts" setup>
import type { ActionArea } from '@fiction/core'
import { ActionAreaSchema as schema, vue } from '@fiction/core'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

defineOptions({ name: 'InputActionArea' })

const { modelValue, variants, defaultVariant = 'buttons', proof = [] } = defineProps<{
  modelValue?: ActionArea
  variants?: ActionArea['variant'][]
  proof?: (keyof NonNullable<ActionArea['proof']>)[]
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

const proofOptions = vue.computed(() => {
  const proofFeatureGroups = []

  if (proof.includes('community')) {
    proofFeatureGroups.push(createOption({
      key: 'proof',
      label: 'Community Signal',
      icon: { class: 'i-tabler-users' },
      input: 'group',
      options: [
        createOption({
          key: 'proof.community.isEnabled',
          label: 'Enable Community Signal',
          input: 'InputToggle',
          schema,
        }),
        createOption({
          key: 'proof.community.text',
          label: 'Text',
          input: 'InputText',
          schema,
        }),
        createOption({
          key: 'proof.community.count',
          label: 'Member Count',
          input: 'InputNumber',
          schema,
        }),
        createOption({
          key: 'proof.community.thumbCount',
          label: 'Thumb Count',
          input: 'InputRange',
          schema,
          props: { min: 1, max: 10 },
        }),

      ],
    }))
  }

  const proofGroup = createOption({
    key: 'proof',
    label: 'Proof & Credibility',
    icon: { class: 'i-tabler-mail-star' },
    input: 'group',
    schema,
    options: proofFeatureGroups,
  })
  return proof.length > 0 ? [proofGroup] : []
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
        key: 'subscribe.input.placeholder',
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
        key: 'subscribe.button.icon',
        label: 'Button Icon',
        input: 'InputIcon',
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
    ...proofOptions.value,
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
