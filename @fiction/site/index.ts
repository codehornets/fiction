// @unocss-include
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { DataFilter, FictionApp, FictionRouter, IndexMeta } from '@fiction/core'

import { EnvVar, vars } from '@fiction/core/plugin-env'
import type { FictionAdmin, FictionAdminSettings } from '@fiction/plugin-admin'
import type { PluginMain } from '@fiction/plugin-admin-index'
import { ManageIndex, ManagePage, ManageSite } from './endpoint'
import { tables } from './tables'
import { Site } from './site'
import type { ToolKeys } from './el/tools'
import { tools } from './el/tools'
import { getThemes } from './themes'
import { ManageCert } from './endpoint-certs'
import { getRoutes } from './routes'

export * from './site'

vars.register(() => [new EnvVar({ name: 'FLY_API_TOKEN' })])

export type SitesPluginSettings = {
  fictionAppSites: FictionApp
  fictionRouterSites: FictionRouter
  flyIoAppId: string
  flyIoApiToken: string
  fictionAdmin: FictionAdmin
} & FictionAdminSettings

export class FictionSites extends FictionPlugin<SitesPluginSettings> {
  themes = vue.shallowRef(getThemes({ fictionEnv: this.settings.fictionEnv }))
  queries = {
    ManageSite: new ManageSite({ ...this.settings, fictionSites: this }),
    ManageIndex: new ManageIndex({ ...this.settings, fictionSites: this }),
    ManagePage: new ManagePage({ ...this.settings, fictionSites: this }),
    ManageCert: new ManageCert({ ...this.settings, fictionSites: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: SitesPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSites', s)

    this.settings.fictionDb.addTables(tables)
    this.settings.fictionRouter?.update(getRoutes({ ...this.settings, fictionSites: this }))
  }

  activeSite = vue.shallowRef<Site | undefined>(undefined)

  activeToolId = {
    left: vue.ref<ToolKeys | ''>(),
    right: vue.ref<ToolKeys | ''>(),
  }

  activeTool = {
    left: vue.computed(() => tools().find(t => t.toolId === this.activeToolId.left.value)),
    right: vue.computed(() => tools().find(t => t.toolId === (this.activeToolId.right.value ? this.activeToolId.right.value : 'editCard'))),
  }

  useTool(args: { toolId: ToolKeys | '' }) {
    const { toolId } = args
    const t = tools().find(t => t.toolId === toolId)
    const location = t?.location || 'left'
    this.activeToolId[location].value = toolId
  }

  isUsingTool(args: { toolId?: ToolKeys | '', locations?: ('left' | 'right')[] } = {}) {
    const { toolId, locations = ['left', 'right'] } = args
    return locations.some(l => this.activeToolId[l].value === toolId)
  }

  async requestIndex(
    args: { limit?: number, offset?: number, filters?: DataFilter[], imageId?: string } = {},
  ): Promise<{ items: Site[] | undefined, indexMeta?: IndexMeta }> {
    const { limit = 4, offset = 0 } = args || {}

    const r = await this.requests.ManageIndex.projectRequest({ _action: 'list', limit, offset })

    const items = r.data
      ? r.data.map(d => new Site({
        ...d,
        fictionSites: this,
        siteRouter: this.settings.fictionRouterSites || this.settings.fictionRouter,
        isEditable: false,
      }))
      : undefined

    return { items, indexMeta: r.indexMeta }
  }

  getPreviewPath(args: { fictionAdmin: FictionAdmin }) {
    const { fictionAdmin } = args
    return vue.computed(() => {
      const current = fictionAdmin.settings.fictionRouter.current.value
      const { selectorType, selectorId, siteId, subDomain, themeId } = { ...current.query, ...current.params } as Record<string, string>

      const finalSelectorType = selectorType || (siteId ? 'site' : subDomain ? 'domain' : themeId ? 'theme' : 'none')
      const finalSelectorId = selectorId || siteId || subDomain || themeId || 'none'

      return `${fictionAdmin.adminBaseRoute}/preview/${finalSelectorType}/${finalSelectorId}`
    })
  }
}

export function setup(): PluginMain<SitesPluginSettings> {
  return {
    serviceId: 'fictionSites',
    title: 'Sites',
    description: 'Create and manage websites',
    createPlugin: async (_: SitesPluginSettings) => new FictionSites(_),
  }
}
