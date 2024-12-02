<script lang="ts" setup>
import type { FontFamily, StandardSize } from '@fiction/core'
import type { FontEntry } from '@fiction/core/utils/lib/fontList'
import { groupBy, vue } from '@fiction/core'
import { safeStacks } from '@fiction/core/utils/fonts'
import InputSelectCustom from './InputSelectCustom.vue'

const { modelValue = {}, uiSize = 'md', noPreview = false } = defineProps<{
  modelValue?: FontFamily
  uiSize?: StandardSize
  noPreview?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: FontFamily): void
}>()

const fontsList = vue.ref<FontEntry[]>()

function getGoogleLink(family: string, variants: string[]) {
  return `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:wght@300;400;500;600;700;800;900`
}

async function getFontsList() {
  const { fonts } = await import('@fiction/core/utils/lib/fontList')
  return fonts
}

const list = vue.computed(() => {
  const safeStackItems = Object.entries(safeStacks).map(([key, stack]) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: key,
    }
  })

  const fonts = groupBy(fontsList.value || [], 'category') as Record<string, FontEntry[]>

  const glist = Object.entries(fonts).flatMap(
    ([category, entries]) => {
      const vals = entries.map((entry) => {
        const { family, variants } = entry
        return { name: `${family} (${category})`, value: family, source: 'google' }
      })
      return [{ format: 'title', name: category }, ...vals]
    },
  )

  return [
    { name: 'Default', value: '' },
    ...glist,
    { format: 'title', name: 'Native Fonts' },
    ...safeStackItems,
  ]
})

vue.onMounted(async () => {
  fontsList.value = await getFontsList()
})

vue.watch(() => modelValue, (newFont) => {
  const fontItem = fontsList.value?.find(font => font.family === newFont)
  if (fontItem && fontItem.variants.length > 0) {
    const link = getGoogleLink(fontItem.family, fontItem.variants)
    const fontLink = document.getElementById('google-font-preview') as HTMLLinkElement
    if (fontLink) {
      fontLink.href = link
    }
    else {
      const newFontLink = document.createElement('link')
      newFontLink.id = 'google-font-preview'
      newFontLink.rel = 'stylesheet'
      newFontLink.href = link
      document.head.appendChild(newFontLink)
    }
  }
}, { immediate: true })

const fontFamily = vue.computed(() => {
  const selectedFont = modelValue.family || ''
  return safeStacks[selectedFont as keyof typeof safeStacks] || selectedFont
})

const previewFontSize = vue.computed(() => {
  const sizes = {
    'xxs': 'text-xs p-2',
    'xs': 'text-sm p-2',
    'sm': 'text-base p-2',
    'md': 'text-lg py-2 px-8',
    'lg': 'text-xl py-2.5 px-8',
    'xl': 'text-2xl py-3 px-8',
    '2xl': 'text-3xl py-3.5 px-8',
  }
  return sizes[uiSize as keyof typeof sizes] || 'text-base py-2 px-8'
})

function handleFamilyChange(family?: string) {
  emit('update:modelValue', { family })
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="space-y-2">
    <div v-if="fontFamily && !noPreview">
      <div
        contenteditable="true"
        class="font-preview inline-block border border-dashed border-theme-200 dark:border-theme-600/60 rounded-md focus:outline-none focus:ring-0  hover:opacity-80"
        :class="previewFontSize"
        :style="{ fontFamily }"
      >
        <span>Editable Font Preview </span>
      </div>
    </div>
    <InputSelectCustom
      v-bind="{ ...$attrs, list }"
      :ui-size="uiSize"
      :model-value="modelValue.family"
      class="grow"
      @update:model-value="handleFamilyChange($event as string | undefined)"
    />
  </div>
</template>
