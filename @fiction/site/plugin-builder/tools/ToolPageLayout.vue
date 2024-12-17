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

const props = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const { site, tool } = props

const options = vue.computed<InputOption[]>(() => {
  return [
    createOption({
      key: 'manageLayout',
      label: 'Page Layout',
      input: 'group',
      options: [
        createOption({
          key: 'manageLayoutInput',
          input: vue.defineAsyncComponent(() => import('./InputManageLayout.vue')),
          props: { site, tool },
        }),
        createOption({
          key: 'addElementsInputs',
          input: vue.defineAsyncComponent(() => import('./InputAddElements.vue')),
          props: { site, tool },
        }),
      ],
    }),

  ]
})
</script>

<template>
  <ElTool
    v-bind="props"
    title="Edit Layout"
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
