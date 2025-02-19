<script setup lang="ts" generic="T">
import type { PackeryOptions, Packery as PackeryType } from 'packery'
import { vue, waitFor } from '@fiction/core'

defineOptions({ name: 'EffectMasonry' })

const props = defineProps<{
  items: T[]
  options?: EffectOptions
  gap?: string
}>()

type EffectOptions = Partial<Omit<PackeryOptions, 'gutter'>> & {
  resize?: boolean
  initLayout?: boolean
  defaultCols?: number
  gutter?: string | number
}

const isLoading = vue.ref(false)
const containerRef = vue.ref<HTMLElement | null>(null)
let pckry: PackeryType | null = null

async function initPackery() {
  if (typeof window === 'undefined')
    return

  isLoading.value = true
  const PackeryModule = await import('packery')
  const Packery = PackeryModule.default || PackeryModule
  const { default: imagesLoaded } = await import('imagesloaded')

  if (pckry) {
    pckry.destroy()
  }

  if (containerRef.value) {
    const defaultOptions: EffectOptions = {
      itemSelector: '.masonry-grid-item',
      gutter: 40,
      percentPosition: true,
      transitionDuration: '0.4s',
      resize: true,
      initLayout: true,
    }

    pckry = new (Packery as any)(containerRef.value, { ...defaultOptions, ...props.options })

    if (props.options?.initLayout !== false) {
      imagesLoaded(containerRef.value).on('progress', () => {
        pckry?.layout()
      })
    }
  }

  isLoading.value = false
}

vue.onMounted(async () => {
  await waitFor(200) // Allow time for initial rendering

  vue.watch(() => props.items.length, () => {
    vue.nextTick(async () => {
      await initPackery()
    })
  }, { immediate: true })
})

vue.onBeforeUnmount(() => {
  if (pckry) {
    pckry.destroy()
  }
})

// Expose Packery instance to parent component if needed
defineExpose({ packery: pckry })
</script>

<template>
  <div>
    <div ref="containerRef" class="masonry-grid clear-both w-full transition-opacity" :class="isLoading ? 'opacity-0' : 'opacity-100'">
      <slot />
    </div>
  </div>
</template>
