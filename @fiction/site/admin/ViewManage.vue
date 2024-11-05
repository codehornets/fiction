<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionSites } from '../index.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionSites, fictionRouter } = useService<{ fictionSites: FictionSites }>()

async function load() {
  loading.value = true

  try {
    //
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
    :panel-props="{ }"
    base-path="/sites"
    :header="{
      title: 'Sites and Landing Pages',
      subTitle: 'Create and manage one or more sites. Each site can have its own theme, content, and settings.',
      media: { class: `i-tabler-browser` },
      actions: [],
    }"
  />
</template>
