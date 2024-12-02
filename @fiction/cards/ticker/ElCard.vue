<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { TickerConfig, UserConfig } from './config'
import CardText from '@fiction/cards/CardText.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { type FontFamily, getTextColorBasedOnBackground, isDarkOrLightMode, vue } from '@fiction/core'
import { fontFamilyByKey } from '@fiction/site/utils/fonts'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value || {})
const tickerWrap = vue.ref<HTMLElement>()
const scrollTranslate = vue.ref(0)

// Font registration
vue.watch(() => uc.value.items, () => {
  const items = uc.value.items || []
  const fonts = items.map(item => item.font).filter(Boolean) as string[]

  const fontObject = fonts.reduce((acc, font) => {
    acc[font] = { family: font, stack: 'sans' }
    return acc
  }, {} as Record<string, FontFamily>)

  const site = props.card.site
  if (site) {
    site.userFonts.value = { ...site.userFonts.value, ...fontObject }
  }
}, { immediate: true })

const items = vue.computed(() => {
  const conf = uc.value
  const initItems = conf.items || []
  return initItems.map(item => ({
    font: { family: 'inherit' },
    fontSize: `${conf.settings?.fontSize || '8'}vw`,
    direction: 'left' as const,
    speed: 50,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    ...item,
  }))
})

// Smooth scroll handling
vue.onMounted(() => {
  if (!tickerWrap.value)
    return

  const updateTransform = () => {
    if (!tickerWrap.value)
      return
    const rect = tickerWrap.value.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // Calculate progress through viewport
    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
    const clampedProgress = Math.max(0, Math.min(1, progress))

    // Create a smooth translation effect
    scrollTranslate.value = clampedProgress * 25
  }

  const onScroll = () => {
    window.requestAnimationFrame(updateTransform)
  }

  updateTransform() // Initial position
  window.addEventListener('scroll', onScroll, { passive: true })

  vue.onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
})

function getColorStyle(ticker: TickerConfig) {
  const bgColor = ticker.backgroundColor
  const bgColorDark = ticker.backgroundColorDark || bgColor

  if (!tickerWrap.value)
    return {}

  const isDark = isDarkOrLightMode(tickerWrap.value) === 'dark'
  const backgroundColor = isDark ? bgColorDark : bgColor

  if (!backgroundColor)
    return {}

  return {
    backgroundColor,
    color: getTextColorBasedOnBackground(backgroundColor),
  }
}

function getAnimationDuration(speed?: number): string {
  if (speed === undefined)
    speed = 50
  if (speed === 0)
    return '100000s'

  speed = Math.max(0, Math.min(100, speed))
  return `${1000 * Math.exp(-0.0462 * speed)}s`
}

function getTransformStyle(item: TickerConfig) {
  const direction = item.direction === 'right' ? -1 : 1
  const translateAmount = scrollTranslate.value * direction

  const out = [`translateX(${translateAmount}%)`]

  if (item.transform?.rotateX)
    out.push(`rotateX(${item.transform.rotateX}deg)`)

  if (item.transform?.rotateY)
    out.push(`rotateY(${item.transform.rotateY}deg)`)

  if (item.transform?.rotateZ)
    out.push(`rotateZ(${item.transform.rotateZ}deg)`)

  return {
    transform: out.join(' '),
  }
}
</script>

<template>
  <div class="">
    <div ref="tickerWrap" class="x-font-title font-bold [perspective:1000px] " :style="{ perspective: '1000px' }">
      <CardLink
        v-for="(item, i) in items"
        :key="i"
        :card
        :style="{
          'fontFamily': fontFamilyByKey(item.font.family),
          'fontSize': item.fontSize,
          ...getTransformStyle(item),
          '-webkit-text-stroke-width': item.outline ? '1px' : '',
          '-webkit-text-stroke-color': item.outline ? 'inherit' : '',
          '-webkit-text-fill-color': item.outline ? 'transparent' : '',
          'line-height': '1.2',
          'transition': 'transform 0.1s linear',
        }"
        class="transition-all block"
        :class="item.href ? 'hover:opacity-80' : ''"
        :href="item.href"
        @click.stop
      >
        <div
          class="flex whitespace-nowrap"
          :class="`animate-scroll-${item.direction}`"
          :style="{ animationDuration: getAnimationDuration(item.speed) }"
        >
          <div :style="{ ...getColorStyle(item) }">
            <span v-for="ii in 30" :key="ii" class="font-bold">
              <CardText tag="span" :card :path="`items.${i}.text`" />&nbsp;
            </span>
          </div>
        </div>
      </CardLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll-left {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(-500%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-500%); }
  100% { transform: translateX(-100%); }
}

.animate-scroll-left {
  animation: scroll-left 180s linear infinite;
}

.animate-scroll-right {
  animation: scroll-right 180s linear infinite;
}
</style>
