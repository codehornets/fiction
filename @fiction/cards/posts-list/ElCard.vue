<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { DisplayUserConfig, UserConfig } from './config'
import NavDots from '@fiction/cards/el/NavDots.vue'
import { useService, vue } from '@fiction/core'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import El404 from '@fiction/ui/page/El404.vue'
import CardButton from '../CardButton.vue'
import ElMagazineSingle from '../posts-magazine/ElMagazineSingle.vue'
import { loadPosts } from '../utils/post'
import PostCard from './PostCard.vue'

defineOptions({ name: 'PostList' })

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

// State
const activeItem = vue.ref(0)
const loading = vue.ref(false)
const posts = vue.shallowRef<Post[]>([])
const indexMeta = vue.ref<IndexMeta>({ offset: 0, limit: 12, count: 0 })
const singlePost = vue.shallowRef<Post>()
const nextPost = vue.shallowRef<Post>()

// Computed
const routeSlug = vue.computed(() => card.site?.siteRouter.params.value.itemId as string | undefined)
const uc = vue.computed(() => card.userConfig.value || {})

const displayConfig = vue.computed<DisplayUserConfig>(() => ({
  layout: uc.value.display?.layout || 'grid',
  proportions: uc.value.display?.proportions || 'standard',
  showAuthor: uc.value.display?.showAuthor ?? true,
  showDate: uc.value.display?.showDate ?? true,
  showExcerpt: uc.value.display?.showExcerpt ?? false,
  itemsPerRow: uc.value.display?.itemsPerRow || 3,
  maxRows: uc.value.display?.maxRows || 2,
}))

const gridClass = vue.computed(() => {
  if (displayConfig.value.layout === 'scroll')
    return ''
  const cols = displayConfig.value.itemsPerRow
  return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 lg:gap-10`
})

const pagination = vue.computed(() => ({
  totalPages: Math.ceil((indexMeta.value.count || 0) / (indexMeta.value.limit || 12)),
  currentPage: Math.floor((indexMeta.value.offset || 0) / (indexMeta.value.limit || 12)) + 1,
}))

// Visual dimensions for layouts
const dimensions = vue.computed(() => {
  const proportions = displayConfig.value.proportions || 'standard'
  const heightMap: Record<string, string> = {
    wide: 'h-[45vh]',
    standard: 'h-[50vh]',
    portrait: 'h-[60vh]',
    square: 'h-[55vh]',
    cinema: 'h-[40vh]',
  }
  const widthMap: Record<string, string> = {
    wide: 'w-[75%]',
    standard: 'w-[65%]',
    portrait: 'w-[45%]',
    square: 'w-[55%]',
    cinema: 'w-[85%]',
  }
  const mobileWidthMap: Record<string, string> = {
    wide: 'w-[85%]',
    standard: 'w-[80%]',
    portrait: 'w-[70%]',
    square: 'w-[75%]',
    cinema: 'w-[90%]',
  }

  return {
    height: `${heightMap[proportions]} max-h-[600px]`,
    width: {
      mobile: mobileWidthMap[proportions],
      desktop: widthMap[proportions],
    },
  }
})

const postConfigs = vue.computed(() => posts.value.map(_ => _.toConfig()))

// Methods
async function fetchPosts() {
  if (!fictionPosts)
    return

  loading.value = true
  try {
    const result = await loadPosts({
      fictionPosts,
      card,
      postConfig: uc.value.posts || {},
      routeSlug: routeSlug.value,
      indexMeta: { ...indexMeta.value, limit: uc.value.posts?.limit },
      viewSlug: uc.value.posts?.viewSlug,
    })

    posts.value = result.posts
    indexMeta.value = result.indexMeta
    singlePost.value = result.singlePost
    nextPost.value = result.nextPost
  }
  catch (error) {
    console.error('Error loading posts:', error)
  }
  finally {
    loading.value = false
  }
}

function changePage(newPage: number) {
  if (newPage < 1 || newPage > pagination.value.totalPages)
    return

  const newOffset = (newPage - 1) * (indexMeta.value.limit || 12)
  indexMeta.value = { ...indexMeta.value, offset: newOffset }
  fetchPosts()
}

// Lifecycle
vue.onMounted(() => {
  fetchPosts()

  vue.watch(() => [routeSlug.value, uc.value.posts?.format], () => {
    fetchPosts()
  })
})

vue.onServerPrefetch(() => fetchPosts())
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <ElSpinner class="h-8 w-8 text-theme-500" />
    </div>

    <ElMagazineSingle
      v-else-if="routeSlug"
      :key="routeSlug"
      :card="card"
      :loading="loading"
      :post="singlePost"
      :next-post="nextPost"
    />

    <!-- Grid Layout -->
    <div
      v-else-if="displayConfig.layout === 'grid'"
      :class="[
        gridClass,
        displayConfig.gap === 'sm' && 'gap-4',
        displayConfig.gap === 'md' && 'gap-6',
        displayConfig.gap === 'lg' && 'gap-8',
        displayConfig.gap === 'xl' && 'gap-10',
        displayConfig.gap === '2xl' && 'gap-12',
      ]"
    >
      <PostCard
        v-for="post in posts"
        :key="post.slug.value"
        :card="card"
        :post="post"
        :display="displayConfig"
        :class="dimensions.height"
      />
    </div>

    <!-- Scroll Layout -->
    <div v-else class="relative">
      <EffectCarousel
        v-model:active-index="activeItem"
        :slides="postConfigs"
        :options="{}"
      >
        <template #default="{ slide }">
          <PostCard
            :key="slide.slug"
            :card="card"
            :post="posts.find(_ => _.slug.value === slide.slug)"
            :display="displayConfig"
            class="carousel-cell mr-6 lg:mr-10"
            :class="[
              dimensions.height,
              dimensions.width.mobile,
              `md:${dimensions.width.desktop}`,
            ]"
          />
        </template>
      </EffectCarousel>

      <NavDots
        v-model:active-item="activeItem"
        :wrap-selector="`[data-card-id='${card.cardId}']`"
        :items="posts"
        class="mt-16 z-20 justify-center "
      />
    </div>

    <!-- No Posts State -->
    <El404
      v-if="!loading && !posts.length"
      title="No Posts Available"
      sub-title="Check back later for new content"
    />

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages > 1 && displayConfig.layout === 'grid'"
      class="mt-12 flex justify-center items-center gap-6"
    >
      <CardButton
        :card="card"
        :disabled="pagination.currentPage === 1"
        size="sm"
        rounding="full"
        @click="changePage(pagination.currentPage - 1)"
      >
        Previous
      </CardButton>
      <span class="font-sans text-xs text-theme-500 dark:text-theme-400">
        {{ pagination.currentPage }} / {{ pagination.totalPages }}
      </span>
      <CardButton
        :card="card"
        :disabled="pagination.currentPage === pagination.totalPages"
        size="sm"
        rounding="full"
        @click="changePage(pagination.currentPage + 1)"
      >
        Next
      </CardButton>
    </div>
  </div>
</template>
