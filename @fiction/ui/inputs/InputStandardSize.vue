<script lang="ts" setup>
import type { StandardSize } from '@fiction/core'
import InputSelect from './InputSelect.vue'

defineOptions({ name: 'InputStandardSize' })

const { modelValue, uiSize = 'md' } = defineProps<{ modelValue?: StandardSize, uiSize?: StandardSize }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: StandardSize): void
}>()

const list = [
  { value: 'xxs', label: 'Extra Extra Small' },
  { value: 'xs', label: 'Extra Small' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: 'Extra Extra Large' },
]
</script>

<template>
  <div>
    <InputSelect :list :ui-size="uiSize" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>
