<script lang="ts" setup>
import type { SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'

const { card, basePath, superTitle } = defineProps<{
  card: Card
  basePath: string
  superTitle: SuperTitle
}>()

const colorStyle = vue.computed(() => {
  const color = superTitle.color
  if (!color) {
    return {
      icon: 'text-primary-500 dark:text-theme-100 bg-primary-100/80 dark:bg-theme-700/80',
      text: 'text-theme-500 dark:text-theme-500',
    }
  }

  const styles = getColorThemeStyles(color)
  return {
    icon: [styles?.bg, styles?.text, styles?.border].join(' '),
    text: styles?.text,
  }
})
</script>

<template>
  <div
    class="flex gap-3 items-center mb-4"
    :class="[colorStyle.text]"
  >
    <div
      v-if="superTitle.icon"
      :class="colorStyle.icon"
      class="size-10 rounded-full flex items-center justify-center"
    >
      <XIcon :media="superTitle.icon" class="size-6" />
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
