<script lang="ts" setup>
import type { ActionButton, vue } from '@fiction/core'
import XButton from './buttons/XButton.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  raw: { type: Boolean, default: false },
  boxClass: { type: String, default: '' },
  panelClass: { type: String, default: '' },
  headerClass: { type: String, default: '' },
  actions: {
    type: Array as vue.PropType<ActionButton[]>,
    default: () => [],
  },
})
</script>

<template>
  <section class=" ">
    <div class="h-full">
      <div
        class="box h-full"
        :class=" panelClass || raw ? panelClass : `` "
      >
        <div
          v-if="title || (actions && actions.length)"
          class="flex items-center space-x-4 px-4 py-2 justify-between"
          :class="headerClass"
        >
          <div><h2 v-if="title" class="x-font-title text-lg font-semibold" v-html="title" /></div>
          <div
            v-if="actions && actions.length"
            class="flex shrink-0 items-end justify-end space-x-4"
          >
            <XButton
              v-for="(action, i) in actions"
              :key="i"
              :theme="action.theme || 'default'"
              :size="action.size || 'md'"
              :loading="action.loading"
              :icon="action.icon"
              :icon-after="action.iconAfter"
              :href="action.href"
              :data-test-id="action.testId"
              @click.stop="action.onClick ? action.onClick({ event: $event }) : ''"
            >
              {{ action.label }}
            </XButton>
          </div>
        </div>

        <div :class="boxClass || raw ? boxClass : `py-2 px-0 lg:px-6`">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less">
.el-panel {
  --input-x: 0.75em;
  --input-y: 0.5em;
  --input-max-width: 380px;
}
</style>
