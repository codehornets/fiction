<script setup lang="ts" generic="T">
import { vue, waitFor } from '@fiction/core'
import 'flickity/css/flickity.css'

const props = defineProps<{
  options?: Partial<Flickity.Options>
  slides: T[]
  activeIndex: number
}>()

const emit = defineEmits<{
  (e: 'update:activeIndex', index: number): void
}>()

const carouselRef = vue.ref<HTMLElement | null>(null)
let flkty: Flickity | null = null
const loading = vue.ref(true)

async function initFlickity() {
  if (typeof window === 'undefined')
    return

  if (flkty) {
    flkty.destroy()
  }

  const { default: Flickity } = await import('flickity')

  if (carouselRef.value) {
    flkty = new Flickity(carouselRef.value, {
      selectedAttraction: 0.03, // Default is 0.025
      friction: 0.3, // Default is 0.28
      accessibility: false,
      adaptiveHeight: false,

      // groupCells: false,
      initialIndex: props.activeIndex,
      wrapAround: true,
      // autoPlay: false,
      cellAlign: 'center',
      // cellSelector: undefined,
      // contain: true,
      draggable: true,
      dragThreshold: 3,
      // freeScroll: false,
      lazyLoad: true,
      percentPosition: true,
      prevNextButtons: false,
      pageDots: false,
      // resize: true,
      // rightToLeft: false,
      setGallerySize: true,
      // watchCSS: false,
      ...props.options,
    })

    flkty.on('change', (index: number) => {
      emit('update:activeIndex', index)
    })
  }

  await waitFor(200) // attempt better height calculation

  loading.value = false
}

vue.onMounted(async () => {
  await waitFor(300) // attempt better height calculation

  vue.watch(() => props.slides.length, () => {
    vue.nextTick(async () => {
      await initFlickity()
    })
  }, { immediate: true })

  vue.watch(() => props.activeIndex, (newIndex) => {
    if (flkty && flkty.selectedIndex !== newIndex) {
      flkty.select(newIndex)
    }
  })
})

vue.onBeforeUnmount(() => {
  if (flkty) {
    flkty.destroy()
  }
})
</script>

<template>
  <div
    ref="carouselRef"
    class="carousel transition-opacity duration-700"
    :class="loading ? 'opacity-0 min-h-[60vh]' : 'opacity-100'"
  >
    <slot
      v-for="(slide, index) in slides"
      :key="index"
      :slide="slide"
      :index="index"
    />
  </div>
</template>

<style lang="less">
.flickity-viewport {
  transition: height 0.2s;
  overflow: visible !important;
}
</style>
