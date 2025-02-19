<script lang="ts" setup generic="T extends Record<string, unknown> = Record<string, unknown>">
import type { Card } from '@fiction/site'
import type { AdminEditorController } from '../admin'
import { resetUi, toLabel, vue } from '@fiction/core'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'

const { controller, toolProps, loading = false, card } = defineProps<{
  controller: AdminEditorController
  toolProps: T
  loading?: boolean
  card: Card
}>()

const primaryTool = vue.computed(() => controller.activeTool.primary.value)
const contextTool = vue.computed(() => controller.activeTool.context.value)
</script>

<template>
  <div>
    <div class="grid grid-flow-dense h-full md:h-[100dvh] grid-cols-[1fr] grid-rows-[auto_minmax(0,1fr)]">
      <div class="border-b border-theme-200 dark:border-theme-700 bg-theme-0 dark:bg-theme-950">
        <div class="flex py-2 items-center justify-between px-4">
          <div class="items-center flex text-sm lg:text-base space-x-4">
            <slot name="headerLeft" />
          </div>
          <div class="flex items-center justify-end space-x-4 text-right ">
            <slot name="headerRight" />
          </div>
        </div>
      </div>
      <div
        class="editor-work-area min-h-0 grid grid-flow-dense grid-cols-[60px_1fr] grid-rows-[minmax(0,1fr)]"
      >
        <div
          class="no-scrollbar min-w-0 grow-0 relative "
          @click.stop="resetUi({ scope: 'inputs', cause: 'clickEditorTools', trigger: 'elementClick' })"
        >
          <div class="flex flex-col justify-between py-6 z-40 relative h-full bg-theme-0 dark:bg-theme-900 border-r border-theme-200 dark:border-theme-700">
            <div class="space-y-1">
              <div
                v-for="(tool, i) in controller.tools?.filter(_ => _.isPrimary && _.isPrimary !== 'bottom') || []"
                :key="i"
                class="flex items-center justify-center"
              >
                <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                  <div
                    :data-test-id="`tool-button-${tool.toolId}`"
                    class=" space-x-2 cursor-pointer p-2 justify-end size-[40px] rounded-lg transition-all"
                    :title="toLabel(tool.title || tool.toolId)"
                    :class="controller.isUsingTool({ toolId: tool.toolId })
                      ? 'bg-primary-500 dark:bg-primary-600/60 ring-1 dark:ring-primary-500 ring-primary-600 text-white'
                      : 'text-theme-600/80 dark:text-theme-0 hover:bg-primary-500 hover:text-white ring-primary-600 dark:hover:bg-primary-600/60  hover:ring-1 ring-inset dark:hover:ring-primary-500  '"
                    @click="controller.useTool({ toolId: tool.toolId })"
                  >
                    <div class="text-2xl" :class="tool.icon" />
                  </div>
                </ElTooltip>
              </div>
            </div>
            <div class="space-y-1">
              <div
                v-for="(tool, i) in controller.tools?.filter(_ => _.isPrimary && _.isPrimary === 'bottom') || []"
                :key="i"
                class="flex items-center justify-center"
              >
                <ElTooltip :content="toLabel(tool.title || tool.toolId)">
                  <div
                    :data-test-id="`tool-button-${tool.toolId}`"
                    class=" space-x-2 cursor-pointer p-2 justify-end size-[40px] rounded-lg transition-all"
                    :title="toLabel(tool.title || tool.toolId)"
                    :class="controller.isUsingTool({ toolId: tool.toolId })
                      ? 'bg-primary-500 dark:bg-primary-600/60 ring-1 dark:ring-primary-500 ring-primary-600 text-white'
                      : 'text-theme-600/80 dark:text-theme-0 hover:bg-primary-500 hover:text-white ring-primary-600 dark:hover:bg-primary-600/60  hover:ring-1 ring-inset dark:hover:ring-primary-500  '"
                    @click="controller.useTool({ toolId: tool.toolId })"
                  >
                    <div class="text-2xl" :class="tool.icon" />
                  </div>
                </ElTooltip>
              </div>
            </div>
          </div>
          <transition
            mode="out-in"
            enter-active-class="ease-out duration-200"
            enter-from-class="transform -translate-x-10 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform -translate-x-10 opacity-0"
          >
            <div
              v-if="primaryTool"
              :key="primaryTool.toolId"
              class="absolute left-full h-full bg-theme-0 dark:bg-theme-900 top-0 z-30 border-r shadow-[10px_0_18px_-15px_rgba(0,0,0,0.6)] border-theme-300/70 dark:border-theme-600 overflow-scroll no-scrollbar "
              :class="primaryTool.widthClasses || 'w-[360px]'"
            >
              <component
                :is="primaryTool.el"
                v-bind="{ card, controller, ...toolProps, tool: primaryTool, ...primaryTool.props?.(toolProps).value }"
              />
            </div>
          </transition>
        </div>
        <div @click="controller.useTool({ toolId: '' })">
          <div class="h-full min-h-0 grid grid-flow-dense relative grid-rows-[minmax(0,1fr)] grid-cols-[1fr_300px] xl:grid-cols-[1fr_400px]">
            <div class="cards relative h-full w-full overflow-scroll bg-theme-50/50 dark:bg-theme-800/60">
              <div v-if="loading" class="">
                <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
                  <ElSpinner class="size-12" />
                </div>
              </div>
              <template v-else>
                <slot />
              </template>
            </div>

            <div class="no-scrollbar  bg-theme-0 dark:bg-theme-900 border-l border-theme-200 dark:border-theme-700 relative overflow-y-scroll overflow-x-clip">
              <transition
                mode="out-in"
                enter-active-class="ease-out duration-200"
                enter-from-class="transform scale-80 translate-y-4 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="ease-in duration-200"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform scale-80 translate-y-4 opacity-0"
              >
                <component
                  :is="contextTool.el"
                  v-if="contextTool"
                  v-bind="{ card, controller, ...toolProps, tool: contextTool, ...contextTool.props?.(toolProps).value }"
                />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
