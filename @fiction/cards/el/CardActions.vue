<script lang="ts" setup>
import type { ActionButton, StandardSize } from '@fiction/core'
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import { animateItemEnter } from '@fiction/ui/anim'
import CardButton from '../CardButton.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
  defaultSize: { type: String as vue.PropType<StandardSize>, default: 'xl' },
  justify: { type: String as vue.PropType<'center' | 'left' | 'right'>, default: 'center' },
})

vue.onMounted(() => {
  animateItemEnter({ targets: `#${props.card.cardId} .x-action-item`, themeId: 'fade', config: { overallDelay: 400 } })
})
</script>

<template>
  <div
    v-if="actions?.length"
    :class="justify === 'left' ? 'justify-start' : (justify === 'right' ? 'justify-end' : 'justify-start md:justify-center')"
  >
    <CardButton
      v-for="(action, i) in actions"
      :key="i"
      class="x-action-item"
      :card
      :theme="action.theme || 'default'"
      :design="action.design"
      :href="action.href"
      :size="action.size || defaultSize"
      :icon="action.icon"
      :icon-after="action.iconAfter"
    >
      {{ action.label }}
    </CardButton>
  </div>
</template>
