<script lang="ts" setup>
import type { NavItem } from '@fiction/core'
import { getNavComponentType, onResetUi, shortId, vue } from '@fiction/core/index.js'
import { onBrowserEvent } from '@fiction/core/utils/eventBrowser'
import { animateItemEnter, useElementVisible } from './anim'
import ElClose from './common/ElClose.vue'

defineOptions({
  name: 'NavMobile',
})

const { vis = false, nav = {} } = defineProps<{
  vis: boolean
  nav: Record<string, NavItem[]>
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
    () => vis,
    (vis) => {
      if (!el)
        return

      if (vis) {
        el.style.transform = 'translateX(-300px) '
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
})

vue.onMounted(() => {
  useElementVisible({
    caller: 'navMobile',
    selector: `#${randomId}`,
    onVisible: async () => {
      await animateItemEnter({ targets: `#${randomId} .x-action-item`, themeId: 'rise', config: { } })
    },
  })
})
</script>

<template>
  <teleport to=".x-site">
    <div v-if="vis" class="dark z-0 fixed h-[100dvh] top-0 right-0 w-full bg-gradient-to-br from-theme-800 to-theme-950 text-theme-0" @update:vis="emit('update:vis', $event)" @click.stop>
      <div :id="randomId" class="w-[275px] h-full float-right">
        <ElClose class="absolute   right-4 top-4 z-20" @click="close()" />

        <div class="h-full py-20 flex flex-col justify-start gap-6 relative z-10 overflow-y-scroll">
          <div v-for="(n, i) in nav" :key="i" class="  p-6 flex flex-col justify-center">
            <div
              class="flex flex-col gap-6"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <template v-for="(item, ii) in n" :key="ii">
                <component
                  :is="getNavComponentType(item)"
                  :to="item.href"
                  :href="item.href"
                  role="menuitem"
                  class="x-action-item font-sans text-xl font-normal "
                  @click="item.onClick ? item.onClick($event) : null"
                >
                  <span class="relative group flex gap-x-2 items-center justify-between">
                    <span v-if="item.isActive" class="absolute -left-4 w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                    <span>

                      <span v-if="item.icon" :class="item.icon" />
                      <span v-html="item.name" />
                    </span>
                    <span
                      v-if="item.href"
                      class=" transition-all"
                      :class="item.href.includes('http') ? 'i-tabler-arrow-up-right text-primary-400/50 dark:text-primary-500/50' : 'i-tabler-link text-primary-400/50 dark:text-primary-500/50'"
                    />
                  </span>
                </component>
                <div v-if="item.items" class="space-y-6">
                  <div v-for="(subItem, iii) in item.items" :key="iii" class="flex flex-col gap-2 pl-4">
                    <component
                      :is="getNavComponentType(subItem)"
                      :to="subItem.href"
                      :href="subItem.href"
                      role="menuitem"
                      class="x-action-item font-sans text-xl font-normal text-theme-600 dark:text-theme-300"
                      :class="item.isActive ? 'dark:text-primary-300 text-primary-500' : ' hover:text-theme-100'"
                      @click="subItem.onClick ? subItem.onClick($event) : null"
                    >
                      <span class="relative group flex gap-x-2 items-center justify-between">
                        <span v-if="item.isActive" class="absolute -left-4 w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                        <span>
                          <span v-if="subItem.icon" :class="subItem.icon" />
                          <span v-html="subItem.name" />
                        </span>
                        <span
                          v-if="subItem.href"
                          class="text-theme-400/80  dark:text-theme-500/80 transition-all"
                          :class="subItem.href.includes('http') ? 'i-tabler-arrow-up-right text-primary-400/50 dark:text-primary-500/50' : 'i-tabler-link text-primary-400/50 dark:text-primary-500/50'"
                        />
                      </span>
                    </component>
                    <div v-if="subItem.items" class="space-y-1">
                      <div v-for="(subSubItem, iiii) in subItem.items" :key="iiii" class="pl-4">
                        <component
                          :is="getNavComponentType(subSubItem)"
                          :to="subSubItem.href"
                          :href="subSubItem.href"
                          role="menuitem"
                          class="x-action-item font-sans text-base font-normal  hover:text-theme-100"
                          :class="item.isActive ? 'dark:text-primary-400 text-primary-500' : ' hover:text-theme-100'"
                          @click="subSubItem.onClick ? subSubItem.onClick($event) : null"
                        >
                          <span class="relative group flex gap-x-2 items-center justify-between">
                            <span v-if="item.isActive" class="absolute -left-4 w-1.5 h-1.5 rounded-full bg-primary-500/60" />
                            <span>
                              <span v-if="subSubItem.icon" :class="subSubItem.icon" />
                              <span v-html="subSubItem.name" />
                            </span>
                            <span
                              v-if="subSubItem.href"
                              class="text-theme-400/80  dark:text-theme-500/80 transition-all"
                              :class="subSubItem.href.includes('http') ? 'i-tabler-arrow-up-right text-primary-400/50 dark:text-primary-500/50' : 'i-tabler-link text-primary-400/50 dark:text-primary-500/50'"
                            />
                          </span>
                        </component>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <slot name="foot" />
        </div>
      </div>
    </div>
  </teleport>
</template>
