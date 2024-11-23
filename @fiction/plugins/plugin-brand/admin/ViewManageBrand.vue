<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)
const requesting = vue.ref<'save' | ''>('')

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

async function saveBrand() {
  requesting.value = 'save'
  const endpoint = fictionBrand.requests.ManageBrandGuide
  const brandId = brand.value?.brandId
  if (!brandId)
    return

  await endpoint.projectRequest({ _action: 'update', fields: brand.value || {}, where: { brandId } })

  requesting.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => saveBrand(),
})

function updateBrand(brandNew: TableBrand) {
  brand.value = { ...brand.value, ...brandNew }

  saveUtil.autosave()
}
</script>

<template>
  <SettingsBoard
    :loading
    :card
    :panel-props="{ brand, saveUtil }"
    :panel-events="{ 'update:brand': (v) => updateBrand(v) }"
    :header="{
      title: 'Manage Brand',
      subTitle: 'Manage your brand strategy and style. It will be used to keep your brand consistent and goal-focused.',
      media: { class: `i-tabler-briefcase` },
      actions: [],
    }"
    :nav-actions="[
      {
        label: 'Brand Library',
        theme: 'default',
        size: 'sm',
        href: card.link('/brand'),
        icon: 'i-tabler-arrow-left',
      },
    ]"
  />
</template>
