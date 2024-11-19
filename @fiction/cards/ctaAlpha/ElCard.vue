<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XButton from '@fiction/ui/buttons/XButton.vue'
import EffectFitText from '@fiction/ui/effect/EffectFitText.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CaptureAction from '../capture/CaptureAction.vue'
import CardText from '../CardText.vue'
import CommunityJoin from './CommunityJoin.vue'

defineOptions({ name: 'CtaAlpha' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const email = vue.ref('')
const isSubmitted = vue.ref(false)
const isLoading = vue.ref(false)

async function handleSubmit() {
  if (!email.value)
    return

  isLoading.value = true
  // Implement your newsletter signup logic here
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSubmitted.value = true
  isLoading.value = false
}

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
      <div class="px-6 lg:px-0 py-16 lg:py-24">
        <div class="grid gap-20 xl:gap-32" :class="uc.benefits?.length ? 'lg:grid-cols-12' : ''">
          <div class="gap-8 xl:gap-10 flex flex-col justify-center xl:col-span-6 md:col-span-7">
            <div class="space-y-4 xl:space-y-6">
              <CardText
                v-if="uc.kicker"
                tag="div"
                :card
                path="kicker"
                class="text-orange-600 dark:text-orange-400 animate-item font-sans md:text-lg"
                animate="fade"
              />

              <CardText
                tag="h2"
                :card
                path="title"
                class="font-semibold x-font-title text-5xl animate-item"
                animate="fade"
              />

              <CardText
                v-if="uc.description"
                tag="p"
                :card
                path="description"
                class="text-xl lg:text-2xl text-theme-600 dark:text-theme-300 max-w-2xl animate-item"
                animate="fade"
              />
            </div>

            <!-- Action Area -->
            <div class="max-w-xl animate-item">
              <CaptureAction :card />
            </div>

            <div><CommunityJoin text="Join 12030 visionaries" /></div>
          </div>

          <!-- Benefits Grid -->
          <div v-if="uc.benefits?.length" class="flex flex-col gap-4 lg:gap-6 justify-center xl:col-span-6 md:col-span-5">
            <CardText :card path="benefitsTitle" class="text-theme-400 dark:text-theme-500 text-xl x-font-title" />
            <div
              v-for="(benefit, i) in uc.benefits"
              :key="i"
              class="flex gap-4  animate-item max-w-sm items-center justify-start w-full"
            >
              <XIcon v-if="benefit.media" :media="benefit.media" class="size-12 text-theme-400/70 dark:text-theme-500/70" />
              <div class="grow w-full">
                <CardText
                  tag="h3"
                  :card
                  :path="`benefits.${i}.title`"
                  class="font-semibold mb-1 text-xl x-font-title"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
