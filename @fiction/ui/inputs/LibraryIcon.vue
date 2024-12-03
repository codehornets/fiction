<script lang="ts" setup>
import type { MediaObject, vue } from '@fiction/core'
import type { IconName } from '@fiction/ui/lib/systemIcons'
import { getIconList } from '@fiction/ui/lib/systemIcons'
import XIcon from '../media/XIcon.vue'

defineOptions({ name: 'LibraryIcon' })

defineProps({
  modelValue: { type: Object as vue.PropType<MediaObject>, default: () => ({}) },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: MediaObject): void
}>()

function selectIcon(iconId: IconName) {
  emit('update:modelValue', { iconId, format: 'iconId' })
}
</script>

<template>
  <div class="p-4 grid grid-cols-10 gap-4 max-h-[400px] overflow-scroll">
    <button
      v-for="iconId in getIconList()"
      :key="iconId"
      class="flex flex-col items-center justify-center p-1 rounded hover:bg-theme-100 dark:hover:bg-theme-800 min-w-0 "
      @click="selectIcon(iconId)"
    >
      <XIcon :media="{ format: 'iconId', iconId }" class="size-8" />
      <span class="mt-1 text-[11px] truncate text-theme-500 w-full">{{ iconId }}</span>
    </button>
  </div>
</template>
