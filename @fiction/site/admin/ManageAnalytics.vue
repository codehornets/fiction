<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'

const { card } = defineProps<{ card: Card }>()
</script>

<template>
  <SettingsPanel title="Newsletter Analytics">
    <div class="p-12 text-center text-sm text-theme-400 dark:text-theme-500">
      Analytics Coming Soon
    </div>
  </SettingsPanel>
</template>
