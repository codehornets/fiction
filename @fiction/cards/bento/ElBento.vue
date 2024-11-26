<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import XLogo from '@fiction/ui/media/XLogo.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardActionArea from '../el/CardActionArea.vue'
import SuperTitle from '../el/SuperTitle.vue'
import {
  getContentMaxWidth,
  getContentStyles,
  getGradientStyle,
  getGridStyle,
  getItemStyles,
  getPositionStyles,
  getTextOverlayStyles,
} from './utils'

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const bentoWrapEl = vue.ref<HTMLElement | null>(null)
const gapClass = vue.computed(() => {
  const gapMap = {
    'xxs': 'gap-1',
    'xs': 'gap-3',
    'sm': 'gap-4',
    'md': 'gap-4 lg:gap-8',
    'lg': 'gap-4 lg:gap-12',
    'xl': 'gap-4 lg:gap-16',
    '2xl': 'gap-4 lg:gap-24',
  }

  return gapMap[uc.value.gapSize || 'md']
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div ref="bentoWrapEl" class="grid grid-cols-12 auto-rows-[200px]" :class="[gapClass]">
      <ClipPathAnim
        v-for="(item, i) in uc.items"
        :key="i"
        :animate="uc.animate || 'expand'"
        caller="bento"
        class="bento-item relative overflow-hidden group rounded-3xl transition-all duration-300 @container"
        :style="[getGridStyle(item).style, getItemStyles(item, bentoWrapEl)]"
        :class="getGridStyle(item).class"
      >
        <div
          class="relative h-full px-6 py-8 @xs:px-8 @xs:py-10 @2xl:p-12 @4xl:p-16 flex flex-col z-10"
          :style="[
            getPositionStyles(item),
            item.bg?.url ? getTextOverlayStyles(item) : {},
          ]"
        >
          <div
            class="flex flex-col gap-1 @2xl:gap-3"
            :style="getContentMaxWidth(item)"
          >
            <XLogo
              v-if="item.media && (!item.verticalPosition || item.verticalPosition !== 'top')"
              :media="item.media"
              class="max-w-full mb-6"
              :style="{ width: item.media.displayWidthPercent ? `${item.media.displayWidthPercent}%` : 'auto' }"
            />
            <SuperTitle
              :card
              :base-path="`items.${i}.superTitle`"
              :classes="{ text: 'text-sm @lg:text-base @2xl:text-lg font-medium opacity-90 font-sans' }"
              :theme="item.bg?.url ? 'overlay' : (item.theme || 'default')"
            />

            <h3
              v-if="item.title"
              class="text-2xl @xs:text-3xl @xl:text-4xl @5xl:text-6xl @xl:mb-2 @5xl:mb-4 text-balance font-medium @2xl:font-semibold  x-font-title"
              :style="getContentStyles(item, 'text', bentoWrapEl)"
            >
              {{ item.title }}
            </h3>

            <p
              v-if="item.content"
              class="line-clamp-3 opacity-90 @xs:text-lg @xl:text-xl @5xl:text-2xl"
              :style="getContentStyles(item, 'sub', bentoWrapEl)"
            >
              {{ item.content }}
            </p>

            <CardActionArea
              :card
              class="mt-4"
              :base-path="`items.${i}.action`"
              :classes="{ buttons: 'flex gap-3' }"
              design="outline"
              :theme="(item.bg?.url ? 'overlay' : (item.theme || 'default'))"
            />

            <XLogo
              v-if="item.media && item.verticalPosition === 'top'"
              :media="item.media"
              class="max-w-full mt-6"
              :style="{ width: item.media.displayWidthPercent ? `${item.media.displayWidthPercent}%` : 'auto' }"
            />
          </div>
        </div>

        <a
          v-if="item.href"
          :href="item.href"
          class="absolute inset-0 z-20"
          @click="card.goto(item.href)"
        />

        <div
          v-if="item.bg"
          class="z-[5] absolute inset-0 mix-blend-multiply"
          :style="getGradientStyle(item)"
        />

        <XMedia
          v-if="item.bg"
          :media="item.bg"
          class="absolute inset-0 z-0"
          image-mode="cover"
        />
      </ClipPathAnim>
    </div>
  </div>
</template>
