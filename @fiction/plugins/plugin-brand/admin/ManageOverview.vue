<script lang="ts" setup>
import type { Card } from '@fiction/site'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

const { card } = defineProps<{ card?: Card }>()

const options = vue.computed(() => {
  return [

    new InputOption({
      key: 'emailDetails',
      label: 'Content and Delivery Details',
      input: 'group',
      options: [
        new InputOption({
          testId: 'email-subject-line',
          icon: { class: 'i-tabler-input-spark' },
          label: 'Subject Line',
          subLabel: 'What the user sees in their inbox',
          input: 'InputControl',
          valueDisplay: () => {
            return {
              status: true ? 'ready' : 'incomplete',
              data: 'test',
            }
          },
          options: [
            new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true, placeholder: 'Subject Line', description: 'This is the subject line that appears in the recipient\'s inbox.' }),
          ],
        }),

      ],
      format: 'control',
    }),

  ]
})
</script>

<template>
  <SettingsPanel title="Goals and Guidance">
    <div class="my-6 space-y-6">
      <FormEngine
        :model-value="{}"
        state-key="settingsTool"
        ui-size="lg"
        :options
        :card
        format="control"
        @update:model-value="() => {}"
      />
    </div>
  </SettingsPanel>
</template>
