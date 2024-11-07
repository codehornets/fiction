<script lang="ts" setup>
import type { AdminEditorController, EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import type { ToolKeys } from './tools'
import ElTool from '@fiction/admin/tools/ElTool.vue'
import { colorThemeUser, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { updateSite } from '../../utils/site'

const { site, tool } = defineProps<{
  site: Site
  tool: EditorTool
  controller: AdminEditorController<{ toolIds: ToolKeys }>
}>()

const options: InputOption[] = [
  new InputOption({
    key: 'colorScheme',
    label: 'Color Theme Settings',
    input: 'group',
    options: [
      new InputOption({
        key: 'userConfig.styling.prefersColorScheme',
        label: 'Theme Mode',
        description: 'Choose how your site\'s color theme behaves',
        input: 'InputSelect',
        list: [
          { value: 'auto', label: 'Match System Preferences' },
          { value: 'light', label: 'Always Light Theme' },
          { value: 'dark', label: 'Always Dark Theme' },
        ],
        placeholder: 'Select theme behavior',
      }),
    ],
  }),
  new InputOption({
    key: 'globalColor',
    label: 'Global Colors',
    input: 'group',
    options: [
      new InputOption({
        key: 'userConfig.standard.scheme.base.primary',
        label: 'Primary Color',
        input: 'InputSelect',
        list: colorThemeUser,
        placeholder: 'Default',
      }),
    ],
  }),
  new InputOption({
    key: 'globalFonts',
    label: 'Global Fonts',
    input: 'group',
    options: [
      new InputOption({ key: 'userConfig.styling.fonts.title.fontKey', label: 'Title Font', input: 'InputFont', props: { noPreview: true } }),
      new InputOption({ key: 'userConfig.styling.fonts.body.fontKey', label: 'Body Font', input: 'InputFont', props: { noPreview: true } }),
      new InputOption({ key: 'userConfig.styling.fonts.highlight.fontKey', label: 'Highlight Font', input: 'InputFont', props: { noPreview: true } }),
      new InputOption({ key: 'userConfig.styling.fonts.sans.fontKey', label: 'Sans Font', input: 'InputFont', props: { noPreview: true } }),
      new InputOption({ key: 'userConfig.styling.fonts.serif.fontKey', label: 'Serif Font', input: 'InputFont', props: { noPreview: true } }),
      new InputOption({ key: 'userConfig.styling.fonts.mono.fontKey', label: 'Mono Font', input: 'InputFont', props: { noPreview: true } }),
    ],
  }),
]

const v = vue.computed({
  get: () => site.toConfig(),
  set: async (v) => {
    await updateSite({ site, newConfig: v, caller: 'updateGlobalStyling' })
  },
})
</script>

<template>
  <ElTool :tool>
    <ElForm>
      <FormEngine
        v-model="v"
        state-key="globalStyling"
        :options
        :input-props="{ site }"
      />
    </ElForm>
  </ElTool>
</template>
