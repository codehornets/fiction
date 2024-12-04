import type { Post } from '@fiction/posts'

export function getNextPost(args: { single?: Post, posts?: Post[] }) {
  const { single, posts = [] } = args
  if (!single)
    return undefined

  const index = posts.findIndex(p => p.slug.value === single.slug.value)
  if (index === -1)
    return undefined

  return posts[index + 1] || posts[index - 1] || undefined
}
