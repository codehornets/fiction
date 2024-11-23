<script lang="ts" setup>
import type { NavItem, NavListItem } from '@fiction/core'
import { onResetUi, shortId, vue } from '@fiction/core'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { animateItemEnter, useElementVisible } from './anim'
import ElClose from './common/ElClose.vue'
import NavMobileItem from './NavMobileItem.vue'

defineOptions({
  name: 'NavMobile',
})

const props = defineProps<{
  vis: boolean
  nav: Record<string, NavListItem[]>
}>()

const emit = defineEmits(['update:vis'])

const randomId = shortId()
const afterVisible = vue.ref(false)
const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function close(): void {
  emit('update:vis', false)
}

onResetUi(() => close())

vue.onMounted(() => {
  const el = document.querySelector('.x-site-content') as HTMLElement | null

  vue.watch(
    () => props.vis,
    (vis) => {
      if (!el)
        return

      if (vis) {
        el.style.transform = 'translateX(-300px)'
        el.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
        el.style.height = '100dvh'
        el.style.overflow = 'hidden'
        setTimeout(() => (afterVisible.value = true), 300)
      }
      else {
        afterVisible.value = false
        el.style.transform = ''
        el.style.height = ''
        el.style.overflow = ''
      }
    },
    { immediate: true },
  )

  useElementVisible({
    caller: 'navMobile',
    selector: `#${randomId}`,
    onVisible: async () => {
      await animateItemEnter({
        targets: `#${randomId} .x-action-item`,
        themeId: 'rise',
      })
    },
  })
})
</script>

<template>
  <teleport to=".x-site">
    <div
      v-if="vis"
      class="dark z-0 fixed h-[100dvh] top-0 right-0 w-full bg-gradient-to-br from-theme-800 to-theme-950 text-theme-0"
      @click.stop
    >
      <div :id="randomId" class="w-[265px] h-full float-right">
        <ElClose class="absolute right-4 top-4 z-20" @click="close" />

        <div class="pl-6 h-full py-20 flex flex-col justify-start gap-4 relative z-10 overflow-y-scroll">
          <div v-for="(items, section) in nav" :key="section" class="flex flex-col justify-center">
            <div
              class="flex flex-col gap-6"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <NavMobileItem
                v-for="(item, index) in items"
                :key="index"
                :item="item"
                :depth="0"
              />
            </div>
          </div>
          <slot name="foot" />
        </div>
      </div>
    </div>
  </teleport>
</template>
