<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign'
import InputEmailPreview from './InputEmailPreview.vue'

const { card, campaign } = defineProps<{ card: Card, campaign?: EmailCampaign }>()
</script>

<template>
  <div>
    <InputEmailPreview :card :model-value="campaign?.toConfig()" />
  </div>
</template>
