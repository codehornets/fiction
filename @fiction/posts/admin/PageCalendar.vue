<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-12 w-full max-w-screen-md mx-auto text-center opacity-30">
      Coming Soon
    </div>
  </SettingsPanel>
</template>
