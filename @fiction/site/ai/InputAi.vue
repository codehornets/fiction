<script lang="ts" setup>
import type { InputOptionGeneration } from '@fiction/ui'
import type { Card } from '../card'
import type { Site } from '../site'
import { onResetUi, toLabel, vue, waitFor } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import InputCheckbox from '@fiction/ui/inputs/InputCheckbox.vue'
import InputText from '@fiction/ui/inputs/InputText.vue'
import InputToggle from '@fiction/ui/inputs/InputToggle.vue'
import ElProgress from '@fiction/ui/loaders/ElProgress.vue'
import { CardGeneration } from '../generation'
import GeneratedContentDisplay from './GeneratedContentDisplay.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, default: () => ({}) },
})

const loading = vue.ref(false)
const card = vue.computed<Card | undefined>(() => props.site.activeCard.value)
const genUtil = vue.computed(() => card.value ? new CardGeneration({ card: card.value }) : undefined)
const genConfig = vue.ref<Awaited<ReturnType<
  typeof CardGeneration.prototype.getConfig
>>>()

vue.watch(() => card.value, async () => {
  if (!card.value)
    return

  genConfig.value = await genUtil.value?.getConfig()
})

const completion = vue.ref<Record<string, unknown>>()
const accept = vue.ref<Record<string, boolean>>({})
async function generateCard() {
  loading.value = true
  completion.value = await genUtil.value?.getCompletion()
  loading.value = false
}

vue.watch(() => completion.value, () => {
  const c = completion.value
  accept.value = {}
  if (c && Object.keys(c).length) {
    Object.entries(c).forEach(([key]) => {
      accept.value = { ...accept.value, [key]: true }
    })
  }
})

const finalCompletion = vue.computed(() => completion.value && Object.fromEntries(Object.entries(completion.value).filter(([key]) => accept.value[key])))

function updateGeneration(opt: InputOptionGeneration, value: InputOptionGeneration) {
  if (!opt.key || !card.value || !genUtil.value)
    return

  genUtil.value.fieldsUserConfig.value = { ...genUtil.value.fieldsUserConfig.value, [opt.key]: { ...opt, ...value } }
}

const vis = vue.ref(false)
const editField = vue.ref<string | undefined>()

onResetUi(() => {
  editField.value = undefined
})

async function applyChanges() {
  if (!card.value || !genUtil.value)
    return

  loading.value = true
  await waitFor(500)

  genUtil.value.applyChanges(finalCompletion.value)
  loading.value = false
  vis.value = false
  completion.value = undefined
}
</script>

<template>
  <div v-if="card" class="space-y-3">
    <div class="flex justify-between">
      <div class="flex items-center">
        <XButton
          type="submit"
          theme="primary"
          wrap-class="gap-1"
          size="xs"
          :loading="loading"
          icon="i-tabler-sparkles"
          rounding="full"
          @click.stop="vis = !vis"
        >
          Generate Content...
        </XButton>
      </div>

      <div class="flex items-center space-x-2" />
    </div>

    <ElModal v-model:vis="vis" modal-class="max-w-screen-md p-12">
      <div v-if="completion" class="space-y-6 max-w-2xl mx-auto">
        <h2 class="font-semibold text-lg x-font-title ">
          Accept Generated Content
        </h2>
        <div class=" divide-y divide-theme-200 dark:divide-theme-700  max-h-[400px] overflow-scroll">
          <div v-for="(field, key) in completion" :key="key" class="py-4 flex gap-8 rounded-md">
            <div class="space-y-2 font-semibold text-xs w-32 text-right shrink-0 text-theme-400 dark:text-theme-500">
              <div>{{ toLabel(key) }}</div>

              <div class="text-xs">
                <InputCheckbox ui-size="xs" :model-value="accept[key]" text="Add to Page" input-class="bg-theme-0 dark:bg-theme-600" @update:model-value="accept = { ...accept, [key]: $event }" />
              </div>
            </div>
            <div class="grow">
              <GeneratedContentDisplay :field="field" />
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-6">
          <XButton
            theme="default"
            size="md"
            icon="i-tabler-chevron-left"
            rounding="full"
            @click="completion = undefined"
          >
            Discard Changes
          </XButton>
          <XButton
            theme="primary"
            size="md"
            :loading="loading"
            icon="i-tabler-check"
            @click="applyChanges()"
          >
            Apply Changes
          </XButton>
        </div>
      </div>
      <div v-else-if="!loading" class="space-y-6 max-w-screen-sm">
        <ElForm v-if="card && genUtil" class="space-y-8" @submit="generateCard()">
          <div class="space-y-4">
            <div class="flex flex-col gap-2" @click.stop>
              <div class="grow text-sm">
                <ElInput
                  v-if="card && genUtil"
                  :site="site"
                  :label="`${card?.title.value}: Card Generation Prompt`"
                  description="Enter a sentence or two about what you wan t to achieve with this card. Contextual information will be added automatically."
                  :model-value="genUtil.prompt.value"
                  input="InputTextarea"
                  placeholder="This section should..."
                  @update:model-value="genUtil && (genUtil.userPrompt.value = $event)"
                />
              </div>
            </div>
            <div class="flex justify-between">
              <div class="text-xs font-medium text-center">
                Fields to Generate <span class="text-xs opacity-50 text-theme-500">( {{ genConfig?.totalEstimatedTime }} seconds)</span>
              </div>
            </div>
            <div v-if=" Object.keys(genConfig?.jsonPropConfig || {}).length === 0 " class="p-6 text-center text-sm bg-theme-50/60 rounded-md dark:bg-theme-700/40">
              This element has no fields to generate.
            </div>
            <div v-for="(opt, key) in genConfig?.jsonPropConfig" v-else :key="key" class="text-xs space-y-1">
              <div class="flex gap-2 items-center">
                <div class="">
                  <InputToggle :id="`opt-${key}`" :model-value="opt.isUserEnabled" input-class="bg-theme-0 dark:bg-theme-600" @update:model-value="updateGeneration(opt, { isUserEnabled: $event })" />
                </div>
                <label :for="`opt-${key}`" class="w-24 truncate font-semibold cursor-pointer select-none">
                  {{ toLabel(opt.label) }}
                </label>
                <div class="grow" @click.stop>
                  <InputText input-class="text-xs" :model-value="opt.prompt" placeholder="Prompt for Item (optional)" @update:model-value="updateGeneration(opt, { prompt: $event })" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div />
            <XButton
              type="submit"
              theme="primary"
              wrap-class="gap-1"
              size="md"
              :loading="loading"
              icon="i-tabler-sparkles"
              :disabled="!Object.keys(genConfig?.outputProps || {}).length"
              rounding="full"
              :title="!Object.keys(genConfig?.outputProps || {}).length ? 'No fields selected for generation' : ''"
            >
              Generate Content...
            </XButton>
          </div>
        </ElForm>
      </div>
      <ElProgress v-else :percent="genUtil?.progress.value.percent" :status="genUtil?.progress.value.status" message="Generating Content" />
    </ElModal>
  </div>
</template>
