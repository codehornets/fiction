<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionPosts } from '../index.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const service = useService<{ fictionSites: FictionPosts }>()

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
    :header="{
      title: 'Posts and Content',
      subTitle: 'Easily create and manage posts. Posts can be published, scheduled, or saved as drafts.',
      media: { class: `i-tabler-pin` },
      actions: [],
    }"
  />
</template>
