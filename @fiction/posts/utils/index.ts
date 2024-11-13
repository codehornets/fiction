import type { FictionPosts } from '..'
import type { ManagePostParamsRequest } from '../endpoint'
import { Post } from '../post'

// https://stackoverflow.com/a/57103940/1858322
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never

export async function managePost(args: { fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId'>, caller: string }): Promise<Post | undefined> {
  const { fictionPosts, params, caller = 'unknown' } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params as ManagePostParamsRequest, { caller })

  const postConfig = r.data?.[0]

  return r.data ? new Post({ fictionPosts, ...postConfig, sourceMode: 'standard' }) : undefined
}

export async function managePostIndex(args: { fictionPosts: FictionPosts, params: DistributiveOmit<ManagePostParamsRequest, 'orgId'>, caller: string }): Promise<Post[]> {
  const { fictionPosts, params, caller = 'unknown' } = args
  const r = await fictionPosts.requests.ManagePost.projectRequest(params, { caller })

  return r.data?.length ? r.data.map(p => new Post({ fictionPosts, ...p, sourceMode: 'standard' })) : []
}
