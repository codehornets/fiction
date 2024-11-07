import type { FictionAdmin } from '@fiction/admin/index.js'
import type { FictionEnv, FictionPluginSettings, ServiceList } from '@fiction/core'
import type { CardTemplate } from './card.js'
import type { SiteUserConfig } from './schema.js'
import type { TableCardConfig } from './tables.js'
import { deepMerge, FictionPlugin, vue } from '@fiction/core'
import { Site, type SiteSettings } from './site.js'
import { imageStyle } from './util.js'

export type ThemeConfig = {
  userConfig: SiteUserConfig
  pages: TableCardConfig[]
  sections: Record<string, TableCardConfig>
}

export type ThemeSettings<T extends Record<string, unknown> = Record<string, unknown>> = {
  root: string
  themeId: string
  title?: string
  version?: string
  description?: string
  screenshot?: string
  templates?: readonly CardTemplate<any>[] | CardTemplate<any>[]
  ui?: UiConfig
  isPublic?: boolean
  userConfig?: Partial<SiteUserConfig> & T
  getConfig: (args: { site: Site }) => Promise<ThemeConfig>
  templateDefaults?: {
    page?: string
    transaction?: string
  }
} & FictionPluginSettings

export type UiItem = { el: vue.Component }
export interface UiConfig { button?: UiItem }

export type ThemeSetup = (args: ServiceList & { fictionEnv: FictionEnv, fictionAdmin: FictionAdmin }) => Promise<Theme>

export class Theme<T extends Record<string, unknown> = Record<string, unknown>> extends FictionPlugin<ThemeSettings<T>> {
  themeId = this.settings.themeId
  templates = this.settings.templates || []
  templateDefaults = vue.computed(() => ({ page: 'wrap', transaction: 'wrap', ...this.settings.templateDefaults }))

  constructor(settings: ThemeSettings<T>) {
    super('Theme', settings)
  }

  async getConfig(args: { site: Site }) {
    const config = await this.settings.getConfig(args)

    const pages = config.pages.map(page => ({ ...page, templateId: page.templateId || this.templateDefaults.value.page }))

    const userConfig = deepMerge([this.defaultConfig(), this.settings.userConfig, config.userConfig])

    return { userConfig, pages, sections: config.sections || {} }
  }

  async toSite(settings: Omit<SiteSettings, 'themeId'>): Promise<Site> {
    const site = await Site.create({ themeId: this.themeId, pages: [], sections: {}, ...settings }, { loadThemePages: true })
    return site
  }

  defaultConfig(): SiteUserConfig {
    return {
      styling: {
        fonts: {
          mono: { fontKey: 'DM Mono', stack: 'monospace' },
          input: { fontKey: 'DM Mono', stack: 'sans' },
          title: { fontKey: 'Poppins', stack: 'sans' },
          sans: { fontKey: 'Plus+Jakarta+Sans', stack: 'sans' },
          body: { stack: 'serif' },
          serif: { stack: 'serif' },
          highlight: { fontKey: 'Caveat', stack: 'sans' },
        },

        isLightMode: false,
      },

      ai: {
        objectives: {
          about: 'Create a compelling narrative about the subject, highlighting key strengths and values.',
          targetCustomer: 'Identify and address the primary audience, their needs, and pain points.',
          imageStyle: imageStyle.find(i => i.name === 'Grayscale')?.value || '',
        },
      },
    }
  }
}
