<script lang="ts" setup>
import type { ActionButton, FictionApp, IndexMeta, NavListItem } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { Site } from '../site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { getSiteIndexItemList } from '../utils/list.js'
import { manageSiteIndex } from '../utils/manage.js'
import ElSiteStart from './ElSiteStart.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSites, fictionRouter } = useService<{ fictionSites: FictionSites, fictionAppSites: FictionApp }>()

const showCreateModal = vue.ref(false)

const loading = vue.ref(false)
const sites = vue.shallowRef<Site[]>([])
const indexMeta = vue.ref<IndexMeta>()
async function loadIndex() {
  loading.value = true
  const r = await manageSiteIndex({ fictionSites, params: { _action: 'list', limit: 10 } })
  sites.value = r.sites || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadIndex()

  vue.watchEffect(() => {
    if (fictionRouter.query.value.addNew) {
      showCreateModal.value = true
      fictionRouter.query.value = { }
    }
  })
})

const list = vue.computed<NavListItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})

function getActions(location: 'top' | 'zero') {
  const buttons: ActionButton[] = [{
    testId: 'createSite',
    label: 'Create New Site',
    icon: 'i-tabler-plus',
    theme: 'primary',
    onClick: () => (showCreateModal.value = true),
  }]
  return location === 'zero' || list.value.length > 0 ? { buttons } : {}
}
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-6">
      <ElIndexGrid
        :loading
        :list
        list-title="Sites"
        :index-meta="{}"
        :edit-actions="[]"
        :empty="{
          label: 'Create Your First Site',
          description: `The homebase for your online presence.`,
          action: getActions('zero'),
          icon: { class: 'i-tabler-browser-plus' },
        }"
        :action="getActions('top')"
        :on-item-click="() => {}"
        @bulk-edit="() => {}"
      />
    </div>

    <ElSiteStart v-model:vis="showCreateModal" :card />
  </SettingsPanel>
</template>
