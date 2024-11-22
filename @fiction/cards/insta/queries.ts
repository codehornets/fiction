import type { EndpointMeta, EndpointResponse } from '@fiction/platform'
import { CardQuery, type CardQuerySettings } from '@fiction/site/cardQuery'

class InstagramQuery extends CardQuery {
  async run(_params: { test: boolean }, _meta: EndpointMeta): Promise<EndpointResponse<{ test: boolean }>> {
    return { status: 'success', data: _params }
  }
}

type ExtractCardRequests<T> = {
  [K in keyof T]: T[K] extends { run: (params: infer P, meta: any) => Promise<infer R> }
    ? { params: P, result: R }
    : never
}

export type CardRequests = ExtractCardRequests<Awaited<ReturnType<typeof getQueries>>>

export function getQueries(args: CardQuerySettings) {
  return {
    instagram: new InstagramQuery(args),
  }
}
