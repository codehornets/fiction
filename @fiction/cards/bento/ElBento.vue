<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { BentoItem, UserConfig } from './index'
import { vue } from '@fiction/core'
import { animateItemEnter } from '@fiction/ui/anim'
import ClipPathAnim from '@fiction/ui/anim/AnimClipPath.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XLogo from '@fiction/ui/media/XLogo.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
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

vue.onMounted(() => {
  animateItemEnter({ targets: '.bento-item', themeId: 'fade', totalTime: 1200 })
})

const gapClass = vue.computed(() => {
  const gapMap = {
    'xxs': 'gap-1',
    'xs': 'gap-2',
    'sm': 'gap-4',
    'md': 'gap-6',
    'lg': 'gap-10',
    'xl': 'gap-14',
    '2xl': 'gap-20',
  }

  return gapMap[uc.value.gapSize || 'md']
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div class="grid grid-cols-12 auto-rows-[200px]" :class="[gapClass]">
      <ClipPathAnim
        v-for="(item, index) in uc.items"
        :key="index"
        :animate="uc.animate || ''"
        caller="bento"
        class="bento-item relative overflow-hidden group rounded-3xl transition-all duration-300 @container"
        :style="[getGridStyle(item).style, getItemStyles(item)]"
        :class="getGridStyle(item).class"
      >
        <div
          class="relative h-full px-6 py-8 @xs:px-8 @xs:py-10 @2xl:p-12 flex flex-col z-10"
          :style="[
            getPositionStyles(item),
            item.bg ? getTextOverlayStyles(item) : {},
          ]"
        >
          <div
            class="flex flex-col gap-1"
            :style="getContentMaxWidth(item)"
          >
            <XLogo
              v-if="item.media && (!item.verticalPosition || item.verticalPosition !== 'top')"
              :media="item.media"
              class="max-w-full mb-6"
              :style="{ width: item.media.displayWidthPercent ? `${item.media.displayWidthPercent}%` : 'auto' }"
            />
            <div v-if="item.superTitle || item.superIcon" class="flex gap-3 items-center">
              <div v-if="item.superIcon" class="size-10 rounded-full flex items-center justify-center">
                <XIcon :media="item.superIcon" class="size-6" />
              </div>
              <div
                class="text-sm @lg:text-base font-medium opacity-90 font-sans"
                :style="getContentStyles(item, 'super')"
              >
                {{ item.superTitle }}
              </div>
            </div>

            <h3
              v-if="item.title"
              class="text-2xl @xs:text-3xl @xl:text-4xl @5xl:text-6xl @xl:mb-2 @5xl:mb-4 text-balance font-medium @2xl:font-semibold  x-font-title"
              :style="getContentStyles(item, 'text')"
            >
              {{ item.title }}
            </h3>

            <p
              v-if="item.content"
              class="line-clamp-3 opacity-90 @xs:text-lg @xl:text-xl @5xl:text-2xl"
              :style="getContentStyles(item, 'sub')"
            >
              {{ item.content }}
            </p>

            <div v-if="item.actions?.length" class="flex gap-2 mt-4">
              <XButton
                v-for="(action, actionIndex) in item.actions"
                :key="actionIndex"
                v-bind="action"
              />
            </div>

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
