<script lang="ts" setup>
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { UserConfig } from './index.js'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { useService, vue } from '@fiction/core'
import { allPostsLink, postEditLink, postLink, taxonomyLink } from '@fiction/posts'
import AnimClipPath from '@fiction/ui/anim/AnimClipPath.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import CardButton from '../CardButton.vue'
import CardTextPost from '../CardTextPost.vue'
import ElAuthor from './ElAuthor.vue'

const { card, loading = false, post, nextPost } = defineProps<{
  card: Card<UserConfig>
  loading: boolean
  post?: Post
  nextPost?: Post
}>()

const service = useService<{ fictionPosts: FictionPosts }>()

const userIsAuthor = vue.computed(() => {
  return post?.settings.authors?.some(a => a.userId === service.fictionUser.activeUser.value?.userId)
})
const proseClass = `prose dark:prose-invert prose-sm md:prose-lg lg:prose-xl mx-auto focus:outline-none max-w-[55ch]`

const imageAspect = vue.computed(() => {
  const img = post?.media.value
  const h = img?.height
  const w = img?.width

  if (!img || !w || !h)
    return 'aspect-[2/1]'

  return w > h ? 'aspect-square max-h-[70dvh]' : 'aspect-[2/1]'
})
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <div
      v-if="loading"
      class="flex py-24 justify-center h-[90dvh] text-theme-300 dark:text-theme-700 "
    >
      <ElSpinner class="h-12 w-12" />
    </div>
    <article v-if="post" class="p-8 pb-44">
      <div class="space-y-8 my-[min(max(35px,_5vw),_60px)] prose:max-w-none text-center max-w-screen-lg mx-auto" :class="proseClass">
        <div class="tags space-x-3 not-prose">
          <CardButton size="sm" :card design="link" :href="allPostsLink({ card })" rounding="full">
            &larr; All Posts
          </CardButton>
          <CardButton
            v-for="(cat, i) in post.categories.value"
            :key="i"
            size="sm"
            :card
            rounding="full"
            :text="cat"
            :href="taxonomyLink({ card, taxonomy: 'category', term: cat })"
          />
          <CardButton
            v-if="userIsAuthor"
            size="sm"
            :card
            :href="postEditLink({ post })"
            class="flex items-center"
            rounding="full"
            theme="green"
          >
            Edit Post
          </CardButton>
        </div>
        <CardTextPost tag="h1" path="title" :post="post" class="text-6xl font-semibold x-font-title text-balance" />
        <CardTextPost :post="post" tag="h2" path="subTitle" class="text-3xl font-medium dark:text-theme-400 text-balance" />
        <div class="flex justify-center">
          <ElAuthor v-for="(author, i) in post.authors.value" :key="i" :user="author" :date-at="post.dateAt.value" />
        </div>
      </div>
      <AnimClipPath :animate="true" class="my-[min(max(35px,_5vw),_60px)]" caller="magSingle">
        <XMedia :media="post.media.value" :class="imageAspect" class=" mx-auto relative overflow-hidden rounded-lg" />
      </AnimClipPath>
      <div :class="proseClass">
        <CardTextPost :post="post" path="content" class="content-container" />

        <div v-if="post.tags.value?.length" class="not-prose tags flex gap-4 my-8 items-center px-4 justify-center" :class="proseClass">
          <div class="text-xs italic text-theme-500">
            tagged with &rarr;
          </div>
          <div class="gap-3 flex">
            <CardButton
              v-for="(tag, i) in post.tags.value"
              :key="i"
              size="xs"
              :card
              :text="tag"
              :href="taxonomyLink({ card, taxonomy: 'tag', term: tag })"
            />
          </div>
        </div>

        <CardLink v-if="nextPost" :card :href="postLink({ card, slug: nextPost.slug.value })" class="mt-16 next-post flex not-prose gap-8 items-center border rounded-lg bg-theme-50/50 hover:bg-theme-50 dark:bg-theme-800/50 dark:hover:bg-theme-800 border-theme-200 dark:border-theme-700 p-6">
          <div>
            <div v-if="nextPost.media.value?.url" class="rounded-lg ring-2 ring-theme-200 dark:ring-theme-700 size-32 relative overflow-hidden" :class="imageAspect">
              <img :src="nextPost.media.value?.url" alt="Post media" class="absolute h-full w-full object-cover object-center">
            </div>
          </div>

          <div class="space-y-2">
            <div v-if="nextPost" class="font-sans text-xs">
              Next Post &rarr;
            </div>
            <h1 class="text-2xl font-bold x-font-title text-balance">
              {{ nextPost.title.value }}
            </h1>
          </div>
        </CardLink>
      </div>
    </article>
    <El404 v-else title="Post Not Found" :buttons="[{ label: 'All Posts', href: card.link('/:viewId') }]" />
  </div>
</template>

<style lang="less">
.content-container > p:first-of-type::first-letter {
  font-size: 2em;
    line-height: 1;
    margin-right: 0.1rem;
    text-transform: uppercase;

}
</style>
