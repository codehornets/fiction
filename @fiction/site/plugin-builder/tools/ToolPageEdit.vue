<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { getPageOptions } from './utils'

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = vue.computed<InputOption[]>(() => {
  const optionGroups = getPageOptions({ site })
  return [
    createOption({
      key: 'pageSetup',
      label: 'Edit Page',
      input: 'group',
      icon: { class: 'i-tabler-file-text' },
      options: [
        optionGroups.essentials,
        optionGroups.special,
        optionGroups.seo,
      ],
    }),

  ]
})
</script>

<template>
  <ElTool
    v-bind="props"
    title="Edit Page Details"
  >
    <ElForm>
      <FormEngine
        v-model="site.editPageConfig.value"
        state-key="pageEdit"
        :options
        :input-props="{ site, tool }"
      />
    </ElForm>
  </ElTool>
</template>
