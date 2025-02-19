<script lang="ts" setup>
import type { ActionSubscribe, ColorThemeUser, StandardSize } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElEmail from '@fiction/ui/inputs/InputEmail.vue'
import ConfirmModal from './CardActionAreaConfirmModal.vue'

const { card, subscribe = {}, size = 'lg', enableConfirmModal = true } = defineProps<{
  card: Card
  animate?: boolean
  subscribe: ActionSubscribe
  size?: StandardSize
  theme?: ColorThemeUser
  enableConfirmModal?: boolean
}>()

const emit = defineEmits<{
  (event: 'update:subscribed', payload: string): void
}>()

const service = useService<{ fictionSubscribe: FictionSubscribe }>()
const orgId = vue.computed(() => card.site?.settings.orgId)
const loading = vue.ref(false)
const showConfirmModal = vue.ref(false)
const email = vue.ref('')

async function createSubscription() {
  loading.value = true

  try {
    if (!email.value)
      throw new Error('Email is required')

    if (!orgId.value)
      throw new Error('Organization is required')

    const queryVars = { orgId: orgId.value }
    const r = await service.fictionSubscribe.transactions.subscribe.requestSend({
      to: email.value,
      queryVars,
    })

    if (r?.status === 'error')
      throw new Error(r.message || 'An error occurred')

    if (r?.status === 'success') {
      service.fictionEnv.events.emit('notify', {
        type: 'success',
        message: 'Successfully Subscribed',
        more: 'Check your email to confirm.',
      })
      emit('update:subscribed', email.value)
      showConfirmModal.value = true
    }
  }
  catch (e) {
    service.fictionEnv.events.emit('notify', {
      type: 'error',
      message: (e as Error).message,
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="@container">
    <ElForm
      class="flex flex-col gap-5 sm:flex-row sm:flex-wrap"
      @submit="createSubscription()"
    >
      <ElEmail
        v-model="email"
        data-test-id="email"
        :ui-size="size"
        :input-class="[
          'bg-theme-50',
          'dark:bg-theme-700/30',
          'dark:ring-primary-500/70',
          'ring-1',
          'w-full',
          'sm:basis-80',
          'min-w-72',
          'max-w-2xl',
          'grow',
          'sm:flex-1',
        ].join(' ')"
        :placeholder="subscribe.input?.placeholder || 'Enter your email...'"
      />
      <XButton
        data-test-id="submit"
        theme="primary"
        type="submit"
        rounding="md"
        :loading="loading"
        :size="size"
        hover="pop"
        class="shrink-0 w-full sm:w-auto"
      >
        {{ subscribe.button?.label || 'Subscribe' }}
      </XButton>
    </ElForm>
    <ConfirmModal
      v-if="enableConfirmModal"
      :card="card"
      :vis="showConfirmModal"
      :confirm-text="{
        title: subscribe.success?.title || 'Congratulations!',
        content: subscribe.success?.content || 'Check your email to confirm.',
      }"
      @update:vis="showConfirmModal = false"
    />
  </div>
</template>
