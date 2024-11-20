// PostCardContent.vue - Reusable card content component
<script lang="ts" setup>
import type { Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { DisplayUserConfig } from './config'
import { taxonomyLink } from '@fiction/posts'
import CardButton from '../CardButton.vue'
import CardTextPost from '../CardTextPost.vue'

const props = defineProps<{
  card: Card<any>
  post: Post
  display: DisplayUserConfig
}>()
</script>

<template>
  <div class="absolute inset-0 p-4 md:p-6 z-10 flex flex-col justify-end text-white">
    <div class="space-x-2 mb-2 md:mb-4">
      <CardButton
        v-for="(cat, i) in props.post.categories.value?.slice(0, 2)"
        :key="i"
        :card="props.card"
        theme="overlay"
        rounding="full"
        design="outline"
        size="xs"
        :text="cat"
        :href="taxonomyLink({ card: props.card, taxonomy: 'category', term: cat })"
      />
    </div>

    <CardTextPost
      :post="props.post"
      path="title"
      tag="h3"
      class="text-lg md:text-xl lg:text-2xl font-medium x-font-title line-clamp-2"
    />

    <div v-if="props.display.showExcerpt" class="mt-2 text-xs md:text-sm opacity-80 line-clamp-2">
      {{ props.post.excerpt }}
    </div>

    <div v-if="props.display.showAuthor" class="mt-3 flex items-center gap-2 text-xs font-sans">
      <img
        v-if="props.post.authors.value?.[0]?.avatar?.url"
        :src="props.post.authors.value[0].avatar.url"
        :alt="props.post.authors.value[0].fullName"
        class="w-5 h-5 rounded-full"
      >
      <span>{{ props.post.authors.value?.[0]?.fullName }}</span>
      <span v-if="props.display.showDate" class="text-white/70">·</span>
      <time v-if="props.display.showDate" class="text-white/70">
        {{ new Date(props.post.dateAt.value).toLocaleDateString() }}
      </time>
    </div>
  </div>
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
</template>
