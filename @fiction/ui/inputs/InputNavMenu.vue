<script lang="ts" setup>
import type { NavList } from '@fiction/core'
import type { InputProps } from './index.js'
import FormEngine from './FormEngine.vue'
import { InputOption } from './index.js'

const { modelValue } = defineProps<{ modelValue?: NavList }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: NavList): void
}>()

function getInputListProps(name: string) {
  return {
    itemLabel: ({ item, index = 0 } = {}) => item?.title ?? `${name}${index >= 0 ? ` ${index + 1}` : ''}`,
  } as InputProps<'InputList'>
}

const baseOptions: InputOption[] = [
  new InputOption({
    key: 'title',
    label: 'Menu Title',
    input: 'InputText',
    props: {
      placeholder: 'e.g., "Explore", "Connect", "Resources"',
    },
  }),
  new InputOption({
    key: 'items',
    label: 'Navigation Items',
    input: 'InputNav',
  }),
]

const options = [
  new InputOption({
    key: '*',
    input: 'InputList',
    props: getInputListProps('Menu'),
    options: baseOptions,
  }),
]
</script>

<template>
  <div>
    <FormEngine
      state-key="navMenuOption"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </div>
</template>
