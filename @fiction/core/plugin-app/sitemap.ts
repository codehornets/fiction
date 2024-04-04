import path from 'node:path'
import type { RouteRecordRaw } from 'vue-router'
import fs from 'fs-extra'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionRouter } from '../plugin-router'
import { safeDirname } from '../utils'
import { dayjs } from '../utils/libraries'
import type { SitemapConfig } from './types'

type FictionSitemapSettings = {
  fictionRouter: FictionRouter
} & FictionPluginSettings

export class FictionSitemap extends FictionPlugin<FictionSitemapSettings> {
  fictionRouter: FictionRouter
  constructor(settings: FictionSitemapSettings) {
    super('sitemap', settings)
    this.fictionRouter = settings.fictionRouter
  }

  async generateSitemap(params: {
    sitemaps: SitemapConfig[]
    appUrl: string
    distClient: string
  }): Promise<void> {
    const { appUrl, distClient } = params

    if (!distClient)
      throw new Error('distClient is required for sitemap')

    const paths = await this.getSitemapPaths(params)

    if (paths.length === 0) {
      this.log.warn('no sitemap paths found', { app: this.fictionEnv?.id })
      return
    }
    else {
      this.log.info(`starting sitemap with ${paths.length} paths`, {
        data: { appUrl },
      })
    }

    const sourceData = paths.map((url) => {
      const slashes = url.split('/').length

      let changefreq: 'daily' | 'weekly'
      let priority: number
      if (slashes > 2) {
        changefreq = 'weekly'
        priority = 0.3
      }
      else {
        changefreq = 'daily'
        priority = 0.7
      }
      return {
        url,
        changefreq,
        priority,
        lastmod: dayjs().format('YYYY-MM-DD'),
      }
    })

    const sitemap = await import(/* @vite-ignore */ 'sitemap')
    const { Readable } = await import(/* @vite-ignore */ 'node:stream')

    const stream = new sitemap.SitemapStream({
      hostname: appUrl,
      xslUrl: [appUrl, 'sitemap.xsl'].join('/'),
    })

    // Return a promise that resolves with your XML string
    const sitemapXmlData = await sitemap.streamToPromise(
      Readable.from(sourceData).pipe(stream),
    )

    const dirname = safeDirname(import.meta.url)
    fs.copySync(
      path.resolve(dirname, './sitemap.xsl'),
      path.join(distClient, './sitemap.xsl'),
    )
    fs.writeFileSync(
      path.join(distClient, './sitemap.xml'),
      sitemapXmlData.toString(),
    )

    this.log.info('built')
  }

  _processRouteConfigToUrls = (
    routes?: RouteRecordRaw[],
    parent = '',
  ): string[] => {
    let out: string[] = []

    routes
      ?.filter(_ => _.path !== '*' && (_.component || _.components))
      .forEach((_) => {
        if (_.path) {
          let _p = _.path

          if (parent && !_.path.startsWith('/'))
            _p = `${parent}/${_.path}`
          else if (parent && _.path === '/')
            _p = parent

          out.push(_p)
        }

        if (_.children)
          out = [...out, ...this._processRouteConfigToUrls(_.children, _.path)]
      })

    return out.filter(
      _ => !_.includes(':') && !_.includes('?') && !_.includes('*'),
    )
  }

  getKnownRouteUrls = async (): Promise<string[]> => {
    const urls = this._processRouteConfigToUrls(
      this.fictionRouter.vueRoutes.value,
    )

    return urls
  }

  getSitemapPaths = async (params: {
    sitemaps: SitemapConfig[]
  }): Promise<string[]> => {
    const { sitemaps = [] } = params
    const main = await this.getKnownRouteUrls()

    let out: string[] = []

    sitemaps.forEach(({ paths }) => {
      out = [...out, ...paths]
    })

    // use Set to remove duplicates
    const urls = new Set([...out, ...main])

    return [...urls]
  }
}
