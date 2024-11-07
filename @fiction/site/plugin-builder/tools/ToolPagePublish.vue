<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { FictionApp } from '@fiction/core'
import type { Site } from '../../site'
import type { TableSiteConfig } from '../../tables'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModalConfirm from '@fiction/ui/ElModalConfirm.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { t } from '../../tables'
import { activeSiteHostname, saveSite } from '../../utils/site'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  saveText: { type: String, default: 'Save' },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

const { fictionAppSites } = useService<{ fictionAppSites: FictionApp }>()
const loading = vue.ref(false)

function getSuffixUrl() {
  return new URL(fictionAppSites.liveUrl.value).hostname.split('.').slice(-2).join('.')
}
const options: InputOption[] = [
  new InputOption({
    key: 'editor.hidePublishing',
    label: 'Site Address',
    description: 'Configure where visitors can find your site',
    input: 'group',
    options: [
      new InputOption({
        key: 'subDomain',
        label: 'Free Fiction Domain',
        subLabel: 'Your site\'s included web address',
        description: 'Choose a unique name for your free Fiction-hosted domain. This will be your site\'s default address.',
        input: 'InputUsername',
        isRequired: true,

        props: {
          beforeInput: 'https://',
          afterInput: getSuffixUrl(),
          table: t.sites,
          columns: [{ name: 'subDomain' }],
          uiSize: 'lg',
        },
      }),
      new InputOption({
        key: 'customDomains',
        label: 'Custom Domain',
        subLabel: 'Use your own domain name',
        description: 'Connect your own domain name to your site. You\'ll need to update your DNS settings with your domain provider.',
        input: vue.defineAsyncComponent(() => import('../InputCustomDomains.vue')),
        isRequired: true,

        props: {
          destination: activeSiteHostname(props.site, { isProd: true }).value,
          uiSize: 'lg',
        },
      }),
    ],
  }),

]

const tempSite = vue.ref<Partial<TableSiteConfig>>({})

const v = vue.computed({
  get: () => ({ ...props.site.toConfig(), ...props.site.editor.value.tempSite }),
  set: v => (props.site.editor.value.tempSite = v),
})

async function save() {
  loading.value = true
  await saveSite({ site: props.site, delayUntilSaveConfig: props.site.editor.value.tempSite, successMessage: 'Published Successfully', isPublishingDomains: true })
  props.site.editor.value.tempSite = {}
  loading.value = false
}

function reset() {
  tempSite.value = {}
}
const showConfirm = vue.ref(false)
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm @submit="showConfirm = true">
      <FormEngine v-model="v" state-key="publish" :options :input-props="{ site }" />

      <div class="text-right px-4 py-2 border-t border-theme-200 dark:border-theme-600 pt-4 space-x-4 flex justify-between">
        <XButton rounding="full" theme="default" title="Discard all domain changes" @click="reset()">
          Discard Changes
        </XButton>
        <XButton
          :loading="loading"
          type="submit"
          theme="primary"
          rounding="full"
          :disabled="Object.keys(props.site.editor.value.tempSite).length === 0"
          :title="Object.keys(props.site.editor.value.tempSite).length === 0
            ? 'No pending domain changes'
            : 'Apply domain changes'"
        >
          {{ loading ? 'Updating Domains...' : 'Update Site Address' }}
        </XButton>
      </div>
    </ElForm>
    <ElModalConfirm
      v-model:vis="showConfirm"
      title="Confirm Domain Changes"
      sub="Your site's web address will change immediately after you confirm. If you're using a custom domain, make sure you've updated your DNS settings with your domain provider first to avoid any disruption.

If you proceed:
- Your site will be accessible at the new address immediately
- The old address will no longer work
- You may need to clear your browser cache to see the changes

Are you ready to update your site's address?"
      confirm-text="Yes, Update Address"
      cancel-text="Not Yet"
      @confirmed="save()"
    />
  </ElTool>
</template>
