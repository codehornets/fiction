<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CaptureAction from '../capture/CaptureAction.vue'
import CardText from '../CardText.vue'
import CardButtons from '../el/CardButtons.vue'
import SuperTitle from '../el/SuperTitle.vue'
import CommunityJoin from './CommunityJoin.vue'

defineOptions({ name: 'CtaAlpha' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'ctaAlpha',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: 'fade',
        config: { overallDelay: 150 },
      })
    },
  })
})
</script>

<template>
  <div :id="card.cardId" class="relative overflow-hidden bg-theme-50/50 dark:bg-theme-950/50">
    <div :class="card.classes.value.contentWidth">
      <div class="">
        <div class="grid gap-20 xl:gap-32" :class="uc.benefits?.items?.length ? 'lg:grid-cols-12' : ''">
          <div class="gap-8 xl:gap-10 flex flex-col justify-center md:col-span-7">
            <div class="space-y-4 xl:space-y-6">
              <SuperTitle
                :card
                path-to-text="super.text"
                :theme="uc.super?.color"
                :icon="uc.super?.icon"
              />

              <CardText
                tag="h2"
                :card
                path="title"
                class="font-semibold x-font-title text-5xl animate-item text-balance"
                animate="fade"
              />

              <CardText
                v-if="uc.subTitle"
                tag="p"
                :card
                path="subTitle"
                class="text-xl lg:text-2xl text-theme-600 dark:text-theme-300 max-w-2xl animate-item"
                animate="fade"
              />
            </div>

            <!-- Action Area -->
            <div class="max-w-screen-md animate-item">
              <CardButtons v-if="uc.actions?.type === 'buttons' && uc.actions?.buttons" class="flex gap-4" :card :actions="uc.actions.buttons" ui-size="xl" />
              <CaptureAction v-else :card />
            </div>

            <div>
              <CommunityJoin
                v-if="uc.communityJoin?.isEnabled"
                :count="uc.communityJoin?.count"
                :text="uc.communityJoin?.count ? `Join ${uc.communityJoin?.count}+ leaders` : 'Join The Community'"
              />
            </div>
          </div>

          <!-- Benefits Grid -->
          <div v-if="uc.benefits?.items?.length" class="flex flex-col gap-4 lg:gap-6 justify-center md:col-span-5">
            <CardText :card path="benefits.title" class="text-theme-400 dark:text-theme-500 text-2xl x-font-title" />
            <div
              v-for="(benefit, i) in uc.benefits.items"
              :key="i"
              class="flex gap-4  animate-item max-w-sm items-center justify-start w-full"
            >
              <XIcon v-if="benefit.icon" :media="benefit.icon" class="size-12 text-theme-400/70 dark:text-theme-500/70" />
              <div class="grow w-full">
                <CardText
                  tag="h3"
                  :card
                  :path="`benefits.items.${i}.label`"
                  class="font-semibold mb-1 text-2xl x-font-title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
