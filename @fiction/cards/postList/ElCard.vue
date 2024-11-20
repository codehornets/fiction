// ElCard.vue
<script lang="ts" setup>
import type { IndexMeta } from '@fiction/core'
import type { FictionPosts } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { DisplayUserConfig, UserConfig } from './config'
import NavDots from '@fiction/cards/el/NavDots.vue'
import { useService, vue } from '@fiction/core'
import { Post, taxonomyLink } from '@fiction/posts'
import EffectCarousel from '@fiction/ui/effect/EffectCarousel.vue'
import EffectGlare from '@fiction/ui/effect/EffectGlare.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'
import El404 from '@fiction/ui/page/El404.vue'
import CardButton from '../CardButton.vue'
import CardTextPost from '../CardTextPost.vue'
import CardLink from '../el/CardLink.vue'
import PostCard from './PostCard.vue'
import PostCardContent from './PostCardContent.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const { fictionPosts } = useService<{ fictionPosts: FictionPosts }>()

// Reactive refs
const activeItem = vue.ref(0)
const loading = vue.ref(false)
const posts = vue.shallowRef<Post[]>([])
const indexMeta = vue.ref<IndexMeta>({
  offset: 0,
  limit: 12,
  count: 0,
})

// Computed properties
const uc = vue.computed(() => card.userConfig.value || {})

const displayConfig = vue.computed<DisplayUserConfig>(() => {
  const display = uc.value.display || {}
  return {
    layout: display.layout || 'grid',
    size: display.size || 'regular',
    proportions: display.proportions || 'medium',
    showAuthor: display.showAuthor ?? true,
    showDate: display.showDate ?? true,
    showExcerpt: display.showExcerpt ?? false,
    itemsPerRow: display.itemsPerRow || 3,
    maxRows: display.maxRows || 2,
  }
})

const heightClass = vue.computed(() => {
  const size = displayConfig.value.size || 'regular'
  const proportions = displayConfig.value.proportions || 'medium'

  // Base heights adjusted by size
  const baseHeights = {
    compact: {
      short: 'h-[30vh]',
      medium: 'h-[40vh]',
      tall: 'h-[50vh]',
      wide: 'h-[35vh]',
      thin: 'h-[25vh]',
    },
    regular: {
      short: 'h-[40vh]',
      medium: 'h-[50vh]',
      tall: 'h-[60vh]',
      wide: 'h-[45vh]',
      thin: 'h-[35vh]',
    },
    expanded: {
      short: 'h-[50vh]',
      medium: 'h-[60vh]',
      tall: 'h-[70vh]',
      wide: 'h-[55vh]',
      thin: 'h-[45vh]',
    },
  }

  const maxHeight = 'max-h-[600px]'

  return `${baseHeights[size][proportions]} ${maxHeight}`
})

const gridClass = vue.computed(() => {
  if (displayConfig.value.layout === 'scroll')
    return ''
  const cols = displayConfig.value.itemsPerRow
  return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 lg:gap-10`
})

const totalPages = vue.computed(() => Math.ceil((indexMeta.value.count || 0) / (indexMeta.value.limit || 12)))
const currentPage = vue.computed(() => Math.floor((indexMeta.value.offset || 0) / (indexMeta.value.limit || 12)) + 1)

// Methods
function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value)
    return

  const newOffset = (newPage - 1) * (indexMeta.value.limit || 12)
  indexMeta.value = { ...indexMeta.value, offset: newOffset }
  loadPosts()
}

async function loadPosts() {
  loading.value = true
  try {
    if (uc.value.posts?.format === 'local') {
      await loadLocal()
    }
    else {
      await loadGlobal()
    }
  }
  catch (error) {
    console.error('Error loading posts:', error)
  }
  finally {
    loading.value = false
  }
}

async function loadLocal() {
  const entries = uc.value.posts?.entries || []
  const { offset = 0, limit = 12 } = uc.value.posts || {}

  indexMeta.value.count = entries.length

  const start = offset
  const end = offset + limit
  posts.value = entries.slice(start, end).map((p, i) => new Post({
    fictionPosts,
    card,
    ...p,
    sourceMode: 'local',
    localSourcePath: `posts.entries.${i + start}`,
  }))
}

async function loadGlobal() {
  const orgId = card.site?.settings.orgId
  if (!orgId) {
    console.error('No organization ID found')
    return
  }

  const response = await fictionPosts?.getPostIndex({
    card,
    limit: indexMeta.value.limit,
    offset: indexMeta.value.offset,
    orgId,
    caller: 'PostListCard',
  })

  if (response) {
    posts.value = response.posts
    indexMeta.value = { ...indexMeta.value, ...response.indexMeta }
  }
}

// Lifecycle
vue.onMounted(async () => {
  await loadPosts()
})

function onSlideChange(index: number) {
  activeItem.value = index
}
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <ElSpinner class="h-8 w-8 text-theme-500" />
    </div>

    <!-- Grid Layout -->
    <div
      v-else-if="displayConfig.layout === 'grid'"
      :class="[
        gridClass,
        displayConfig.gap === 'sm' ? 'gap-4' : '',
        displayConfig.gap === 'md' ? 'gap-6' : '',
        displayConfig.gap === 'lg' ? 'gap-8' : '',
        displayConfig.gap === 'xl' ? 'gap-10' : '',
        displayConfig.gap === '2xl' ? 'gap-12' : '',
      ]"
    >
      <PostCard
        v-for="post in posts"
        :key="post.slug.value"
        :card="card"
        :post="post"
        :display="displayConfig"
        :class="heightClass"
      />
    </div>

    <!-- Scroll Layout -->
    <div v-else class="relative ">
      <EffectCarousel v-model:active-index="activeItem" :slides="posts" :options="{}" @slide-change="onSlideChange">
        <template #default="{ slide }">
          <PostCard
            :key="slide.slug.value"
            :card="card"
            :post="slide"
            :display="displayConfig"
            class="carousel-cell w-[80%] md:w-[55%] lg:w-[30%] max-w-[600px] mr-6 lg:mr-10 max-h-[600px]"
            :class="[heightClass]"
            :style="{ width: `${90 / (displayConfig.itemsPerRow || 3)}%` }"
          />
        </template>
      </EffectCarousel>

      <NavDots
        v-model:active-item="activeItem"
        :container-id="card.cardId"
        :items="posts"
        class="mt-16 z-20"
      />
    </div>

    <!-- No Posts State -->
    <El404
      v-if="!loading && !posts.length"
      heading="No Posts Available"
      sub-heading="Check back later for new content"
    />

    <!-- Pagination -->
    <div
      v-if="totalPages > 1 && displayConfig.layout === 'grid'"
      class="mt-12 flex justify-center items-center gap-6"
    >
      <CardButton
        :card="card"
        :disabled="currentPage === 1"
        size="sm"
        rounding="full"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </CardButton>
      <span class="font-sans text-xs text-theme-500 dark:text-theme-400">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <CardButton
        :card="card"
        :disabled="currentPage === totalPages"
        size="sm"
        rounding="full"
        @click="changePage(currentPage + 1)"
      >
        Next
      </CardButton>
    </div>
  </div>
</template>

<style lang="less" scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
