<script lang="ts" setup>
defineProps({
  progress: { type: Number, default: undefined },
})
</script>

<template>
  <div class="absolute inset-0 top-0 z-30 h-[3px] w-full">
    <div class="relative h-full w-full overflow-hidden">
      <div
        class="bg-theme-200 dark:bg-theme-500/30 relative inset-0 h-full w-full "
      />
      <div
        class="progress-bar-filled bg-primary-500 dark:bg-primary-900 absolute left-0 top-0 h-full transition-all"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>
