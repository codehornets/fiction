<script lang="ts" setup>
import type { FictionSites } from '../index.js'
import { useService, vue } from '@fiction/core/index.js'
import XButton from '@fiction/ui/buttons/XButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const validationInput = vue.ref<HTMLInputElement>()

const { fictionSites } = useService<{ fictionSites: FictionSites }>()

const themes = vue.computed(() => {
  return fictionSites.themes.value.filter(theme => theme.settings.isPublic)
})

vue.onMounted(() => {
  vue.watch(
    () => props.modelValue,
    (val) => {
      const el = validationInput.value
      el?.setCustomValidity(!val ? 'Please select a theme' : '')
    },
    { immediate: true },
  )
})

function toggleSelected(themeId: string) {
  if (props.modelValue === themeId) {
    emit('update:modelValue', '')
    return
  }

  emit('update:modelValue', themeId)
}
</script>

<template>
  <div class="relative my-12 antialiased">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-12" @click="emit('update:modelValue', '')">
      <div v-for="(theme, i) in themes" :key="i" class="relative space-y-4">
        <div class="mt-4 w-full rounded-b-lg  transition-all origin-bottom flex gap-4 items-center grow justify-between ">
          <div class="">
            <div class="font-bold text-xl">
              {{ theme.title }}
            </div>
            <div class="text-xs text-theme-500 dark:text-theme-400 leading-tight line-clamp-2">
              {{ theme.settings.description }}
            </div>
          </div>
          <div class="flex justify-end items-center gap-1.5">
            <XButton
              theme="default"
              size="sm"
              href="#"
              target="_blank"
            >
              Preview
            </XButton>
            <XButton
              theme="primary"
              :design="modelValue === theme.themeId ? 'outline' : 'solid'"
              size="sm"
              @click.stop.prevent="toggleSelected(theme.themeId)"
            >
              {{ modelValue === theme.themeId ? 'Selected' : 'Select' }}
            </XButton>
          </div>
        </div>
        <div
          class="screen rounded-lg group relative transition-all cursor-pointer select-none dark:ring-offset-theme-900 aspect-[9/16] ring-4 ring-offset-4 border border-theme-200/70 dark:border-theme-600/50"
          :class="modelValue === theme.themeId ? 'ring-primary-500' : 'ring-theme-200/0 dark:ring-theme-700/0 hover:ring-primary-400'"
          :data-test-id="`theme-${theme.themeId}`"
          :data-test-index="i"
          @click.stop="toggleSelected(theme.themeId)"
        >
          <img :src="theme.settings.screenshots?.dark?.desktop" class="pointer-events-none shadow-xl rounded-lg object-cover absolute origin-top-left h-full w-full">
        </div>
      </div>
    </div>
    <!-- For validation -->
    <input
      ref="validationInput"
      class="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 p-0 opacity-0"
      v-bind="$attrs"
      type="text"
      :value="modelValue"
    >
  </div>
</template>
