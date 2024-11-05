import type { FictionAdmin } from '@fiction/admin'
import type { FictionSites, SitesPluginSettings } from '..'
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { getWidgets } from './widgets/index.js'

export type FictionSiteBuilderSettings = {
  fictionSites: FictionSites
  fictionAdmin: FictionAdmin
} & SitesPluginSettings

export class FictionSiteBuilder extends FictionPlugin<FictionSiteBuilderSettings> {
  constructor(settings: FictionSiteBuilderSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSiteBuilder', s)

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings
    const widgets = getWidgets(this.settings)
    const w = Object.values(widgets)
    fictionAdmin.widgetRegister.value.push(...w)
    fictionAdmin.addToWidgetArea('homeMain', w.map(widget => widget.key))
  }
}
