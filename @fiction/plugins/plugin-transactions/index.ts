import type { FictionApp, FictionDb, FictionEmail, FictionMedia, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'

import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { EmailAction } from './action'

import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardFactory } from '@fiction/site/cardFactory'
import { EndpointEmailAction } from './endpoint'

export * from './action'

type FictionTransactionsSettings = {
  fictionEmail: FictionEmail
  fictionUser: FictionUser
  fictionServer: FictionServer
  fictionMedia?: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionMonitor?: FictionMonitor
  fictionDb: FictionDb
} & FictionPluginSettings

export class FictionTransactions extends FictionPlugin<FictionTransactionsSettings> {
  transactionSlug = '__transaction'
  queries = {
    EmailAction: new EndpointEmailAction({ fictionTransactions: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionTransactionsSettings) {
    super('FictionTransactions', { root: safeDirname(import.meta.url), ...settings })

    this.settings.fictionEnv.addHook({
      hook: 'setPages',
      caller: 'emailActions',
      context: 'app',
      callback: async (pages, site) => {
        const theme = site?.theme.value
        const transactionTemplateId = theme?.templateDefaults.value.transaction || 'pageWrap'

        if (!theme?.templates || !theme.templates.find(_ => _.settings.templateId === transactionTemplateId))
          return pages

        const factory = new CardFactory({ templates: theme.templates, site, caller: 'setPages' })

        return [
          ...pages,
          await factory.fromTemplate({
            isSystem: true, // prevent saving
            cardId: this.transactionSlug,
            slug: this.transactionSlug,
            templateId: transactionTemplateId,
            cards: [
              await factory.fromTemplate({
                templateId: 'emailAction',
                el: vue.defineAsyncComponent(async () => import('./ElEmailAction.vue')),
                userConfig: { standard: { showOnSingle: true } },
              }),
            ],
          }),
        ]
      },
    })
  }

  emailActions: Record<string, EmailAction> = {}
}
