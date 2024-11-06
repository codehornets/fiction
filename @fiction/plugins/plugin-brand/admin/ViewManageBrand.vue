<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionBrand } from '../index.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionBrand, fictionRouter } = useService<{ fictionBrand: FictionBrand }>()

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
      superTitle: 'Manage Brand',
      title: 'Brand Title',
      subTitle: 'Manage your brand strategy and style. It will be used along with AI to keep your brand consistent.',
      media: { class: `i-tabler-icons` },
      actions: [],
    }"
  />
</template>
