<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { pathCheck, vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import SuperTitle from '../el/SuperTitle.vue'
import { schema } from './config'

defineOptions({ name: 'ConvertCta' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'ctaAlpha',
    selector: `[data-card-id="${props.card.cardId}"]`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `[data-card-id="${props.card.cardId}"] .animate-item`,
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
        <div class="flex gap-12 md:gap-32 flex-col lg:flex-row lg:basis-[500px] justify-center" :class="uc.benefits?.items?.length ? '' : ''">
          <div class="gap-8 xl:gap-8 flex flex-col justify-center lg:col-span-7">
            <div class="space-y-4 xl:space-y-6">
              <SuperTitle
                v-if="uc.superTitle"
                :card
                :base-path="pathCheck('superTitle', schema)"
                :super-title="uc.superTitle"
              />

              <CardText
                tag="h2"
                :card
                :path="pathCheck('title', schema)"
                class="font-semibold x-font-title text-2xl lg:text-3xl animate-item text-balance"
                animate="fade"
              />

              <CardText
                v-if="uc.subTitle"
                tag="p"
                :card
                :path="pathCheck('subTitle', schema)"
                class="text-xl text-theme-600 dark:text-theme-300 max-w-2xl animate-item leading-relaxed"
                animate="fade"
              />
            </div>

            <CardActionArea
              :card
              :classes="{ buttons: 'flex gap-4' }"
              :base-path="pathCheck('action', schema)"
              size="xl"
            />
          </div>

          <!-- Benefits Grid -->
          <div v-if="uc.benefits?.items?.length" class="flex flex-col gap-4 lg:gap-6 justify-center lg:col-span-5">
            <CardText :card :path="pathCheck('benefits.title', schema)" class="text-theme-400 dark:text-theme-500 text-lg md:text-2xl x-font-title" />
            <div
              v-for="(benefit, i) in uc.benefits.items"
              :key="i"
              class="flex gap-4  animate-item max-w-sm items-center justify-start w-full"
            >
              <XIcon v-if="benefit.icon" :media="benefit.icon" class="size-8 lg:size-10 text-theme-400/70 dark:text-theme-500/70" />
              <div class="grow w-full">
                <CardText
                  tag="h3"
                  :card
                  :path="pathCheck(`benefits.items.${i}.label`)"
                  class="font-semibold mb-1 text-lg lg:text-xl x-font-title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
