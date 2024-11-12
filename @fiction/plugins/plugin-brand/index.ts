import type { FictionAdmin } from '@fiction/admin'
import type { FictionDb, FictionEmail, FictionEnv, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { ManageBrandGuideQuery } from './endpoint'
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
  queries = {
    ManageBrandGuide: new ManageBrandGuideQuery({ fictionBrand: this, ...this.settings }),
  }

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
                title: 'Brand Library',
                description: 'Manage your brand guides and AI content models',
                el: vue.defineAsyncComponent(async () => import('./admin/IndexList.vue')),
                userConfig: {
                  isNavItem: true,
                  navIcon: 'i-tabler-briefcase',
                  navIconAlt: 'i-tabler-briefcase-2',
                },
              }),
            ],
          }),
        ],
        userConfig: {
          isNavItem: true,
          navIcon: 'i-tabler-briefcase',
          navIconAlt: 'i-tabler-briefcase-2',
          priority: 200,
        },
      }),
      await factory.create({
        templateId: 'dash',
        slug: 'manage-brand',
        title: 'Brand Editor',
        cards: [
          await factory.create({
            el: vue.defineAsyncComponent(async () => import('./admin/ViewManageBrand.vue')),
            cards: [
              await factory.create({
                slug: '_home',
                title: 'Brand Guidelines', // More specific than just 'Guide'
                description: 'Define your brand identity and style guidelines',
                el: vue.defineAsyncComponent(() => import('./admin/ManageOverview.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-arrow-guide' },
              }),
              await factory.create({
                slug: 'model',
                title: 'AI Knowledge Base', // More intuitive than 'Content Model'
                description: 'Train AI with your brand voice and content guidelines',
                el: vue.defineAsyncComponent(async () => import('./admin/ManageModel.vue')),
                userConfig: { isNavItem: true, navIcon: 'i-tabler-search' },
              }),
            ],
          }),
        ],
        userConfig: { parentNavItemSlug: 'brand' },
      }),

    ] })
  }
}
