<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { colorTheme, getColorScheme, vue } from '@fiction/core'
import InputSelect from './InputSelect.vue'

defineOptions({ name: 'InputActionArea' })

const { modelValue } = defineProps<{ modelValue?: ColorThemeUser }>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: ColorThemeUser): void
}>()

const colorScheme = vue.computed(() => modelValue ? getColorScheme(modelValue, { outputFormat: 'hex' }) : '')
</script>

<template>
  <div class="space-y-2">
    <InputSelect :list="[...colorTheme]" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" />
    <div v-if="colorScheme" class="flex w-full ring-black rounded-md overflow-hidden" :style="{ border: `1px solid ${colorScheme[500]}` }">
      <div v-for="(clr, i) in colorScheme" :key="i" :title="String(i)" class="h-6 w-full" :style="{ background: clr }" />
    </div>
  </div>
</template>
