<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElStart from './ElStart.vue'

const { card, brandIndex } = defineProps<{ card: Card, brandIndex: TableBrand[] }>()

useService<{ fictionBrand: FictionBrand }>()

const loading = vue.ref(false)

const list = vue.computed<NavListItem[]>(() => {
  return brandIndex.map((brand) => {
    return {
      key: brand.brandId,
      label: brand.title || 'Untitled',
      description: brand.description || 'No description',
      href: card.link(`/manage-brand?brandId=${brand.brandId}`),
      icon: 'i-tabler-briefcase',
    } as NavListItem
  })
})

const showStartModal = vue.ref(false)
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-6">
      <ElIndexGrid
        media-icon="i-tabler-mail"
        list-title="Brand Guidelines"
        :list
        :loading
        :action="{
          buttons: [{
            testId: 'new-brand-button',
            label: 'Create Brand Guidelines',
            icon: 'i-tabler-plus',
            theme: 'primary',
            onClick: () => { showStartModal = true },
          }] }"
      >
        <template #zero>
          <ElZeroBanner
            test-id="brand-zero"
            title="Create Your First Brand Guidelines"
            description="Define your brand's voice, style, and content rules to power AI-assisted content creation."
            icon="i-tabler-briefcase"
            :action="{
              buttons: [{
                testId: 'new-brand-button-zero',
                label: 'Get Started',
                onClick: () => { showStartModal = true },
                theme: 'primary',
                icon: 'i-tabler-wand',
              }] }"
          />
        </template>
      </ElIndexGrid>
    </div>
    <ElStart v-model:vis="showStartModal" :card />
  </SettingsPanel>
</template>
