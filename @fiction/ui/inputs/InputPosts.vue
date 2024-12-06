<script lang="ts" setup>
import type { PostHandlingObject, PostObject } from '@fiction/core'
import type { InputOption } from './index.js'
import { PostHandlingSchema as schema, shortId, vue } from '@fiction/core'
import { createStockMediaHandler } from '../stock'
import FormEngine from './FormEngine.vue'
import { createOption } from './index.js'

const { modelValue } = defineProps<{ modelValue?: PostHandlingObject }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: PostHandlingObject): void
}>()

const baseOptions = [
  createOption({
    schema,
    key: 'format',
    label: 'Post Source',
    input: 'InputRadioButton',
    list: [
      { name: 'Standard Query', value: 'standard' },
      { name: 'Local', value: 'local' },
    ],
  }),
  createOption({
    schema,
    key: 'limit',
    label: 'Per Page Limit',
    input: 'InputNumber',
    props: { min: 1, max: 100 },
  }),
]

const globalQueryOptions = [
  createOption({
    schema,
    key: 'query.filters',
    label: 'Select by Filters',
    subLabel: 'Must match any of these filters (OR logic)',
    description: 'Filters are applied to the global query. If you don\'t want to filter, leave this empty.',
    input: 'InputList',
    props: { itemLabel: 'Filter' },
    options: [
      createOption({
        schema,
        key: 'query.filters.0',
        label: 'Filters',
        subLabel: 'Must match all of these filters (AND logic)',
        description: 'These are applied with OR logic. If using AND logic, add a new top level filter.',
        props: { itemLabel: 'Filter' },
        input: 'InputList',
        options: [
          createOption({
            schema,
            key: 'query.filters.0.0.field',
            label: 'Field',
            input: 'InputSelectCustom',
            list: [
              { name: 'Title', value: 'title' },
              { name: 'Content', value: 'content' },
              { name: 'Author', value: 'author' },
              { name: 'Category', value: 'category' },
              { name: 'Tag', value: 'tag' },
            ],
          }),
          createOption({
            key: 'query.filters.0.0.operator',
            label: 'Operator',
            input: 'InputSelectCustom',
            list: [
              { name: 'Equals', value: '=' },
              { name: 'Not Equals', value: '!=' },
              { name: 'Contains', value: 'like' },
              { name: 'Not Contains', value: 'not like' },
              { name: 'In', value: 'in' },
              { name: 'Not In', value: 'not in' },
            ],
          }),
          createOption({
            key: 'query.filters.0.filters.0.value',
            label: 'Value',
            input: 'InputText',
          }),
        ],
      }),
    ],
  }),

]

const localPostOptions = [
  createOption({ schema, key: 'entries.0.slug', label: 'Slug', input: 'InputText', getDefaultValue: () => shortId() }),
  createOption({ schema, key: 'entries.0.title', label: 'Title', input: 'InputText', getDefaultValue: () => 'New Post' }),
  createOption({ schema, key: 'entries.0.media', label: 'Media', input: 'InputMedia', getDefaultValue: async () => (await createStockMediaHandler()).getRandomMedia() }),
  createOption({ schema, key: 'entries.0.content', label: 'Content', input: 'InputProse' }),
  createOption({ schema, key: 'entries.0.tags', label: 'Tags', input: 'InputItems' }),
  createOption({ schema, key: 'entries.0.categories', label: 'Categories', input: 'InputItems' }),
]

const options = vue.computed(() => {
  const formatOption = baseOptions.find(opt => opt.key.value === 'format')!
  const limitOption = baseOptions.find(opt => opt.key.value === 'limit')!

  if (modelValue?.format === 'standard') {
    return [
      formatOption,
      ...globalQueryOptions,
      limitOption,
    ]
  }
  else {
    return [
      formatOption,
      createOption({
        key: 'entries',
        label: 'Local Posts',
        input: 'InputList',
        options: localPostOptions,
        props: {
          itemName: 'Post',
          itemLabel: args => (args?.item as PostObject)?.title ?? 'Untitled',
        },
      }),
      limitOption,
    ] as InputOption[]
  }
})
</script>

<template>
  <div class="border-t border-theme-200 dark:border-theme-700 pt-4">
    <FormEngine
      state-key="postHandling"
      :depth="1"
      :model-value="modelValue"
      ui-size="md"
      :options="options"
      @update:model-value="emit('update:modelValue', $event as PostHandlingObject)"
    />
  </div>
</template>
