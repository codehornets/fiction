<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { SiteSchema as schema } from '@fiction/site/schema'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { updateSite } from '../../utils/site'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
  controller: { type: Object as vue.PropType<AdminEditorController<{ toolIds: ToolKeys }>>, required: true },
})

const options: InputOption[] = [
  createOption({
    schema,
    key: 'group.siteGlobal',
    label: 'Site Settings',
    input: 'group',
    icon: { class: 'i-tabler-world' },
    options: [
      createOption({
        schema,
        key: 'siteGlobal',
        label: 'Site',
        input: 'group',
        icon: { class: 'i-tabler-world-latitude' },
        options: [
          createOption({
            schema,
            key: 'title',
            label: 'Site Title',
            subLabel: 'For Reference Only',
            input: 'InputText',
            isRequired: true,
          }),
        ],
      }),
      // Site Identity Group
      createOption({
        schema,
        key: 'group.identity',
        label: 'Identity',
        input: 'group',
        icon: { class: 'i-tabler-favicon' },
        options: [
          createOption({
            schema,
            key: 'userConfig.site.brand.favicon',
            label: 'Browser Icon',
            subLabel: 'Small icon shown in browser tabs',
            description: 'Upload a square image (at least 32x32px) that represents your site in browser tabs and bookmarks',
            input: 'InputMediaUpload',
          }),
          createOption({
            schema,
            key: 'userConfig.site.brand.shareImage',
            label: 'Social Preview Image',
            subLabel: 'Appears when your site is shared on social media',
            description: 'Upload an image (1200x630px recommended) to appear when your site is shared on social platforms like Facebook, Twitter, or LinkedIn',
            input: 'InputMediaUpload',
          }),

        ],
      }),
      createOption({
        schema,
        key: 'group.metatags',
        label: 'Meta Tags',
        input: 'group',
        icon: { class: 'i-tabler-tag' },
        options: [
          createOption({
            schema,
            key: 'userConfig.site.meta.timezone',
            label: 'Time Zone',
            subLabel: 'Used for scheduling and date displays',
            description: 'Sets how dates and times are displayed across your site based on your location',
            input: 'InputTimezone',
          }),
          createOption({
            schema,
            key: 'userConfig.site.meta.locale',
            label: 'Language Code',
            subLabel: 'e.g., "en" for English',
            description: 'Two-letter code that tells browsers and search engines what language your site uses (e.g., "en" for English, "es" for Spanish)',
            input: 'InputText',
            placeholder: 'en',
          }),
          createOption({
            schema,
            key: 'userConfig.site.meta.titleTemplate',
            label: 'Page Title Format',
            subLabel: 'Template for browser tab titles',
            description: 'Customize how page titles appear in browser tabs and search results. Use {{pageTitle}} for the current page name and {{siteTitle}} for your site name.',
            input: 'InputText',
            placeholder: '{{pageTitle}} - {{siteTitle}}',
          }),
        ],
      }),
      // Advanced Settings Group
      createOption({
        schema,
        key: 'siteCustomize',
        label: 'Custom Tracking (GTM)',
        input: 'group',
        icon: { class: 'i-tabler-code' },
        options: [

          createOption({
            schema,
            key: 'userConfig.site.customCode.gtmContainerId',
            label: 'Google Tag Manager ID',
            subLabel: 'For analytics and tracking (optional)',
            description: 'Enter your GTM container ID to enable analytics, tracking, and other marketing tools. Format: GTM-XXXXXXX',
            input: 'InputText',
            placeholder: 'GTM-XXXXXXX',
          }),
        ],
      }),
    ],
  }),

]

const v = vue.computed({
  get: () => props.site.toConfig(),
  set: async (v) => {
    await updateSite({ site: props.site, newConfig: v, caller: 'updateGlobalSettings' })
  },
})
</script>

<template>
  <ElTool
    :actions="[]"
    v-bind="props"
  >
    <ElForm>
      <FormEngine
        v-model="v"
        state-key="globalSettings"
        :options="options"
        :input-props="{ site }"
      />
    </ElForm>
  </ElTool>
</template>
