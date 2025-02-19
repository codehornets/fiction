<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { pathCheck, vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import NavDots from '../el/NavDots.vue'
import SuperTitle from '../el/SuperTitle.vue'
import { schema } from './config'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const mediaItems = vue.computed(() => uc.value.items || [])

const activeItem = vue.ref(0)
let timer: NodeJS.Timeout | undefined = undefined
function autoSlideTimer() {
  const isActive = uc.value.autoSlide

  if (!isActive)
    return

  if (timer)
    clearTimeout(timer)

  timer = setTimeout(() => {
    const nextIndex = activeItem.value + 1

    if (nextIndex >= mediaItems.value.length) {
      activeItem.value = 0
    }
    else {
      activeItem.value = nextIndex
    }

    autoSlideTimer()
  }, 12000)
}

vue.onMounted(() => {
  autoSlideTimer()
})

function setActiveItem(index: number) {
  activeItem.value = index

  autoSlideTimer()
}
</script>

<template>
  <div class="relative h-screen w-full">
    <div class="absolute inset-0 flex overflow-x-auto no-scrollbar snap-mandatory snap-x">
      <div v-for="(item, i) in mediaItems" :key="i" class="slide relative flex-shrink-0 snap-center w-full h-full">
        <div class="absolute inset-0 bg-opacity-50 bg-black/50 z-10" />
        <XMedia v-if="item.media" class="object-cover w-full h-full" :media="item.media" />
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 z-20">
          <div class="max-w-screen-lg space-y-12 p-6">
            <div class="space-y-6">
              <SuperTitle
                :card
                :base-path="pathCheck(`items.${i}.superTitle`, schema)"
                class="justify-center opacity-80"
                theme="overlay"
              />
              <div class="space-y-8">
                <CardText :card tag="h1" :path="pathCheck(`items.${i}.title`, schema)" animate="fade" class="text-6xl lg:text-[calc(20px+4vw)] font-semibold x-font-title text-balance" />
                <CardText :card tag="p" :path="pathCheck(`items.${i}.subTitle`, schema)" animate="fade" class="mt-2 text-3xl lg:text-[calc(16px+1.3vw)] text-balance !leading-[1.3]" />
              </div>
            </div>
            <CardActionArea
              :card
              :base-path="pathCheck(`items.${i}.action`, schema)"
              :classes="{ buttons: 'flex gap-4 justify-center' }"
              size="xl"
              animate="rise"
              theme="overlay"
            />
          </div>
        </div>
      </div>
    </div>
    <NavDots
      :active-item="activeItem"
      :items="mediaItems || []"
      :wrap-selector="`[data-card-id='${card.cardId}']`"
      class="absolute bottom-4 z-20 left-1/2 -translate-x-1/2 justify-center "
      @update:active-item="setActiveItem($event)"
    />
  </div>
</template>
