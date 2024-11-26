<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'

import NavDots from '../el/NavDots.vue'
import SuperTitle from '../el/SuperTitle.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const mediaItems = vue.computed(() => {
  return uc.value.items || []
})

const activeItem = vue.ref(0)
let timer: NodeJS.Timeout | undefined = undefined
function autoSlideTimer() {
  const isActive = uc.value.autoSlide

  if (!isActive)
    return

  if (timer)
    clearTimeout(timer)

  timer = setTimeout(() => {
    activeItem.value = activeItem.value + 1

    if (activeItem.value >= mediaItems.value.length) {
      activeItem.value = 0
    }

    autoSlideTimer()
  }, 10000)
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
        <template v-if="item.media">
          <template v-if="item.media.format === 'video'">
            <video class="object-cover w-full h-full" autoplay muted loop>
              <source :src="item.media.url" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </template>
          <template v-else>
            <img :src="item.media.url" alt="Media" class="object-cover w-full h-full">
          </template>
        </template>
        <div class="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 z-20">
          <div class="max-w-screen-lg  p-6">
            <SuperTitle :card :base-path="`items.${i}.superTitle`" />
            <CardText :card tag="h3" :path="`items.${i}.superHeader`" animate="fade" class="mb-5 opacity-60 lg:text-[calc(10px+1vw)] font-normal font-sans text-balance" />
            <div class="space-y-8">
              <CardText :card tag="h1" :path="`items.${i}.title`" animate="fade" class="text-6xl lg:text-[calc(20px+5vw)] font-bold x-font-title text-balance" />
              <CardText :card tag="p" :path="`items.${i}.subTitle`" animate="fade" class="mt-2 text-3xl lg:text-[calc(16px+2.5vw)] text-balance leading-none" />
            </div>
            <CardActionArea
              :card
              :base-path="`items.${i}.action`"
              :classes="{ buttons: 'flex gap-4 justify-center' }"
              class="mt-12"
              size="xl"
              animate="rise"
              theme="overlay"
            />
          </div>
        </div>
      </div>
    </div>
    <NavDots :active-item="activeItem" :items="mediaItems || []" :container-id="card.cardId" class="absolute bottom-4 z-20 left-1/2 -translate-x-1/2" @update:active-item="setActiveItem($event)" />
  </div>
</template>
