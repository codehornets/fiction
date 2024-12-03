<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { InputProps } from './index.js'
import FormEngine from './FormEngine.vue'
import { InputOption } from './index.js'

const { modelValue } = defineProps<{ modelValue?: NavListItem }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: NavListItem): void
}>()

function getInputListProps(name: string) {
  return {
    itemLabel: ({ item, index = 0 } = {}) => item?.label ?? `${name}${index >= 0 ? ` ${index + 1}` : ''}`,
  } as InputProps<'InputList'>
}

const baseOptions: InputOption[] = [

  new InputOption({
    key: 'label',
    label: 'Label',
    input: 'InputText',
    isRequired: true,
  }),
  new InputOption({
    key: 'href',
    label: 'Link',
    input: 'InputUrl',
  }),
  new InputOption({
    key: 'advancedNavItems',
    label: 'Advanced Settings',
    input: 'group',
    isClosed: true,
    options: [
      new InputOption({
        key: 'description',
        label: 'Description',
        input: 'InputText',
        description: 'Shown in expanded menus',
      }),
      new InputOption({
        key: 'icon',
        label: 'Icon',
        input: 'InputIcon',
      }),
      new InputOption({
        key: 'variant',
        label: 'Style Variant',
        input: 'InputSelect',
        list: ['default', 'button', 'avatar'],
      }),
      new InputOption({
        key: 'emphasis',
        label: 'Emphasis',
        input: 'InputSelect',
        list: ['default', 'highlighted', 'muted'],
      }),
      new InputOption({
        key: 'theme',
        label: 'Color Theme',
        description: 'Used in buttons and emphasis',
        input: 'InputColorScheme',
      }),
    ],
  }),

  new InputOption({
    key: 'list',
    label: 'Child Menu',
    input: 'group',
    options: [

      new InputOption({
        key: 'list.items',
        label: 'Nav Items',
        input: 'InputList',
        props: getInputListProps('Child Nav Item'),
        options: [
          new InputOption({
            key: 'label',
            label: 'Label',
            input: 'InputText',
          }),
          new InputOption({
            key: 'description',
            label: 'Description',
            input: 'InputText',
          }),
          new InputOption({
            key: 'href',
            label: 'Link',
            input: 'InputUrl',
          }),
          new InputOption({
            key: 'icon',
            label: 'Icon',
            input: 'InputIcon',
          }),
        ],
      }),
      new InputOption({
        input: 'title',
        label: 'Menu Settings',
      }),
      new InputOption({
        key: 'list.variant',
        label: 'Sub Menu Style',
        subLabel: 'How the child menu is displayed',
        input: 'InputSelect',
        list: [
          { value: 'default', label: 'Standard' },
          { value: 'expanded', label: 'Large / Mega' },
        ],
      }),
      new InputOption({
        key: 'list.title',
        label: 'Menu Title',
        subLabel: 'Optional title for the child menu',
        description: 'The title is shown in expanded menus',
        input: 'InputText',
      }),

    ],
  }),
]

const options = [
  new InputOption({
    key: '*',
    input: 'InputList',
    props: getInputListProps('Nav Item'),
    options: baseOptions,
  }),
]
</script>

<template>
  <div>
    <FormEngine
      state-key="navOption"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
