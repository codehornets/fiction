import type { FictionAdmin } from '@fiction/admin'
import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { brandTable } from './schema'

export type FictionBrandSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionAdmin: FictionAdmin
  fictionRouter: FictionRouter
  fictionMedia: FictionMedia
} & FictionPluginSettings

export class FictionBrand extends FictionPlugin<FictionBrandSettings> {
  queries = { }

  requests = this.createRequests({ queries: this.queries, fictionServer: this.settings.fictionServer, fictionUser: this.settings.fictionUser, basePath: '/send' })

  constructor(settings: FictionBrandSettings) {
    super('FictionBrand', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionDb.addTables([brandTable])

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings

    fictionAdmin.addAdminPages({ key: 'send', loader: async ({ factory }) => [
      await factory.create({
        templateId: 'dash',
        slug: 'brand',
        title: 'Brand',
        cards: [
          await factory.create({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageIndex.vue')),
            cards: [
              await factory.create({
                slug: '_home',
                title: 'All Models',
                description: 'All brand models you\'ve created',
                el: vue.defineAsyncComponent(async () => import('./admin/IndexList.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-icons', navIconAlt: 'i-tabler-icons' },
              }),
            ],
          }),
        ],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-icons', navIconAlt: 'i-tabler-icons', priority: 200 },
      }),
      await factory.create({
        templateId: 'dash',
        slug: 'manage-brand',
        title: 'Manage Brand',
        cards: [
          await factory.create({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageBrand.vue')),
            cards: [
              await factory.create({
                slug: '_home',
                title: 'Guide',
                description: 'Settings for your brand guide',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageOverview.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-icons', navIconAlt: 'i-tabler-icons' },
              }),
              await factory.create({
                slug: 'model',
                title: 'Content Model',
                description: 'Create AI reference models for your content and information',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageModel.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
              }),
            ],
          }),
        ],
        userConfig: { parentNavItemSlug: 'brand' },
      }),

    ] })
  }
}
