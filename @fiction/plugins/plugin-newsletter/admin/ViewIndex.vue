<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { EmailCampaign } from '../campaign.js'
import type { FictionNewsletter } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { manageEmailCampaign } from '../utils.js'
import ElStart from './ElStart.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionNewsletter, fictionRouter } = useService<{ fictionNewsletter: FictionNewsletter }>()

const campaigns = vue.shallowRef<EmailCampaign[]>([])

type NavListItemCampaign = NavListItem & EmailCampaignConfig

const list = vue.computed<NavListItemCampaign[]>(() => {
  return campaigns.value.map((campaign) => {
    const p = campaign.post.value
    return {
      ...campaign.toConfig(),
      key: campaign.campaignId,
      label: campaign.title.value || p.title.value || 'Untitled',
      description: p.subTitle.value || 'No description',
      href: props.card.link(`/manage-newsletter?campaignId=${campaign.campaignId}`),
      media: p.media.value,
      icon: 'i-tabler-mail',
    } as NavListItemCampaign
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  console.warn('load index', fictionNewsletter.cacheKey.value)
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  campaigns.value = await manageEmailCampaign({ params: createParams, fictionNewsletter })
  loading.value = false
}
const showStartModal = vue.ref(false)

vue.onMounted(async () => {
  vue.watch(() => fictionNewsletter.cacheKey.value, load, { immediate: true })

  vue.watchEffect(() => {
    if (fictionRouter.query.value.addEmail) {
      showStartModal.value = true
      fictionRouter.query.value = { }
    }
  })
})
</script>

<template>
  <SettingsPanel :title="card.title.value">
    <div class="p-6">
      <ElIndexGrid
        media-icon="i-tabler-mail"
        list-title="Email Campaigns"
        :list="list"
        :loading="loading"
        :actions="{
          buttons: [
            {
              testId: 'new-campaign-button-index',
              label: 'Create Campaign',
              icon: 'i-tabler-plus',
              theme: 'primary',
              onClick: () => { showStartModal = true },
            },
          ],
        }"
      >
        <template #zero>
          <ElZeroBanner
            data-test-id="campaign-zero"
            title="Email Your Audience"
            description="Create engaging email campaigns to connect with your audience. Design, schedule, and track performance all in one place."
            icon="i-tabler-mail-share"
            :action="{
              buttons: [
                {
                  testId: 'new-campaign-button-zero',
                  label: 'Create First Campaign',
                  onClick: () => { showStartModal = true },
                  theme: 'primary',
                  icon: 'i-heroicons-plus',
                },
              ],
            }"
          />
        </template>
      </ElIndexGrid>
      <ElStart v-model:vis="showStartModal" :card />
    </div>
  </SettingsPanel>
</template>
