<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import AnimItemPop from '@fiction/ui/anim/AnimItemPop.vue'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import CardText from '../CardText.vue'
import CardLink from '../el/CardLink.vue'

defineOptions({ name: 'TimelineCard' })

const props = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => props.card.userConfig.value)
const timelineProgress = vue.ref(0)

function updateProgress() {
  const element = document.getElementById(props.card.cardId)
  if (!element)
    return

  const rect = element.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const elementTop = rect.top + scrollTop
  const elementHeight = rect.height

  // Calculate how far we've scrolled into the element
  const scrolledIntoElement = scrollTop - elementTop + (elementHeight * 0.6)

  // Convert to percentage (0 to 1)
  const progress = Math.max(0, Math.min(1, scrolledIntoElement / elementHeight))

  // Scale the progress to be between 0.2 and 0.9
  const scaledProgress = 0.2 + (progress * 0.8)

  timelineProgress.value = scaledProgress
}
// Set up scroll listener
vue.onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress() // Initial calculation

  useElementVisible({
    caller: 'timelineCard',
    selector: `#${props.card.cardId}`,
    onVisible: async () => {
      if (uc.value.style?.animation === 'none')
        return

      await animateItemEnter({
        targets: `#${props.card.cardId} .animate-item`,
        themeId: uc.value.style?.animation || 'fade',
        config: {
          overallDelay: 150,
          stagger: 100,
        },
      })
    },
  })
})

vue.onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

const timelineClasses = vue.computed(() => {
  const layout = uc.value.style?.layout || 'vertical'
  const baseClasses = 'relative max-w-4xl mx-auto pt-24 pb-8'

  const layoutClasses = {
    vertical: 'flex flex-col gap-12 md:gap-32',
    alternating: 'flex flex-col gap-12 md:gap-32',
    horizontal: 'flex flex-row gap-8 overflow-x-auto pb-8 snap-x snap-mandatory',
  }[layout]

  return `${baseClasses} ${layoutClasses}`
})

const iconScale = vue.computed(() => {
  const prog = timelineProgress.value
  const scaleAmount = Math.min(1, 0.5 + prog)
  return {
    transform: `scale(${scaleAmount})`,
  }
})

const timelineLineStyle = vue.computed(() => {
  const prog = timelineProgress.value * 100

  const p = Math.min(prog, 93)

  return {
    background: `linear-gradient(to bottom,
      rgba(var(--primary-500) / 0.1) 0%,
      rgba(var(--primary-500) / 0.8) 10%,
      rgba(var(--primary-500) / 0.8) ${p}%,
      rgba(var(--primary-500) / 0.2) ${p + 7}%,
      rgba(var(--primary-500) / 0.1) 100%
    )`,
  }
})
</script>

<template>
  <div :id="card.cardId" :class="card.classes.value.contentWidth">
    <div :class="timelineClasses">
      <!-- Animated Timeline Line -->
      <div
        class="absolute left-[28px] md:left-[166px] top-0 bottom-0 w-0.5 transition-all duration-300 ease-in-out"
        :style="timelineLineStyle"
      />

      <!-- Rest of the template remains the same -->
      <div
        v-for="(milestone, i) in uc.milestones"
        :key="i"
        class="animate-item relative flex gap-8"
      >
        <!-- Date Section -->
        <AnimItemPop class="hidden md:block w-[120px] pt-2 pr-8 text-right" caller="timelineDate">
          <div class="text-sm font-medium text-theme-600 dark:text-theme-0 font-sans">
            <CardText
              :card="card"
              :path="`milestones.${i}.date`"
              tag="div"
            />
            <CardText
              v-if="milestone.endDate"
              :card="card"
              :path="`milestones.${i}.endDate`"
              tag="div"
              class="text-theme-500 dark:text-theme-400"
            />
          </div>
        </AnimItemPop>

        <AnimItemPop class="relative z-10 flex-none" caller="timeline">
          <div class="relative md:-ml-[13px] mt-1">
            <div class="absolute inset-0 bg-primary-50 dark:bg-primary-900/50 rounded-full blur-md opacity-50" />
            <div class="relative flex items-center justify-center size-14 rounded-full bg-primary-50 dark:bg-primary-975 border-2 border-primary-300 dark:border-primary-600">
              <XIcon
                v-if="milestone.icon"
                :media="milestone.icon"
                class="size-8 text-primary-500"
              />
              <div
                v-else
                class="size-2 rounded-full bg-primary-500"
              />
            </div>
          </div>
        </AnimItemPop>

        <div class="flex-1 pb-8">
          <div class="space-y-4">
            <div>
              <div class="flex items-center gap-4">
                <CardText
                  :card="card"
                  :path="`milestones.${i}.title`"
                  tag="h3"
                  class="text-4xl font-semibold x-font-title"
                  animate="rise"
                />
              </div>
              <div class="flex items-center gap-4 mt-1 text-theme-600 dark:text-theme-200 text-2xl">
                <CardText
                  v-if="milestone.organization"
                  :card="card"
                  :path="`milestones.${i}.organization`"
                  tag="span"
                  :animate="true"
                />
                <XButton
                  v-if="milestone.isCurrent"
                  size="sm"
                  theme="primary"
                  design="outline"
                >
                  Current
                </XButton>
              </div>
            </div>

            <CardText
              v-if="milestone.description"
              :card="card"
              :path="`milestones.${i}.description`"
              tag="p"
              class="text-theme-600 dark:text-theme-400 text-2xl"
              :animate="true"
            />

            <div v-if="milestone.media" class="mt-4">
              <XMedia
                :media="milestone.media"
                class="w-full aspect-video rounded-lg overflow-hidden"
              />
            </div>

            <div v-if="milestone.link" class="pt-2">
              <CardLink
                :card="card"
                :path="`milestones.${i}.link`"
                class="inline-flex items-center gap-1 text-theme-600 hover:text-theme-700 dark:text-theme-300 dark:hover:text-theme-200"
              >
                Learn more
              </CardLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
