<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import ElOrgList from './ElOrgList.vue'
import SettingsPanel from './SettingsPanel.vue'

defineOptions({ name: 'PanelTeam' })

const { card } = defineProps<{ card: Card }>()

const service = useService()

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

const header = vue.computed(() => {
  return {
    title: 'Your Organizations',
    subTitle: `Change active organization, add, or remove organizations`,
    media: {
      class: 'i-tabler-building-plus',
    },
  }
})
</script>

<template>
  <SettingsPanel title="Your Organizations" :header>
    <div class="p-6">
      <ElOrgList :card />
    </div>
  </SettingsPanel>
</template>
