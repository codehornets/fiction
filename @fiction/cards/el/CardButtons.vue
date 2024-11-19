<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import type { ActionButton } from '@fiction/core/schemas/schemas.js'
import type { Card } from '@fiction/site'
import type { UiElementSize } from '@fiction/ui/utils'
import { shortId, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import CardButton from '../CardButton.vue'

defineOptions({ name: 'CardButtons' })

const { card, actions = [], uiSize = 'md', animate = 'none', isOverlay = false, theme = 'default', design } = defineProps<{
  card: Card
  actions: ActionButton[]
  uiSize?: UiElementSize
  animate?: 'fade' | 'slide' | 'pop' | 'rise' | 'none'
  isOverlay?: boolean
  theme?: ColorThemeUser
  design?: ActionButton['design']
}>()

const randomId = shortId()

vue.onMounted(() => {
  if (animate !== 'none') {
    useElementVisible({
      caller: 'actionButtons',
      selector: `#${randomId}`,
      onVisible: async () => {
        await animateItemEnter({ targets: `#${randomId} .x-action-item`, themeId: animate, config: { overallDelay: 400 } })
      },
    })
  }
})

function getButtonType(action: ActionButton) {
  if (isOverlay) {
    return 'overlay'
  }
  else {
    return action.theme
  }
}
</script>

<template>
  <div v-if="actions?.length" :id="randomId">
    <CardButton
      v-for="(action, i) in actions"
      :key="i"
      :card
      class="x-action-item"
      :theme="getButtonType(action) || theme"
      :design="action.design || design"
      :href="action.href"
      :size="action.size || uiSize"
      :icon="action.icon"
      :loading="action.loading"
      :icon-after="action.iconAfter"
      :disabled="action.disabled"
      @click.stop="action.onClick && action.onClick({ event: $event, item: action })"
    >
      {{ action.name }}
    </CardButton>
  </div>
</template>
