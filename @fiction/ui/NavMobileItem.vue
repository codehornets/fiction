<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import { getNavComponentType, vue } from '@fiction/core'
import TransitionSlide from './anim/TransitionSlide.vue'

const { item, depth = 0 } = defineProps<{
  item: NavListItem
  depth?: number
  isExpanded?: boolean
}>()

const isOpen = vue.ref(item.list?.items && item.list?.items.some(i => i.isActive))
const hasDropDown = vue.computed(() =>
  depth > 0 && item.list?.items?.length,
)

function handleClick(event: MouseEvent) {
  if (item.list?.items && hasDropDown.value) {
    event.preventDefault()
    isOpen.value = !isOpen.value
  }
  item.onClick?.({ event })
}

function getItemClass(depth = 0) {
  const baseClass = 'x-action-item font-sans pr-8 relative group flex gap-x-2 items-center justify-between hover:opacity-80 transition-opacity duration-200 cursor-pointer'
  const depthClass = {
    0: 'text-xl font-normal',
    1: 'text-xl font-normal text-theme-600 dark:text-theme-300 pl-4 py-1',
    2: 'text-base font-normal pl-8 py-1',
  }[depth]

  return `${baseClass} ${depthClass}`
}
</script>

<template>
  <div>
    <component
      :is="getNavComponentType(item)"
      :to="item.href"
      :href="item.href"
      role="menuitem"
      :class="getItemClass(depth)"
      :data-is-active="item.isActive"
      @click="handleClick"
    >
      <span class="relative group flex gap-x-2 items-center justify-between w-full">
        <span v-if="item.isActive" class="absolute -left-4 w-1.5 h-1.5 rounded-full bg-primary-500/60" />
        <span>
          <span v-if="item.icon" :class="item.icon" />
          <span v-html="item.label" />
        </span>
        <span
          v-if="item.href || (item.list?.items && hasDropDown)"
          class="transition-all bg-primary-500 dark:bg-primary-400 rounded-full"
          :class="[
            hasDropDown && isOpen ? 'rotate-180' : '',
            item.href?.includes('http')
              ? 'i-tabler-arrow-up-right text-primary-400/50 dark:text-primary-500/50'
              : item.list?.items && hasDropDown
                ? 'i-tabler-chevron-down'
                : '',
          ]"
        />
      </span>
    </component>

    <TransitionSlide>
      <div
        v-if="item.list?.items"
        v-show="isOpen || !hasDropDown"
      >
        <div :class="depth <= 0 ? 'py-4' : 'py-3'">
          <div v-for="(subItem, index) in item.list?.items" :key="index">
            <NavMobileItem
              :item="subItem"
              :depth="(depth || 0) + 1"
              :is-expanded="isOpen"
            />
          </div>
        </div>
      </div>
    </TransitionSlide>
  </div>
</template>
