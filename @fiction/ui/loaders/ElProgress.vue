<script lang="ts" setup>
defineProps({
  percent: { type: [Number, String], default: 0 },
  message: { type: String, required: true },
  status: { type: String, default: undefined },
})
</script>

<template>
  <div class="pt-2 pb-4 text-theme-900 dark:text-theme-0">
    <div class="flex items-center rounded-lg relative">
      <div class="relative ml-2 grow py-2 text-sm font-semibold">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="text-primary-600 shrink-0">
              <svg
                v-if="+percent < 100"
                class="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div v-else class="i-heroicons-check-circle-20-solid text-3xl" />
            </div>
            <span class="inline-block capitalize">
              {{ message }}
            </span>
          </div>
          <div class="text-right">
            <span class="inline-block">
              {{ `${percent}%` }}
            </span>
          </div>
        </div>
        <div class="bg-theme-200 dark:bg-theme-700 flex h-2 overflow-hidden rounded text-sm">
          <div
            :style="{ width: `${percent}%` }"
            class="bg-primary-600  flex flex-col justify-center whitespace-nowrap text-center text-white  shadow-none transition-all"
          />
        </div>
      </div>
    </div>
    <div
      v-if="status"
      class="text-theme-400 dark:text-theme-500 text-center text-[10px] font-semibold  "
    >
      {{ status }}
    </div>
  </div>
</template>
