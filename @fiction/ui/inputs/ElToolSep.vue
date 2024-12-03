<script lang="ts" setup>
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="relative flex justify-start">
      <span
        class=" text-xs text-theme-300 dark:text-theme-500"
      >{{ text }}</span>
    </div>
    <div
      class="h-[1px] grow bg-theme-200 dark:bg-theme-700"
    />
  </div>
</template>
