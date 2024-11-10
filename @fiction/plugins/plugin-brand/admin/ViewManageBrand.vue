<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionBrand, fictionRouter } = useService<{ fictionBrand: FictionBrand }>()

const brand = vue.shallowRef<TableBrand>()

async function load() {
  loading.value = true

  const brandId = fictionRouter.query.value.brandId as string | undefined

  try {
    const endpoint = fictionBrand.requests.ManageBrandGuide

    const r = await endpoint.projectRequest({ _action: 'retrieve', where: { brandId } })

    if (!r.data || !r.data.length)
      throw new Error('No campaign found')

    brand.value = r.data[0]
  }
  catch (error) {
    console.error('Error loading', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())
</script>

<template>
  <SettingsBoard
    :loading
    :card
    :panel-props="{ brand }"
    :header="{
      title: 'Manage Brand',
      subTitle: 'Manage your brand strategy and style. It will be used along with AI to keep your brand consistent.',
      media: { class: `i-tabler-briefcase` },
      actions: [],
    }"
    :nav-actions="[
      {
        name: 'All Brands',
        theme: 'default',
        size: 'sm',
        href: card.link('/brand'),
        icon: 'i-tabler-arrow-left',
      },
    ]"
  />
</template>
