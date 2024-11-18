<script lang="ts" setup>
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElEmail from '@fiction/ui/inputs/InputEmail.vue'
import ConfirmModal from './ConfirmModal.vue'

const { card, confirmText, actionText } = defineProps<{
  card: Card<UserConfig>
  animate?: boolean
  confirmText?: { title: string, content: string }
  actionText?: string
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
    if (!email.value) {
      throw new Error('Email is required')
    }

    if (!orgId.value) {
      throw new Error('Organization is required')
    }

    const queryVars = { orgId: orgId.value }

    const r = await service.fictionSubscribe.transactions.subscribe.requestSend({ to: email.value, queryVars })

    if (r?.status === 'error') {
      throw new Error(r.message || 'An error occurred')
    }
    else if (r?.status === 'success') {
      const message = 'Successfully Subscribed'
      const more = 'Check your email to confirm.'
      service.fictionEnv.events.emit('notify', { type: 'success', message, more })
      emit('update:subscribed', email.value)
      showConfirmModal.value = true
    }
  }
  catch (e) {
    service.fictionEnv.events.emit('notify', { type: 'error', message: (e as Error).message })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="@container">
    <ElForm class="flex gap-4 flex-col md:flex-row md:flex-wrap" @submit="createSubscription()">
      <ElEmail
        v-model="email"
        data-test-id="email"
        input-class="bg-theme-50 dark:bg-theme-800/30 dark:ring-primary-500/70 ring-2 md:basis-[300px] md:grow"
        ui-size="2xl"
      />
      <XButton
        data-test-id="submit"
        theme="primary"
        class="shrink-0"
        type="submit"
        rounding="md"
        :loading="loading"
        size="2xl"
        hover="pop"
      >
        {{ actionText || 'Become a Subscriber' }}
      </XButton>
      <ConfirmModal :card :vis="showConfirmModal" :confirm-text="confirmText" @update:vis="showConfirmModal = false" />
    </ElForm>
  </div>
</template>
