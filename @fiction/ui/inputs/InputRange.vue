<script lang="ts" setup>
import { vue } from '@fiction/core'

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: 0 },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: 1 },
  icon: { type: String, default: '' },
  hideValue: { type: Boolean, default: false },
  startValue: { type: Number, default: undefined },
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload?: number): void
}>()

function toNumber(value: string | number | undefined): number {
  if (value === undefined || value === '')
    return Number.NaN
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  return Number.isNaN(num) ? 0 : num
}

// Initialize with startValue if provided
vue.onMounted(() => {
  if (props.startValue !== undefined && props.modelValue === undefined) {
    emit('update:modelValue', props.startValue)
  }
})

const isDragging = vue.ref(false)

async function handleEmit(target: EventTarget | null): Promise<void> {
  const el = target as HTMLInputElement
  let v = toNumber(el.value)

  // If not dragging and no value, use startValue
  if (!isDragging.value && props.modelValue === undefined && props.startValue !== undefined) {
    isDragging.value = true
    v = props.startValue
  }

  emit('update:modelValue', Number(v.toFixed(5)))

  await vue.nextTick()

  const min = toNumber(props.min)
  const max = toNumber(props.max)

  if (!Number.isNaN(min) && v < min) {
    v = min
    emit('update:modelValue', Number(v.toFixed(5)))
  }

  if (!Number.isNaN(max) && v > max) {
    v = max
    emit('update:modelValue', Number(v.toFixed(5)))
  }
}

vue.watch(() => props.modelValue, (newVal) => {
  if (newVal === undefined) {
    isDragging.value = false
  }
})

const hasValue = vue.computed(() => {
  return props.modelValue !== undefined && props.modelValue !== ''
})

const inputValue = vue.computed(() => {
  // If we have a model value, use it
  if (props.modelValue !== undefined && props.modelValue !== '')
    return props.modelValue

  // If we have a startValue, use that for initial position
  if (props.startValue !== undefined)
    return props.startValue

  // Fallback to min
  return toNumber(props.min)
})

const displayValue = vue.computed(() => {
  if (!hasValue.value)
    return undefined
  const num = toNumber(props.modelValue)
  return num.toFixed(2)
})
</script>

<template>
  <div class="text-input-size max-w-input flex items-center">
    <span
      v-if="!hideValue"
      class="dark:bg-theme-800 text-theme-600 dark:text-theme-0 mr-[1em] inline-flex items-center space-x-1 rounded-full px-[1em] py-[.2em] text-right text-[10px] font-mono font-medium"
    >
      <span v-if="icon" class="opacity-80 truncate text-xs" :class="icon" />
      <span v-if="hasValue">
        {{ displayValue }}
      </span>
      <span v-else class="i-tabler-line-dashed text-sm" />
    </span>

    <input
      class="w-full h-[.5em] bg-theme-100 dark:bg-theme-700 rounded-lg appearance-none cursor-pointer text-input-size"
      type="range"
      :value="inputValue"
      :min="min"
      :max="max"
      :step="step"
      @input="handleEmit($event.target)"
    >
  </div>
</template>

  <style lang="less">
  input[type="range"]::-webkit-slider-thumb {
    @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
  }
  input[type="range"]::-moz-range-thumb {
    @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
  }
  input[type="range"]::-ms-thumb {
    @apply ring-4 ring-white/60 h-[1.5em] w-[1.5em] cursor-pointer rounded-full appearance-none bg-theme-500 active:bg-theme-400 active:scale-95;
  }
  </style>
