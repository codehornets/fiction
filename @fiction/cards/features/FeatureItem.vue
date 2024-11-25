<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import CardText from '@fiction/cards/CardText.vue'
import CardButtons from '@fiction/cards/el/CardButtons.vue'
import { vue } from '@fiction/core'
import XIcon from '@fiction/ui/media/XIcon.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  feature: { type: Object as vue.PropType<NonNullable<UserConfig['features']>[0]>, required: true },
  index: { type: Number, required: true },
  style: { type: Object as vue.PropType<UserConfig['style']>, default: () => ({}) },
  layout: { type: Object as vue.PropType<UserConfig['layout']>, default: () => ({}) },
})

function getFeatureStyle() {
  if (!props.feature?.color) {
    return {
      wrapper: 'bg-theme-50/50 dark:bg-theme-900/50',
      iconWrapper: 'bg-theme-100 dark:bg-theme-800 shadow-sm',
      icon: 'text-primary-500 dark:text-primary-400',
    }
  }

  const style = getColorThemeStyles(props.feature.color || 'primary')
  const isCards = props.layout?.style === 'cards'
  const wrapper = isCards
    ? 'bg-white dark:bg-theme-800/20 border border-theme-200 dark:border-theme-700 p-6 md:p-8 xl:p-12'
    : ''
  return {
    wrapper,
    iconWrapper: `${style?.bg} shadow-sm`,
    icon: style?.text,
  }
}

const iconSize = vue.computed(() => ({
  'xxs': 'size-6',
  'xs': 'size-8',
  'sm': 'size-10',
  'md': 'size-14',
  'lg': 'size-20',
  'xl': 'size-24',
  '2xl': 'size-32',
}[props.style?.iconSize || 'md']))
</script>

<template>
  <div
    class="group relative rounded-2xl transition-all flex flex-col "
    :class="[
      getFeatureStyle().wrapper,
      layout?.align === 'center' ? 'text-center items-center' : 'text-left items-start',
      layout?.style === 'cards' && layout?.align === 'center' ? 'justify-center' : '',
    ]"
  >
    <div
      class="max-w-[60ch]"
      :class="[
        layout?.align === 'center' ? 'flex flex-col items-center justify-center' : '',

      ]"
    >
      <div
        v-if="feature.icon"
        class="rounded-2xl mb-6 flex items-center justify-center"
        :class="[iconSize, getFeatureStyle().iconWrapper]"
      >
        <XIcon
          class="size-[60%]"
          :class="[
            getFeatureStyle().icon,
            style?.iconStyle === 'outline' ? 'stroke-[1.5]' : '',
          ]"
          :media="feature.icon"
        />
      </div>

      <CardText
        tag="h3"
        :card="card"
        :path="`features.${index}.title`"
        class="text-2xl font-semibold x-font-title"
        animate="fade"
      />

      <CardText
        tag="p"
        :card="card"
        :path="`features.${index}.description`"
        class="mt-3 text-lg lg:text-xl text-theme-600 dark:text-theme-300 lg:leading-relaxed"
        animate="fade"
      />

      <CardButtons
        v-if="feature.actions?.length"
        :card="card"
        :actions="feature.actions"
        class="mt-6 flex gap-4"
        theme="primary"
      />
    </div>
  </div>
</template>
