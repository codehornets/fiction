<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElStart from './ElStart.vue'

const { card } = defineProps<{ card: Card }>()

const { fictionBrand, fictionRouter } = useService<{ fictionBrand: FictionBrand }>()

const brands = vue.shallowRef<TableBrand[]>([])
const loading = vue.ref(false)

const list = vue.computed<IndexItem[]>(() => {
  return brands.value.map((brand) => {
    return {
      key: brand.brandId,
      name: brand.title || 'Untitled',
      desc: brand.description || 'No description',
      href: card.link(`/manage-brand?brandId=${brand.brandId}`),
      icon: 'i-tabler-icons',
    } as IndexItem
  })
})

async function load() {
  loading.value = true
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  brands.value = []
  loading.value = false
}

const showStartModal = vue.ref(false)

vue.onMounted(() => load())
</script>

<template>
  <div class="p-12 w-full max-w-screen-md mx-auto">
    <ElIndexGrid
      media-icon="i-tabler-mail"
      list-title="Newsletter Emails"
      :list="list"
      :loading
      :actions="[{
        testId: 'new-email-button-index',
        name: 'New Email',
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
          title="Brands"
          description="Create brand guides and models to help create content."
          icon="i-tabler-icons"
          :actions="[{
            testId: 'new-brand-button-zero',
            name: 'New Brand',
            onClick: () => { showStartModal = true },
            theme: 'primary',
            icon: 'i-tabler-icons',
          }]"
        />
      </template>
    </ElIndexGrid>
    <ElStart v-model:vis="showStartModal" :card />
  </div>
</template>
