import type { FictionServer } from '@fiction/core'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { TableCardConfig } from '@fiction/site/index.js'
import type { template as dashTemplate, panelTemplate } from './dashboard/cardDash.js'
import type { Widget } from './dashboard/widget.js'
import type { WidgetLocation } from './types.js'
import { envConfig } from '@fiction/core'
import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin.js'
import { safeDirname, vue } from '@fiction/core/utils'
import { createWidgetEndpoints } from './dashboard/util.js'
import { getEmails } from './emails/index.js'

export * from './tools/tools.js'
export * from './types.js'

envConfig.register({ name: 'ADMIN_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

type FictionAdminSettings = {
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
} & FictionPluginSettings

type PageLoader = (args: { factory: CardFactory }) => (Promise<TableCardConfig[]> | TableCardConfig[])

export type WidgetFactoryEntry = { key: string, priority?: number }

export class FictionAdmin extends FictionPlugin<FictionAdminSettings> {
  widgetRequests?: ReturnType<typeof createWidgetEndpoints>
  constructor(settings: FictionAdminSettings) {
    super('FictionAdmin', { root: safeDirname(import.meta.url), ...settings })
  }

  emailActions = getEmails({ fictionAdmin: this })

  widgetRegister = vue.shallowRef<Widget[]>([])
  widgetMapRaw = vue.shallowRef<Record<string, WidgetFactoryEntry[]>>({})
  addToWidgetArea<T extends WidgetFactoryEntry[] = WidgetFactoryEntry[]>(widgetArea: WidgetLocation, widgetKeys: T) {
    this.widgetMapRaw.value[widgetArea] = this.widgetMapRaw.value[widgetArea] ?? []
    this.widgetMapRaw.value[widgetArea]?.push(...widgetKeys)
  }

  adminPageLoaders = vue.shallowRef<PageLoader[]>([async ({ factory }) => [
    await factory.fromTemplate<typeof dashTemplate>({
      templateId: 'dash',
      slug: '_home',
      isHome: true,
      title: 'Home',
      cards: [
        await factory.fromTemplate<typeof panelTemplate>({
          el: vue.defineAsyncComponent(async () => import('./dashboard/ViewDashboard.vue')),
        }),
      ],
      userConfig: { isNavItem: true, navIcon: 'i-heroicons-home', navIconAlt: 'i-heroicons-home-20-solid', priority: 0 },
    }),
  ]])

  async getAdminPages(args: { factory: CardFactory }): Promise<TableCardConfig[]> {
    const { factory } = args
    const pages = await Promise.all(this.adminPageLoaders.value.map(async loader => loader({ factory })))

    return pages.flat()
  }

  addAdminPages(args: { key: string, loader: PageLoader }) {
    const { loader } = args
    this.adminPageLoaders.value.push(loader)
  }

  override async setup() {
    this.widgetRequests = createWidgetEndpoints({ fictionAdmin: this })
  }

  hooks() {
    const fictionUser = this.settings.fictionUser

    fictionUser.events.on('newUser', async (_event) => {
      // const { user, params } = event.detail

      // if (params.isVerifyEmail) {
      //   await this.emailActions.verifyEmailAction.serveSend({ recipient: user, queryVars: { code: user.verify?.code || '', email: user.email || '' } }, { server: true })
      // }
    })
  }
}
