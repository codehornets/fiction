<script lang="ts" setup>
import { vue } from '@fiction/core'
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
  size?: 'sm' | 'md' | 'lg'
}>()

// Base size mapped to Tailwind classes
const sizeClass = {
  sm: 'h-3 text-sm',
  md: 'h-4 text-base',
  lg: 'h-6 text-lg',
}[size]

const stock = vue.shallowRef<Awaited<ReturnType<typeof createStockMediaHandler>>>()
vue.onMounted(async () => {
  stock.value = await createStockMediaHandler()
})
</script>

<template>
  <div v-if="stock" class="flex items-center gap-4" :class="[sizeClass]">
    <div class="flex">
      <div
        v-for="i in thumbCount"
        :key="i"
        class="rounded-full ring-4 ring-white dark:ring-theme-800 aspect-square -ml-2 first:ml-0 bg-theme-100 overflow-hidden"
        :class="size === 'sm' ? 'h-4' : size === 'lg' ? 'h-8' : 'h-8'"
      >
        <img
          :src="stock.getRandomByTags(['people', 'aspect:square']).url"
          alt="Member"
          class="w-full h-full object-cover"
        >
      </div>
      <XNumber
        class="font-sans rounded-full bg-theme-500 dark:bg-theme-700 text-white ring-4 ring-white dark:ring-theme-800 -ml-2 flex items-center justify-center font-medium aspect-square px-2"
        :class="size === 'sm' ? 'h-4' : size === 'lg' ? 'h-8' : 'h-8'"
        :model-value="count"
        prefix="+"
        format="abbreviated"
        :animate="true"
      />
    </div>
    <div class="font-medium font-sans text-sm dark:text-theme-400 text-theme-500">
      {{ text }}
    </div>
  </div>
</template>
