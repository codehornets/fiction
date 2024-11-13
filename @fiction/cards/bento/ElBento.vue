<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { UserConfig } from './index'
import { vue } from '@fiction/core'
import { animateItemEnter } from '@fiction/ui/anim'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const uc = vue.computed(() => props.card.userConfig.value)

// Function to generate grid-area style for each item
function getGridArea(cols: number, rows: number): string {
  return `span ${rows} / span ${cols}`
}

function getContentClasses(args: {
  verticalPosition: 'top' | 'center' | 'bottom'
  horizontalPosition: 'left' | 'center' | 'right'
}): string {
  const { verticalPosition, horizontalPosition } = args
  const baseClasses = 'absolute inset-0 p-6 flex'

  const verticalClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const horizontalClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  return `${baseClasses} ${verticalClasses[verticalPosition]} ${horizontalClasses[horizontalPosition]}`
}

function handleItemClick(href: string | undefined) {
  if (href) {
    props.card.goto(href)
  }
}

vue.onMounted(() => {
  animateItemEnter({
    targets: '.bento-item',
    themeId: 'fade',
    totalTime: 1000,
  })
})
</script>

<template>
  <div
    class="max-w-7xl mx-auto"
    :style="{
      padding: `${uc.containerPadding || 4}px`,
    }"
  >
    <div
      class="grid"
      :style="{
        gap: `${uc.gap || 4}px`,
        gridTemplateColumns: 'repeat(12, 1fr)',
      }"
    >
      <div
        v-for="(item, index) in uc.items"
        :key="index"
        class="bento-item relative overflow-hidden group"
        :class="[item.href ? 'cursor-pointer' : '']"
        :style="{
          gridArea: getGridArea(item.cols, item.rows),
          padding: item.style?.padding ? `${item.style.padding}px` : undefined,
          borderRadius: item.style?.borderRadius ? `${item.style.borderRadius}px` : undefined,
        }"
        @click="handleItemClick(item.href)"
      >
        <!-- Media Background -->
        <XMedia
          :media="item.media"
          class="absolute inset-0"
          :animate="true"
          image-mode="cover"
        />

        <!-- Content Overlay -->
        <div
          class="transition-opacity duration-300"
          :class="[
            getContentClasses(item),
            item.style?.overlay ? 'bg-black/50 opacity-0 group-hover:opacity-100' : '',
          ]"
        >
          <div
            class="max-w-md space-y-3"
            :class="{
              'text-white': item.style?.overlay,
              'bg-black/50 p-4 rounded-xl': ['background', 'slider'].includes(item.contentType) && !item.style?.overlay,
            }"
          >
            <!-- Super Title -->
            <div
              v-if="item.superTitle"
              class="text-sm font-medium uppercase tracking-wide opacity-80"
            >
              {{ item.superTitle }}
            </div>

            <!-- Title -->
            <h3
              v-if="item.title"
              class="text-2xl font-semibold x-font-title"
            >
              {{ item.title }}
            </h3>

            <!-- Subtitle -->
            <div
              v-if="item.subTitle"
              class="text-lg font-medium opacity-90"
            >
              {{ item.subTitle }}
            </div>

            <!-- Content -->
            <p
              v-if="item.content"
              class="line-clamp-3 opacity-80"
            >
              {{ item.content }}
            </p>

            <!-- Tags -->
            <div
              v-if="item.tags?.length"
              class="flex flex-wrap gap-2"
            >
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="text-xs px-2 py-1 bg-black/30 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Actions -->
            <div
              v-if="item.actions?.length"
              class="flex gap-2 pt-2"
              :class="{
                'justify-start': item.horizontalPosition === 'left',
                'justify-center': item.horizontalPosition === 'center',
                'justify-end': item.horizontalPosition === 'right',
              }"
            >
              <XButton
                v-for="(action, actionIndex) in item.actions"
                :key="actionIndex"
                v-bind="action"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
