<script lang="ts" setup>
import { type StandardSize, vue } from '@fiction/core'
import XNumber from '@fiction/ui/common/XNumber.vue'
import { createStockMediaHandler } from '@fiction/ui/stock'

const {
  count = 10000,
  thumbCount = 3,
  text = 'Join the community',
  size = 'md',
} = defineProps<{
  count?: number
  thumbCount?: number
  text?: string
  size?: StandardSize
}>()

const stock = vue.shallowRef<Awaited<ReturnType<typeof createStockMediaHandler>>>()
vue.onMounted(async () => {
  stock.value = await createStockMediaHandler()
})

const sizeClass = vue.computed(() => {
  const sizes = {
    'xxs': 'h-2',
    'xs': 'h-3',
    'sm': 'h-4',
    'md': 'h-6',
    'lg': 'h-8',
    'xl': 'h-10',
    '2xl': 'h-12',
  }

  return sizes[size] || sizes.md
})
</script>

<template>
  <div v-if="stock" class="flex items-center gap-4">
    <div class="flex">
      <div
        v-for="i in thumbCount"
        :key="i"
        class="rounded-full ring-4 ring-white dark:ring-theme-800 aspect-square -ml-2 first:ml-0 bg-theme-100 overflow-hidden"
        :class="sizeClass"
      >
        <img
          :src="stock.getRandomByTags(['aspect:square', 'headshot']).url"
          alt="Member"
          class="w-full h-full object-cover"
        >
      </div>
      <XNumber
        class="font-sans rounded-full bg-theme-500 dark:bg-theme-600 text-white ring-4 ring-white dark:ring-theme-800 -ml-2 flex items-center justify-center font-medium aspect-square px-2.5"
        :class="size === 'sm' ? 'h-4' : size === 'lg' ? 'h-8' : 'h-8'"
        :model-value="count"
        suffix="+"
        format="abbreviated"
        :animate="true"
      />
    </div>
    <div class="font-sans text-sm dark:text-theme-300 text-theme-500">
      {{ text }}
    </div>
  </div>
</template>
