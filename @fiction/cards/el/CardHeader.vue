<script lang="ts" setup>
import type { ActionButton, colorTheme, MediaObject, SuperTitle } from '@fiction/core'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'
import CardText from '../CardText.vue'
import CardActionArea from './CardActionArea.vue'
import XSuperTitle from './SuperTitle.vue'

export type UserConfig = {
  title?: string
  subTitle?: string
  superTitle?: SuperTitle
  actions?: ActionButton[]
  layout?: 'center' | 'justify' | 'right' | 'left'
}

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  withActions: { type: Boolean, default: true },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const colorStyle = vue.computed(() => {
  const theme = uc.value.superTitle?.theme
  if (!theme) {
    return {
      icon: 'text-primary-500 dark:text-theme-100 bg-primary-100/80 dark:bg-theme-700/80',
      text: 'text-theme-500 dark:text-theme-500',
    }
  }

  const r = getColorThemeStyles(theme || 'theme')
  return {
    icon: [r?.bg, r?.text, r?.border].join(' '),
    text: r?.text,
  }
})

const textWrapClass = vue.computed(() => {
  const out = []
  const layout = uc.value.layout || ''

  if (layout === 'justify')
    out.push('lg:flex justify-between text-left items-end gap-8')

  else if (layout === 'left')
    out.push('text-left')

  else if (layout === 'right')
    out.push('text-left')

  else
    out.push('mx-auto text-left md:text-center')

  return out.join(' ')
})

const layout = vue.computed(() => {
  return uc.value.layout || 'center'
})
</script>

<template>
  <div class="space-y-8">
    <div
      :class="textWrapClass"
      data-option-path="layout"
      :data-layout="layout"
    >
      <div class="max-w-screen-lg space-y-4" :class="layout === 'justify' ? 'lg:min-w-[50%]' : 'mx-auto'">
        <XSuperTitle
          :card
          base-path="superTitle"
          :class="[layout === 'center' ? 'md:justify-center' : '']"
          :super-title="uc.superTitle"
        />
        <CardText
          tag="h1"
          :card
          class="x-font-title font-semibold md:text-balance text-4xl sm:text-5xl !leading-[1.1]"
          path="title"
          placeholder="Title"
          animate="fade"
        />
      </div>
      <div class="max-w-screen-md space-y-4" :class="layout === 'justify' ? 'lg:max-w-[40%]' : 'mx-auto'">
        <CardText
          tag="h3"
          :card
          class="mt-8 text-xl lg:text-2xl !leading-[1.5] md:text-balance text-theme-800 dark:text-theme-200"
          :class="layout === 'justify' ? 'lg:text-right' : ''"
          path="subTitle"
          placeholder="Sub Title"
          animate="fade"
        />
        <CardActionArea
          v-if="withActions && layout === 'justify'"
          base-path="action"
          :card
          :classes="{
            buttons: [
              'flex gap-4 lg:gap-6 justify-end',
            ].join(' '),
          }"
          size="md"
        />
      </div>
    </div>
    <CardActionArea
      v-if="withActions && layout !== 'justify'"
      base-path="action"
      :card
      :classes="{
        buttons: [
          ['justify', 'left', 'right'].includes(layout)
            ? 'justify-start' : 'justify-start md:justify-center',
          'flex gap-4 lg:gap-6',
        ].join(' '),
      }"
      size="xl"
    />
  </div>
</template>
