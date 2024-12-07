<script lang="ts" setup>
import type { ColorThemeUser, StandardSize, SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getNested, vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'

const {
  card,
  basePath,
  theme = 'default',
  size = 'md',
} = defineProps<{
  card: Card
  basePath: string
  theme?: ColorThemeUser
  size?: StandardSize
}>()

const sup = vue.computed(() => {
  return (getNested({ data: card.fullConfig.value, path: basePath }) || {}) as SuperTitle
})

const colorStyle = vue.computed(() => {
  const colorTheme = sup.value.theme || theme || 'default'
  const styles = getColorThemeStyles(colorTheme)
  return {
    icon: [styles?.bg, styles?.text, styles?.border].join(' '),
    text: styles?.text,
  }
})

const sizeClasses = vue.computed(() => {
  const sizes = {
    'xxs': { gap: 'gap-0.5', icon: 'size-6', iconInner: 'size-3.5', text: 'text-xs lg:text-sm' },
    'xs': { gap: 'gap-1', icon: 'size-7', iconInner: 'size-4', text: 'text-sm lg:text-base' },
    'sm': { gap: 'gap-1.5', icon: 'size-8', iconInner: 'size-5', text: 'text-base lg:text-lg' },
    'md': { gap: 'gap-2', icon: 'size-10', iconInner: 'size-6', text: 'text-lg lg:text-xl' },
    'lg': { gap: 'gap-2.5', icon: 'size-12', iconInner: 'size-7', text: 'text-xl lg:text-2xl' },
    'xl': { gap: 'gap-3', icon: 'size-14', iconInner: 'size-8', text: 'text-2xl lg:text-3xl' },
    '2xl': { gap: 'gap-3', icon: 'size-16', iconInner: 'size-10', text: 'text-3xl lg:text-4xl' },
  }

  return sizes[size]
})
</script>

<template>
  <div
    v-if="sup.text || sup.icon"
    class="flex items-center antialiased"
    :class="[colorStyle.text, sizeClasses.gap]"
  >
    <div
      v-if="sup.icon"
      :class="[colorStyle.icon, sizeClasses.icon]"
      class="rounded-full flex items-center justify-center"
    >
      <XIcon
        :media="sup.icon"
        :class="sizeClasses.iconInner"
      />
    </div>
    <CardText
      tag="h3"
      :card
      class="font-sans font-medium"
      :class="sizeClasses.text"
      :path="`${basePath}.text`"
      placeholder="Super Title"
      animate="fade"
    />
  </div>
</template>
