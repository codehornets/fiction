<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { InputOption } from '@fiction/ui'
import type { Site } from '../../site'
import type { CardConfigPortable } from '../../tables'
import type { ToolKeys } from './tools.js'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { toSlug, vue } from '@fiction/core'
import { createOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { requestManagePage } from '../../utils/region'
import { getPageOptions } from './utils'

const { site, controller } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const loading = vue.ref(false)
const options = vue.computed<InputOption[]>(() => {
  const optionGroups = getPageOptions({ site })
  return [
    createOption({
      key: 'pageSetup',
      label: 'Add New Page',
      input: 'group',
      icon: { class: 'i-tabler-file-text' },
      options: [
        optionGroups.essentials,
      ],
    }),

  ]
})

const page = vue.ref<CardConfigPortable>({ title: '', slug: '', cards: [{ templateId: 'cardHeroV1' }] })

vue.onMounted(() => {
  /**
   * Set viewId when title is written for convenience
   */
  const slugFromTitle = vue.ref('')
  vue.watch(
    () => page.value.title,
    (title) => {
      if (page.value && title && (!page.value.slug || page.value.slug === slugFromTitle.value)) {
        slugFromTitle.value = toSlug(title)
        page.value = { ...page.value, slug: slugFromTitle.value }
      }
    },
  )
})

async function save() {
  loading.value = true
  await requestManagePage({
    site,
    _action: 'upsert',
    regionCard: page.value,
    delay: 400,
    successMessage: 'Page Saved',
  })
  loading.value = false

  controller.useTool({ toolId: 'managePages' })
}
</script>

<template>
  <ElTool
    v-bind="{ site, tool, controller }"
    title="Add Page"
  >
    <ElForm @submit="save()">
      <FormEngine v-model="page" state-key="pageEdit" :options :input-props="{ site }" />

      <div class="text-right px-4 py-2">
        <ElInput input="InputSubmit" :loading rounding="full" data-test-id="requestCreateNewPage">
          Create New Page
        </ElInput>
      </div>
    </ElForm>
  </ElTool>
</template>
