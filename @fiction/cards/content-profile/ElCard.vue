<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import { vue } from '@fiction/core'
import { useElementVisible } from '@fiction/ui/anim'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'
import NavDots from '../el/NavDots.vue'
import SuperTitle from '../el/SuperTitle.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => {
  return card.userConfig.value || {}
})

const mediaItems = vue.computed(() => {
  return uc.value.mediaItems?.filter(_ => _.media?.url)
})
const activeItem = vue.ref(0)
const isVisible = vue.ref(false)
vue.onMounted(async () => {
  await useElementVisible({ selector: `.minimal-profile`, onVisible: () => isVisible.value = true, caller: 'minimalProfile' })
})

const hoverClasses = 'group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors'
</script>

<template>
  <div class="minimal-profile" :class="card.classes.value.contentWidth">
    <div>
      <div class="lg:flex gap-10 md:gap-12 xl:gap-24" :class="uc.layout === 'right' ? 'md:flex-row-reverse' : ''">
        <div class="w-full max-w-sm xl:max-w-full xl:w-[50%] mb-8 ">
          <div class="relative">
            <EffectGlare wrap-class="rounded-[20px]">
              <AnimClipPath
                caller="minimalProfile"
                :animate="true"
                class="aspect-[5/7] relative w-full overflow-x-auto snap-mandatory snap-x  flex no-scrollbar clip-path-anim"
              >
                <XMedia v-for="(item, i) in mediaItems" :key="i" :media="item.media" class="relative slide w-full h-full snap-center shrink-0" />
              </AnimClipPath>
            </EffectGlare>
            <NavDots
              v-model:active-item="activeItem"
              :items="mediaItems || []"
              :wrap-selector="`[data-card-id='${card.cardId}']`"
              class="absolute bottom-4 z-20 justify-center w-full "
              :overlay="true"
            />
          </div>
        </div>
        <div class="lg:w-[60%] xl:w-[50%] mt-6 md:mt-0 flex items-center">
          <div class="flex flex-col justify-center gap-10 2xl:gap-16 " :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
            <div class="details">
              <SuperTitle
                v-if="uc.superTitle"
                :card
                class="mb-4"
                base-path="superTitle"
                :super-title="uc.superTitle"
              />
              <EffectFitText
                tag="h1"
                :content="uc.title || ''"
                class="heading text-4xl font-semibold md:text-4xl lg:text-5xl x-font-title lg:leading-[1.2] "
                :lines="2"
                :min-size="40"
              >
                <CardText :card tag="span" path="title" animate="rise" />
              </EffectFitText>

              <CardText
                tag="div"
                :card
                class="sub-heading mt-6 prose prose-lg md:prose-2xl leading-normal dark:prose-invert prose-theme"
                path="content"
                animate="rise"
              />
            </div>

            <div class="list space-y-4 text-base xl:text-lg @container">
              <CardText
                tag="h3"
                :card
                class="sub-heading text-theme-300 dark:text-theme-500 x-font-title font-medium opacity-80"
                path="detailsTitle"
                placeholder="List Title"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <a
                  v-for="(item, i) in uc.details"
                  :key="i"
                  :href="item.href"
                  :class="item.href ? 'hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300' : ''"
                  class="contact-item group/item flex items-center justify-between gap-6 p-4 rounded-xl dark:bg-theme-700/30 border border-theme-300/70 dark:border-theme-600/50 "
                >
                  <div class="flex flex-row gap-2 grow min-w-0">

                    <div class="min-w-0 flex-1">
                      <div class="flex gap-1 items-center justify-between w-full">

                        <CardText
                          :card
                          tag="span"
                          :class="item.href ? hoverClasses : ''"
                          class="block x-font-title font-medium text-theme-900 dark:text-theme-100"
                          :path="`details.${i}.label`"
                        />
                        <XIcon
                          v-if="item.icon"
                          class="size-6 text-theme-400/60 dark:text-theme-600/60"
                          :media="item.icon"
                        />
                      </div>
                      <CardText
                        v-if="item.value"
                        :card
                        tag="span"
                        :class="item.href ? hoverClasses : ''"
                        class="block  mt-0.5 font-sans text-theme-600 dark:text-theme-400 truncate"
                        :path="`details.${i}.value`"
                      />
                    </div>
                  </div>

                </a>
              </div>
            </div>

            <CardActionArea
              :card
              base-path="action"
              :classes="{
                buttons: 'flex gap-4 text-2xl justify-center md:justify-start flex-wrap',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
