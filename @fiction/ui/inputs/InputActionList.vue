<script lang="ts" setup>
import type { ActionButton, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const props = defineProps({
  buttons: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  uiSize: { type: String as vue.PropType<ActionButton['size']>, default: 'sm' },
})

function gapSize() {
  switch (props.uiSize) {
    case 'xs':
      return 'gap-2'
    case 'sm':
      return 'gap-3'
    case 'md':
      return 'gap-4'
    case 'lg':
      return 'gap-4'
    case 'xl':
      return 'gap-5'
    default:
      return 'gap-2'
  }
}
</script>

<template>
  <div class="flex items-center flex-wrap py-2" :class="gapSize()">
    <XButton
      v-for="(btn, i) in buttons"
      :key="i"
      :design="btn.design || 'solid'"
      :theme="btn.theme || 'default'"
      :size="btn.size || uiSize"
      :loading="btn.loading"
      :href="btn.href"
      :target="btn.target"
      :icon="btn.icon"
      :icon-after="btn.iconAfter"
      @click.stop.prevent="btn.onClick ? btn.onClick({ event: $event, props: { ...props, ...$attrs } }) : ''"
    >
      {{ btn.label }}
    </XButton>
  </div>
</template>
