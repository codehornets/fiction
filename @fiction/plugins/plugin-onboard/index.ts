import type { FictionAdmin } from '@fiction/admin'
import type { FictionServer } from '@fiction/core'
import type { FictionApp } from '@fiction/core/plugin-app'
import type { FictionEmail } from '@fiction/core/plugin-email'
import type { FictionMedia } from '@fiction/core/plugin-media'
import type { FictionRouter } from '@fiction/core/plugin-router'
import type { FictionUser } from '@fiction/core/plugin-user'
import type { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPlugin, type FictionPluginSettings } from '@fiction/core/plugin.js'
import { safeDirname } from '@fiction/core/utils'
import { getWidgets } from './widgets/widgets'

export type FictionOnboardSettings = {
  fictionEmail: FictionEmail
  fictionTransactions: FictionTransactions
  fictionUser: FictionUser
  fictionMedia: FictionMedia
  fictionApp: FictionApp
  fictionRouter: FictionRouter
  fictionServer: FictionServer
  fictionAdmin: FictionAdmin
} & FictionPluginSettings

export class FictionOnboard extends FictionPlugin<FictionOnboardSettings> {
  constructor(settings: FictionOnboardSettings) {
    super('FictionOnboard', { root: safeDirname(import.meta.url), ...settings })

    this.admin()
  }

  admin() {
    const widgets = getWidgets(this.settings)
    this.settings.fictionAdmin.widgetRegister.value.push(...Object.values(widgets))
    this.settings.fictionAdmin.addToWidgetArea('homeMain', [
      { key: 'overviewWidget', priority: 40 },
    ])
    this.settings.fictionAdmin.addToWidgetArea('homeSecondary', [
      { key: 'onboardWelcome', priority: 40 },
    ])
  }
}
