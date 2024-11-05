<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionNewsletter } from '../index.js'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const service = useService<{ fictionNewsletter: FictionNewsletter }>()

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
      title: 'Newsletter',
      subTitle: 'Easily send email updates to your subscribers.',
      media: { class: `i-tabler-mail` },
      actions: [],
    }"
  />
</template>
