<script lang="ts" setup>
import type { UserConfig } from '.'
import type { UserConfig as HeroUserConfig } from '../content-hero/config'
import { vue } from '@fiction/core'
import { Card } from '@fiction/site'
import ElHero from '../content-hero/ElHero.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

function createHeroCard(item: HeroUserConfig, index: number) {
  return new Card({
    cardId: card.cardId,
    templateId: 'contentHero',
    userConfig: item,
    site: card.site,
    onSync: (subCard) => {
      card.updateUserConfig({ path: `items.${index}`, value: subCard.userConfig.value })
    },
  })
}
</script>

<template>
  <div class="space-y-48">
    <ElHero v-for="(item, i) in uc.items" :key="i" :card="createHeroCard(item, i)" />
  </div>
</template>
