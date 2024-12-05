<script setup lang="ts">
import { resetUi, toLabel, vue } from '@fiction/core'
import { Card } from '@fiction/site/card'
import CardWrap from './CardWrap.vue'
import EffectTransitionCardList from './EffectTransitionCardList.vue'

const { card, tag = 'div' } = defineProps<{ card?: Card, tag: string }>()

const isEditable = vue.computed(() => card?.site?.isEditable.value)

function handleCardClick(args: { cardId: string, event: MouseEvent }) {
  const { event, cardId } = args

  if (isEditable.value) {
    event?.stopPropagation()
    resetUi({ scope: 'all', cause: 'ElEngine', trigger: 'elementClick' })
    card?.site?.setActiveCard({ cardId })
  }
}

const renderCards = vue.computed(() => {
  const c = card?.cards.value || []

  const site = card?.site
  const currentItemId = site?.currentItemId.value

  const out = tag === 'main'
    ? c.filter((c) => {
      const uc = c.fullConfig.value
      const showOnSingle = uc.standard?.handling?.showOnSingle
      const hideOnPage = uc.standard?.handling?.hideOnPage
      return (currentItemId && showOnSingle) || (!currentItemId && !hideOnPage)
    })
    : c

  if (out.length === 0 && currentItemId && tag === 'main') {
    out.push(new Card({ templateId: 'page404', site: card?.site }))
  }

  return out
})
</script>

<template>
  <component :is="tag" class="card-engine" :data-total-cards="card?.cards.value.length">
    <EffectTransitionCardList>
      <template
        v-for="(subCard) in renderCards"
        :key="subCard.cardId"
      >
        <template v-if="subCard.isDetached.value">
          <component
            :is="subCard.tpl.value?.settings?.el"
            :id="subCard.cardId"
            data-test-id="card-non-inline-component"
            :data-card-type="subCard.templateId.value"
            :card="subCard"
          />
        </template>
        <CardWrap
          v-else
          :card="subCard"
          :data-card-id="subCard.cardId"
          class="relative w-full group/engine"
          :class="[
            subCard.isActive.value && isEditable ? 'outline-2 outline-dashed outline-theme-300 dark:outline-theme-600' : '',
            isEditable ? 'hover:outline-2 hover:outline-dashed hover:outline-blue-300 dark:hover:outline-blue-600 cursor-pointer  transition-all' : '',
          ]"
          @click="handleCardClick({ cardId: subCard.cardId, event: $event })"
        >
          <component
            :is="subCard.tpl.value?.settings?.el"
            :id="subCard.cardId"
            data-test-id="card-engine-component"
            :data-card-type="subCard.templateId.value"
            :card="subCard"
          />
        </CardWrap>
      </template>
    </EffectTransitionCardList>
  </component>
</template>
