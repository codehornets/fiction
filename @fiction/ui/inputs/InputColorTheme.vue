<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { colorTheme, getColorScheme, onlyUserColorTheme, vue } from '@fiction/core'
import InputSelectCustom from './InputSelectCustom.vue'

defineOptions({ name: 'InputColorTheme' })

const { modelValue } = defineProps<{ modelValue?: ColorThemeUser }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ColorThemeUser | undefined): void
}>()

const list = [
  { format: 'title', name: 'Special Handling' },
  ...onlyUserColorTheme,
  { format: 'title', name: 'Color Themes' },
  ...colorTheme,
]

const colorScheme = vue.computed(() => {
  if (!modelValue)
    return ''

  if (onlyUserColorTheme.includes(modelValue as typeof onlyUserColorTheme[number])) {
    return ''
  }

  return getColorScheme(modelValue, { outputFormat: 'hex' })
})
</script>

<template>
  <div class="space-y-2">
    <InputSelectCustom
      :list
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event as ColorThemeUser)"
    />
    <div v-if="colorScheme" class="flex w-full ring-black rounded-md overflow-hidden" :style="{ border: `1px solid ${colorScheme[500]}` }">
      <div v-for="(clr, i) in colorScheme" :key="i" :title="String(i)" class="h-6 w-full" :style="{ background: clr }" />
    </div>
  </div>
</template>
