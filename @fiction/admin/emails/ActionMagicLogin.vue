<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'
import TransactionWrap from '@fiction/cards/page-transaction/TransactionWrap.vue'
import { useService, vue } from '@fiction/core'

type ActionProps = FictionAdmin['emailActions']['magicLoginEmailAction']

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  action: { type: Object as vue.PropType<ActionProps>, required: true },
  queryVars: { type: Object as vue.PropType<Record<string, any>>, required: true },
})

const { fictionUser, fictionRouter } = useService()

const loading = vue.ref(true)

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()

  if (user) {
    await fictionRouter.replace(props.card.link('/'), { caller: 'magic-login' })
  }

  loading.value = false
})

type TProps = InstanceType<typeof TransactionWrap>['$props']
const wrapProps = vue.computed<TProps>(() => {
  const actions = [
    { name: 'Home', href: props.card.link('/'), theme: 'default' as const, icon: 'i-tabler-home' },
  ]
  const success: TProps = {
    superTitle: { text: 'Success!' },
    title: 'You\'re Logged In',
    subTitle: 'You\'re now logged in to your account.',
    icon: 'i-tabler-check',
    actions,
  }

  const error: TProps = {
    superTitle: { text: 'Error!' },
    title: 'Invalid Token',
    subTitle: 'The token you provided is invalid. Please try again.',
    icon: 'i-tabler-x',
    actions,
  }

  return fictionUser.activeUser.value ? success : error
})
</script>

<template>
  <TransactionWrap
    :loading="loading"
    v-bind="wrapProps"
  />
</template>
