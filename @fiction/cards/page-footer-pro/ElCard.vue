<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XLogoType from '@fiction/ui/media/XLogoType.vue'
import CardNavLink from '../CardNavLink.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'

defineOptions({ name: 'FooterPro' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)

vue.onMounted(() => {
  useElementVisible({
    caller: 'footerPro',
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
  <div :id="card.cardId">
    <div :class="card.classes.value.contentWidth">
      <div class="border-t border-theme-200 dark:border-theme-700/80 pt-16 mt-4">
        <!-- Main grid layout -->
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <!-- Brand section -->
          <div class="xl:col-span-4 space-y-6">
            <div class="space-y-4">
              <XLogoType
                v-if="uc.brand?.logo"
                :logo="uc.brand?.logo"
                :classes="{
                  text: 'x-font-title text-3xl font-medium',
                }"
                :media-handling="{ height: 2 }"
                class="transition-all group-hover:opacity-80 duration-200"
                data-test-id="footer-pro-logo"
              />

              <CardText
                tag="p"
                :card
                path="brand.tagline"
                class="text-lg text-theme-600 dark:text-theme-400 animate-item x-font-title"
                animate="fade"
              />
            </div>
            <CardActionArea
              v-if="uc.brand?.action"
              :card
              base-path="brand.action"
              :classes="{ buttons: 'flex gap-4' }"
              animate="fade"
              design="solid"
            />
          </div>

          <!-- Navigation Columns -->
          <div class="xl:col-span-8">
            <div class="flex flex-wrap gap-x-16 gap-y-8 justify-start xl:justify-end">
              <div
                v-for="(column, i) in uc.menus"
                :key="i"
                class="grow-0 basis-44 animate-item"
              >
                <CardText
                  tag="h3"
                  :card
                  :path="`menus.${i}.title`"
                  class="text-lg x-font-title text-theme-400 dark:text-theme-500 mb-4"
                  animate="fade"
                />
                <ul class="space-y-3">
                  <li v-for="(item, ii) in column.items" :key="ii">
                    <CardNavLink
                      :card
                      :item="{
                        ...item,
                        basePath: `menus.${i}.items.${ii}`,
                      }"
                      hover-effect="underline"
                      class="hover:underline md:text-lg font-sans transition-colors"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="mt-16 pt-8 border-t border-theme-200 dark:border-theme-800">
          <div class="flex flex-col gap-8 md:flex-row justify-between items-start">
            <CardActionArea
              v-if="uc.badges"
              :card
              base-path="badges"
              :classes="{ buttons: 'flex flex-wrap gap-4' }"
              design="ghost"
            />

            <!-- Social -->
            <div class="flex items-center gap-6">
              <a
                v-for="(social, i) in uc.additional?.social"
                :key="i"
                :href="social.href"
                :title="social.label"
                class="text-theme-400 hover:text-primary-500 dark:text-theme-600 dark:hover:text-primary-400 transition-colors animate-item"
              >
                <XIcon
                  v-if="social.media"
                  :media="social.media"
                  class="size-7"
                />
              </a>
            </div>
          </div>

          <!-- Links and Logo -->
          <div class="mt-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex flex-wrap gap-x-8 gap-y-4">
              <CardNavLink
                v-for="(item, i) in uc.additional?.links"
                :key="i"
                :card
                :item="{
                  ...item,
                  basePath: `additional.links.${i}`,
                }"
                class="text-sm text-theme-600 hover:text-primary-500 dark:text-theme-400 dark:hover:text-primary-400 font-sans transition-colors animate-item"
              />
            </div>

            <!-- Fiction Attribution -->
            <div class="text-center animate-item">
              <a
                href="https://www.fiction.com"
                title="Built with Fiction"
                class="text-theme-300/30 dark:text-theme-600/60 dark:hover:text-primary-400 hover:text-primary-500 transition-all"
              >
                <svg
                  class="h-8"
                  width="42"
                  height="42"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                ><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>

              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
