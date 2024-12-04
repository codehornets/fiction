<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { vue } from '@fiction/core'
import ConfettiEffect from '@fiction/ui/effect/EffectConfetti.vue'
import ElModal from '@fiction/ui/ElModal.vue'

const { withConfetti = true, vis, confirmText = { title: 'Congratulations!', content: 'Check your email to confirm.' } } = defineProps<{
  card: Card
  vis: boolean
  withConfetti?: boolean
  confirmText?: { title: string, content: string }
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const showConfetti = vue.ref(false)

vue.watch(() => vis, (v) => {
  if (withConfetti) {
    if (v) {
      showConfetti.value = true
    }

    // Reset confetti after animation
    setTimeout(() => {
      showConfetti.value = false
    }, 3000)
  }
})
</script>

<template>
  <div>
    <ConfettiEffect :active="showConfetti" />

    <!-- Confirmation Modal -->
    <ElModal
      :vis="vis"
      modal-class="max-w-lg p-8"
      :has-close="true"
      @update:vis="emit('update:vis', $event)"
    >
      <div class="text-center p-6">
        <h2 class="text-2xl font-medium mb-4 x-font-title">
          {{ confirmText.title }}
        </h2>
        <div class="text-xl text-theme-500 dark:text-theme-500">
          {{ confirmText.content }}
        </div>
      </div>
    </ElModal>
  </div>
</template>
