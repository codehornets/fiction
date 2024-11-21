<script lang="ts" setup>
import type { ActionButton, vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'

const {
  superHeading,
  heading,
  subHeading,
  actions = [{ name: 'Go Home', icon: 'i-tabler-home', href: '/', theme: 'primary' }],
} = defineProps<{
  superHeading: string | undefined
  heading: string | undefined
  subHeading: string | undefined
  actions: ActionButton[] | undefined
}>()
</script>

<template>
  <div class="grid place-items-center px-6 py-24 sm:py-32 lg:px-8 h-[50dvh]">
    <div class="text-center">
      <p class="text-sm font-medium text-theme-400 font-sans">
        {{ superHeading || '404 - Not Found' }}
      </p>
      <h1 class="mt-4 text-3xl font-semibold sm:text-5xl x-font-title">
        {{ heading || 'Page Not Available' }}
      </h1>
      <p class="mt-6 text-base font-sans leading-7 text-theme-600">
        {{ subHeading || `We couldn't find the page you're looking for. ` }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <XButton
          v-for="(item, i) in actions"
          :key="i"
          :href="item.href"
          :theme="item.theme"
          :icon="item.icon"
          @click.stop="item.onClick && item.onClick({ event: $event })"
        >
          {{ item.name }}
        </XButton>
      </div>
    </div>
  </div>
</template>
