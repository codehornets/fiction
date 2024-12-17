<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import { dayjs, useService, vue } from '@fiction/core'
import { getOrgAvatar } from '@fiction/core/plugin-user/utils'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElOrgNewModal from './ElOrgNewModal.vue'

const { card } = defineProps<{
  card: Card
}>()

const service = useService()

const modalVisible = vue.ref(false)

const list = vue.computed<NavListItem[]>(() => {
  const activeOrganizations = service.fictionUser.activeOrganizations.value
  return activeOrganizations.map((org) => {
    const label = org.orgName || 'Untitled'
    const role = org.relation?.memberAccess || 'Unknown'
    const joinedAt = org.relation?.createdAt

    const description = [
      `Role: ${role}`,
      `Joined ${joinedAt ? dayjs(joinedAt).format('MM/YY') : 'unknown'}`,
      `Created ${dayjs(org.createdAt).format('MM/YY')}`,
    ]

    return {
      key: org.orgId,
      label,
      description: description.join(' - '),
      href: card.link(`/settings/manage-organizations?orgId=${org.orgId}`),
      media: getOrgAvatar(org),
    }
  })
})

const indexMeta = vue.ref()
</script>

<template>
  <div>
    <ElIndexGrid
      :list
      :actions="[{
        label: 'Add New Organization',
        theme: 'primary',
        icon: 'i-tabler-building-plus',
        onClick: () => (modalVisible = true),
      }]"
      list-title="Organizations"
      :index-meta="indexMeta"
      :zero="{
        title: 'No Organizations',
        description: 'This user has no organizations.',
        icon: 'i-tabler-building',
      }"
    />
    <ElOrgNewModal :vis="modalVisible" :card @update:vis="modalVisible = $event" />
  </div>
</template>
