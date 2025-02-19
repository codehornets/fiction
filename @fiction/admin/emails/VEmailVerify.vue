<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { vue } from '@fiction/core'

type VerifyEmailAction = FictionAdmin['emailActions']['verifyEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<VerifyEmailAction>, required: true },
  queryVars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const form = vue.ref({ email: '', code: '' })

const loading = vue.ref(false)
const response = vue.ref<Awaited<ReturnType<VerifyEmailAction['requestTransaction']>>>()

async function sendRequest() {
  loading.value = true

  const r = await props.action.requestTransaction(form.value)

  response.value = r

  loading.value = false
}

vue.onMounted(async () => {
  form.value = {
    email: props.queryVars.email,
    code: props.queryVars.code,
  }

  await sendRequest()
})
</script>

<template>
  <TransactionWrap
    :loading="loading"
    :super-title="{ text: response?.status }"
    title="Verify Email"
    :sub-title="response?.message"
    :buttons="[
      { label: 'Home', href: card.link('/'), theme: 'default', icon: 'i-tabler-home' },
      { label: 'Support', href: `mailto:hello@fiction.com`, target: '_blank', icon: 'i-tabler-mail' },
    ]"
  />
</template>
