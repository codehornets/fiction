<script lang="ts" setup>
import type { Organization } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { NavCardUserConfig } from '../index.js'
import { log, useService, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElAvatarOrg from './ElAvatarOrg.vue'
import ElPanelSettings from './ElPanelSettings.vue'
import UtilDeleteOrg from './UtilDeleteOrg.vue'
import UtilListOrganizations from './UtilListOrganizations.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<NavCardUserConfig>>, required: true },
})

const { fictionUser } = useService()

const form = vue.ref<Partial<Organization>>({})
const defaultConfig = { disableWatermark: false, serverTimeoutMinutes: 20 }
const config = vue.ref<{ serverTimeoutMinutes?: number, disableWatermark?: boolean }>(defaultConfig)

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

const org = vue.computed<Organization | undefined>(() => fictionUser.activeOrganization.value)

async function saveOrganization(): Promise<void> {
  if (!form.value.orgId)
    throw new Error('No organization id')

  const fields = { ...form.value, config: config.value }

  await fictionUser.requests.ManageOrganization.request(
    { _action: 'update', where: { orgId: form.value.orgId }, fields },
    { debug: true },
  )
}

async function send(context: string): Promise<void> {
  sending.value = context

  await saveOrganization()
  sent.value = true
  sending.value = false
}

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized({ caller: 'ViewSettingsOrg' })

  if (org.value) {
    form.value = org.value
    config.value = { ...defaultConfig, ...org.value.config }
  }
  else {
    log.error('SETTINGS', 'no org', { data: { user } })
  }

  vue.watch(
    () => fictionUser.activeOrganization.value,
    (v) => {
      if (v) {
        form.value = v
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class=" ">
    <ElPanelSettings
      title="Your Organizations"
      :actions="[
        { name: 'Create New Organization', href: card.link(`/settings/new-org`) },
      ]"
    >
      <UtilListOrganizations :card />
    </ElPanelSettings>
    <ElPanelSettings
      :title="`Active Organization: ${fictionUser.activeOrganization.value?.orgName}`"
    >
      <div class="space-y-8">
        <div class="flex items-center space-x-4">
          <div>
            <ElAvatarOrg class="h-16 w-16 rounded-xl" />
          </div>
          <div>
            <div class="font-brand text-2xl font-bold">
              {{ fictionUser.activeOrganization.value?.orgName || 'Unnamed Organization' }}
            </div>
            <div class="text-theme-500 font-medium">
              organization email: {{ fictionUser.activeOrganization.value?.orgEmail }} &middot; you are an
              <span class="">{{ fictionUser.activeOrganization.value?.relation?.memberAccess }}</span>
            </div>
          </div>
        </div>
        <ElInput
          v-model="form.orgName"
          input="InputText"
          label="Organization Name"
          required
        />

        <ElInput
          v-model="form.orgEmail"
          input="InputText"
          label="Organization Email"
          sub-label="Used for billing, notifications, avatar"
          placeholder="billing@example.com"
        />

        <ElInput
          v-model="form.slug"
          input="InputText"
          label="Username"
          placeholder="acme-inc"
          sub-label="Used in public profiles, must be unique."
        />
        <div>
          <ElButton
            btn="primary"
            size="sm"
            :loading="sending === 'settings'"
            @click="send('settings')"
          >
            Save Changes
          </ElButton>
        </div>
      </div>
    </ElPanelSettings>
    <ElPanelSettings
      v-if="!fictionUser.activeUser.value?.isSuperAdmin"
      title="Admin Only Settings"
      class="p-4 border border-theme-200/75 dark:border-theme-600 bg-theme-50/50 dark:bg-theme-700 rounded-md m-4"
    >
      <div class="space-y-12">
        <div class="space-y-4">
          <ElInput
            v-model="form.specialPlan"
            label="Special Plan"
            sub-label="Give this organization a special pricing plan"
            input="InputSelect"
            :list="[
              { name: 'none', value: '' },
              { name: 'VIP', value: 'vip' },
            ]"
          />

          <div>
            <ElButton
              btn="primary"
              size="sm"
              :loading="sending === 'admin'"
              @click="send('admin')"
            >
              Save Changes
            </ElButton>
          </div>
        </div>

        <UtilDeleteOrg :card />
      </div>
    </ElPanelSettings>
  </div>
</template>
