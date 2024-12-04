<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { vue } from '@fiction/core'
import EffectScrollReveal from '@fiction/ui/effect/EffectScrollReveal.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})

const editingStoryText = vue.ref(false)
</script>

<template>
  <div>
    <div v-for="(item, i) in uc.items" :key="i" class="py-[4vw] px-4">
      <div
        class="md:flex gap-8 md:gap-16 lg:gap-20 relative"
        :class="[card.classes.value.contentWidth, uc.layout === 'right' ? 'md:flex-row-reverse' : '']"
      >
        <div class="md:w-[clamp(100px,20%,400px)] pt-4 pb-6">
          <div class="top-6 flex justify-center md:justify-end" :class="uc.scrollHandling === 'sticky' ? 'sticky' : ''">
            <XMedia :animate="true" :media="item.media" class="aspect-square w-full " />
          </div>
        </div>
        <div class=" md:w-[70%] grow space-y-4">
          <CardText :card :path="`items.${i}.title`" tag="h2" class="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold !leading-[1.4]" />
          <EffectScrollReveal class="space-y-6" :disable="card.site?.isEditable.value">
            <CardText
              tag="div"
              :card
              :path="`items.${i}.content`"
              class="prose dark:prose-invert prose-sm md:prose-md lg:prose-xl text-xl sm:text-3xl lg:text-4xl xl:text-5xl !leading-[1.4]"
              @editing="editingStoryText = $event"
            />
          </EffectScrollReveal>

          <CardActionArea
            size="xl"
            :card
            :base-path="`items.${i}.action`"
            :classes="{
              buttons: 'flex gap-4 lg:gap-6 text-2xl justify-center md:justify-start' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
