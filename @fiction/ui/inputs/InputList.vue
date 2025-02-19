<script lang="ts" setup>
import type { Sortable } from '@shopify/draggable'
import type { InputOption } from '.'
import { isTest, shortId, vue, waitFor } from '@fiction/core'
import TransitionSlide from '../anim/TransitionSlide.vue'
import XButton from '../buttons/XButton.vue'
import FormEngine from './FormEngine.vue'

export type BasicItem = Record<string, unknown> & { _key?: string }

const {
  modelValue = [],
  options = [],
  itemLabel = 'Item',
  itemName = 'Item',
} = defineProps<{
  modelValue?: BasicItem[]
  options?: InputOption[]
  itemLabel?: string | ((args: { item?: BasicItem, index?: number }) => string)
  itemName?: string
  inputClass?: string
  depth?: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', payload: BasicItem[]): void
}>()

type KeyedItem = Record<string, unknown> & { _key: string }

const randomId = shortId()
const itemSelector = `[data-drag-depth="${randomId}"]`
const dragSelector = `[data-drag-handle="${randomId}"]`
const openItem = vue.ref(-1)
const wrapperEl = vue.ref<HTMLElement>()
const listKey = vue.ref(0)

const keyedModelValue = vue.computed<KeyedItem[]>(() => {
  return modelValue.map((item, i) => {
    item._key = item._key || shortId()
    return item
  }) as KeyedItem[]
})

function updateModelValue(val: Record<string, unknown>[]) {
  emit('update:modelValue', val)
}

async function updateOrder() {
  if (!wrapperEl.value)
    return

  const val: Record<string, unknown>[] = []
  wrapperEl.value.querySelectorAll(itemSelector).forEach((el) => {
    const element = el as HTMLElement
    const value = element.dataset.dragId

    if (value) {
      const item = keyedModelValue.value.find(i => i._key === value)
      if (item)
        val.push(item)
    }
  })

  updateModelValue(val)
  listKey.value++ // Increment the key to force re-render
}

// function updateInputValue(args: { index: number, key: string, value: unknown }) {
//   const { index, key, value } = args

//   const val = [...modelValue]
//   val[index] = setNested({ path: key, data: val[index], value })

//   updateModelValue(val)
// }

function updateIndexValue(index: number, value: Record<string, unknown>) {
  const val = [...modelValue]
  val[index] = value
  updateModelValue(val)
}

function getDefaultItem() {
  const item: Record<string, unknown> = {}
  options.forEach((opt) => {
    const v = opt.settings.getDefaultValue?.()
    if (v !== undefined)
      item[opt.key.value] = v
  })
  return item
}

function getItemLabel(item?: BasicItem, index: number = -1) {
  if (typeof itemLabel === 'function')
    return itemLabel({ item, index })

  const out: any[] = [itemLabel]

  if (index > -1)
    out.push(`${index + 1}`)

  return out.join(' ')
}

function addItem() {
  const _key = shortId()
  const defaultItem = getDefaultItem()
  const itemLabel = getItemLabel()
  const val = [...modelValue, { name: `New ${itemLabel}`, _key, ...defaultItem }]
  openItem.value = val.length - 1
  updateModelValue(val)
}

function removeItem(item: Record<string, unknown> & { _key: string }) {
  const confirmed = confirm('Delete this item permanently?')
  if (!confirmed)
    return
  const val = modelValue.filter(i => i._key !== item._key)
  updateModelValue(val)

  openItem.value = -1
}

function toggleItem(index: number) {
  openItem.value = openItem.value === index ? -1 : index
}

let sortable: Sortable | undefined

async function createDraggable() {
  if (typeof window === 'undefined' || !wrapperEl.value || isTest())
    return

  try {
    const { Plugins, Sortable } = await import('@shopify/draggable')

    if (sortable)
      sortable.destroy()

    sortable = new Sortable(wrapperEl.value, {
      draggable: itemSelector,
      distance: 3,
      handle: dragSelector,
      mirror: { constrainDimensions: true },
      swapAnimation: { duration: 200, easingFunction: 'ease-in-out', horizontal: false },
      plugins: [Plugins.SwapAnimation],
    })

    sortable.on('sortable:stop', (_evt) => {
      setTimeout(() => updateOrder(), 50)
    })
  }
  catch (error) {
    console.warn('Failed to initialize draggable:', error)
  }
}

vue.onMounted(async () => {
  await waitFor(200)

  vue.watch(() => listKey.value, async () => {
    await createDraggable()
  }, { immediate: true })
})
</script>

<template>
  <div ref="wrapperEl" :key="listKey" :data-namespace="randomId">
    <div
      v-for="(item, i) in keyedModelValue"
      :key="i"
      class="rounded-md border border-theme-300 dark:border-theme-600 mb-2 shadow-sm bg-theme-0 dark:bg-theme-800/20 cursor-pointer text-theme-700 dark:text-theme-100"
      :data-drag-id="item._key"
      :data-drag-depth="randomId"
      :data-handle-index="i"
    >
      <div
        class="px-1 py-1 bg-theme-50/50 dark:bg-theme-600/50 hover:bg-theme-50 text-xs font-mono font-medium flex justify-between items-center"
        :class="openItem === i ? 'rounded-t-md border-b border-theme-200 dark:border-theme-600' : 'rounded-md'"
        :data-drag-handle="randomId"
        data-test-id="handle"
        @click="toggleItem(i)"
      >
        <div class="flex gap-1 items-center cursor-move min-w-0">
          <div class="text-lg text-theme-300 dark:text-theme-500 i-tabler-grip-vertical" />
          <div class="text-theme-500 dark:text-theme-50 truncate w-full min-w-0">
            {{ getItemLabel(item, i) }}
          </div>
        </div>
        <div class="flex gap-1 items-center">
          <div class="text-lg text-theme-300 i-tabler-chevron-down transition-all" :class="openItem === i ? 'rotate-180' : ''" />
          <div class="text-[1.2em] text-theme-300 i-tabler-x transition-all opacity-70 hover:opacity-100" @click.stop="removeItem(item)" />
        </div>
      </div>
      <TransitionSlide>
        <div v-if="openItem === i">
          <div class="py-4 px-3 space-y-5">
            <FormEngine
              :model-value="item"
              :options
              :depth="1"
              @update:model-value="updateIndexValue(i, $event)"
            />
          </div>
        </div>
      </TransitionSlide>
    </div>

    <div class="actions mt-3">
      <XButton
        rounding="full"
        theme="primary"
        size="xs"
        data-test="add"
        icon="i-tabler-plus"
        @click.prevent="addItem()"
      >
        Add {{ itemName }}
      </XButton>
    </div>
  </div>
</template>
