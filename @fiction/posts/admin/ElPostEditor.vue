<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { Post } from '../post.js'
import XText from '@fiction/ui/common/XText.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import ProseEditor from '@fiction/ui/prose/editor/ProseEditor.vue'

defineOptions({ name: 'ElPostEditor' })

const { post } = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
}>()

function handleUpdate(args: { key: 'title' | 'subTitle' | 'content', value: string, caller: string }) {
  if (!post)
    return

  const { key, value, caller } = args

  post.update({ [key]: value }, { caller })

  emit('update:post', post)
}
</script>

<template>
  <div v-if="post">
    <div class="py-12 md:py-32 px-12 prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl xl:prose-2xl mx-auto focus:outline-none">
      <div class="flex gap-6 justify-between">
        <div class="flex-grow not-prose space-y-4">
          <XText
            :model-value="post.title.value"
            tag="h1"
            class="text-balance my-0 py-0 text-5xl font-bold"
            :is-editable="true"
            placeholder="Enter Title"
            data-test-id="post-editor-title"
            @update:model-value="handleUpdate({ key: 'title', value: $event as string, caller: 'proseEditor:title' })"
          />
          <XText
            :model-value="post.subTitle.value"
            tag="h3"
            class="dark:text-theme-300 text-3xl"
            :is-editable="true"
            placeholder="Enter Subtitle"
            data-test-id="post-editor-sub-title"
            @update:model-value="handleUpdate({ key: 'subTitle', value: $event as string, caller: 'proseEditor:subTitle' })"
          />
        </div>
        <div v-if="post.media.value?.url || post.media.value?.html" class="not-prose">
          <XMedia data-test-id="featured-post-media" :media="post.media.value" class="size-32 border border-theme-200 dark:border-theme-600 rounded-md bg-theme-50 dark:bg-theme-800 overflow-hidden" />
        </div>
      </div>
      <div class="border-b border-theme-200 dark:border-theme-700 my-12" />
      <ProseEditor
        :model-value="post.content.value"
        class="font-serif"
        :is-content-completion-disabled="post.userConfig.value?.isContentCompletionDisabled"
        :supplemental="{ title: post.title.value, subTitle: post.subTitle.value }"
        @update:model-value="handleUpdate({ key: 'content', value: $event as string, caller: 'proseEditor:content' })"
      />
      <div v-if="$slots.footer" class="not-prose">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
