<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElStart from './ElStart.vue'

const { card, brandIndex } = defineProps<{ card: Card, brandIndex: TableBrand[] }>()

const { fictionBrand, fictionRouter } = useService<{ fictionBrand: FictionBrand }>()

const loading = vue.ref(false)

const list = vue.computed<IndexItem[]>(() => {
  return brandIndex.map((brand) => {
    return {
      key: brand.brandId,
      name: brand.title || 'Untitled',
      desc: brand.description || 'No description',
      href: card.link(`/manage-brand?brandId=${brand.brandId}`),
      icon: 'i-tabler-briefcase',
    } as IndexItem
  })
})

const showStartModal = vue.ref(false)
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-12 w-full max-w-screen-md mx-auto">
      123
      <ElIndexGrid
        media-icon="i-tabler-mail"
        list-title="Brand Guidelines"
        :list="list"
        :loading
        :actions="[{
          testId: 'new-brand-button',
          name: 'Create Brand Guidelines',
          icon: 'i-tabler-plus',
          theme: 'primary',
          onClick: () => { showStartModal = true },
        }]"
      >
        <template #item="{ item }">
          <div class="flex -space-x-0.5">
            <dt class="sr-only">
              Authors
            </dt>
            <dd v-for="(member, ii) in item.authors" :key="ii">
              <ElAvatar class="h-6 w-6 rounded-full bg-theme-50 ring-2 ring-white" :email="member.email" />
            </dd>
          </div>
        </template>
        <template #zero>
          <ElZeroBanner
            test-id="brand-zero"
            title="Create Your First Brand Guidelines"
            description="Define your brand's voice, style, and content rules to power AI-assisted content creation."
            icon="i-tabler-briefcase"
            :actions="[{
              testId: 'new-brand-button-zero',
              name: 'Get Started',
              onClick: () => { showStartModal = true },
              theme: 'primary',
              icon: 'i-tabler-wand',
            }]"
          />
        </template>
      </ElIndexGrid>
    </div>
    <ElStart v-model:vis="showStartModal" :card />
  </SettingsPanel>
</template>
