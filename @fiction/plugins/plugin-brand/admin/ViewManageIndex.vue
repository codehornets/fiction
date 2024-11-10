<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionBrand } from '../index.js'
import type { TableBrand } from '../schema.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionBrand, fictionEnv } = useService<{ fictionBrand: FictionBrand }>()

const brandIndex = vue.shallowRef<TableBrand[]>([])

async function load() {
  loading.value = true

  try {
    const response = await fictionBrand.requests.ManageBrandGuide.projectRequest({ _action: 'list' })

    if (response.status === 'success' && response.data) {
      brandIndex.value = response.data
    }
    else {
      fictionEnv.events.emit('notify', {
        type: 'error',
        message: 'Failed to load brand index',
      })
    }
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
    :panel-props="{ brandIndex }"
    :header="{
      title: 'Brand Intelligence Hub',
      subTitle: 'Create smart brand guidelines that power AI-assisted content creation',
      media: { class: 'i-tabler-briefcase' },
      actions: [],
    }"
  />
</template>
