<script lang="ts" setup>
import type { ColorThemeUser, SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getNested, vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'

const { card, basePath, superTitle, theme } = defineProps<{
  card: Card
  basePath: string
  superTitle?: SuperTitle
  theme?: ColorThemeUser
}>()

const sup = vue.computed(() => {
  return superTitle || (getNested({ data: card.fullConfig.value, path: basePath }) || {}) as SuperTitle
})

const colorStyle = vue.computed(() => {
  const colorTheme = theme || sup.value.theme
  if (!colorTheme || colorTheme === 'default') {
    return {
      icon: 'text-primary-500 dark:text-theme-100 bg-primary-100/80 dark:bg-theme-700/80',
      text: 'text-theme-500 dark:text-theme-500',
    }
  }

  const styles = getColorThemeStyles(colorTheme)
  return {
    icon: [styles?.bg, styles?.text, styles?.border].join(' '),
    text: styles?.text,
  }
})
</script>

<template>
  <div
    v-if="sup.text || sup.icon"
    class="flex gap-3 items-center"
    :class="[colorStyle.text]"
  >
    <div
      v-if="sup.icon"
      :class="colorStyle.icon"
      class="size-10 rounded-full flex items-center justify-center"
    >
      <XIcon :media="sup.icon" class="size-6" />
    </div>
    <CardText
      tag="h3"
      :card
      class="font-sans text-sm lg:text-lg font-medium"
      :path="`${basePath}.text`"
      placeholder="Super Title"
      animate="fade"
    />
  </div>
</template>
