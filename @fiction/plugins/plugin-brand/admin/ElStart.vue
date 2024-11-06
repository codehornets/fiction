<script lang="ts" setup>
import type { StepConfig, StepItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { FictionBrand } from '..'
import type { TableBrand } from '../schema.js'
import { dayjs, toLabel, useService, vue } from '@fiction/core'
import ElModal from '@fiction/ui/ElModal.vue'
import ElStepNav from '@fiction/ui/ElStepNav.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
  vis: { type: Boolean, default: false },
})

const emit = defineEmits(['update:vis'])

const { fictionBrand } = useService<{ fictionBrand: FictionBrand }>()

const form = vue.ref<Partial<TableBrand>>({
  title: '',
})
const isLoading = vue.ref(false)

async function start() {
  isLoading.value = true
  try {
    const fields = form.value
    const brandId = 'test'
    await props.card.goto(`/manage-brand?brandId=${brandId}`)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}
const stepConfig: StepConfig = {
  onComplete: async () => {},
  form,
  steps: vue.computed<StepItem[]>(() => {
    const out: StepItem[] = [

      {
        name: 'Create New Brand',
        desc: 'Give it a name...',
        key: 'emailTitle',
        class: 'max-w-lg',
        isNeeded: true,
        onClick: () => start(),
      },
    ]

    return out
  }),
}
</script>

<template>
  <ElModal
    modal-class="max-w-screen-md"
    style-class="pointer-events-none"
    :vis="vis"
    @update:vis="emit('update:vis', $event)"
  >
    <ElStepNav v-slot="{ step }" :step-config="stepConfig">
      <div v-if="step.key === 'emailTitle'" class="">
        <ElInput
          v-model="form.title"
          data-test-id="email-title-input"
          input="InputText"
          placeholder="Title"
          ui-size="lg"
        />
      </div>
    </ElStepNav>
  </ElModal>
</template>
