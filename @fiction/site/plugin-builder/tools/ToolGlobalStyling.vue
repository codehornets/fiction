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
        subLabel: 'Control how your site appears to visitors',
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
        subLabel: 'Used for buttons, links, and important elements',
        input: 'InputSelect',
        list: colorThemeUser,
        placeholder: 'Default',
      }),
    ],
  }),
  // Typography Group
  new InputOption({
    key: 'globalFonts',
    label: 'Typography',
    description: 'Choose fonts for different parts of your site',
    input: 'group',
    options: [
      new InputOption({
        key: 'userConfig.styling.fonts.title.fontKey',
        label: 'Headings',
        subLabel: 'Used for page titles and major headings',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      new InputOption({
        key: 'userConfig.styling.fonts.body.fontKey',
        label: 'Main Text',
        subLabel: 'Used for paragraphs and general content',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      new InputOption({
        key: 'userConfig.styling.fonts.highlight.fontKey',
        label: 'Accent Text',
        subLabel: 'Used for emphasis and special text',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      new InputOption({
        key: 'userConfig.styling.fonts.sans.fontKey',
        label: 'Sans-Serif',
        subLabel: 'Modern, clean style for UI elements',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      new InputOption({
        key: 'userConfig.styling.fonts.serif.fontKey',
        label: 'Serif',
        subLabel: 'Traditional style for formal content',
        input: 'InputFont',
        props: { noPreview: true },
      }),
      new InputOption({
        key: 'userConfig.styling.fonts.mono.fontKey',
        label: 'Monospace',
        subLabel: 'Fixed-width font for code and technical content',
        input: 'InputFont',
        props: { noPreview: true },
      }),
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
