import type { FictionRouter } from '@fiction/core'
import type { FictionSites } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import { shortId } from '@fiction/core'
import { Site } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'

export class CardStructureGenerator {
  templates: CardTemplate[]
  site: Site
  factory: CardFactory
  mode?: 'simple' | 'complete'
  constructor(args: {
    templates: CardTemplate[]
    site: Site
    factory: CardFactory
    mode?: 'simple' | 'complete'
  }) {
    this.templates = args.templates
    this.site = args.site
    this.factory = args.factory
    this.mode = args.mode || 'simple'
  }

  private async processTemplate(template: CardTemplate) {
    const { settings } = template

    const { zodToSimpleSchema } = await import('@fiction/site/utils/schema')

    const site = this.site
    const factory = this.factory

    let out: Record<string, any> = {
      templateId: settings.templateId,
      title: settings.title,
      description: settings.description || 'NO_DESCRIPTION',
      subTitle: settings.subTitle || 'NO_SUBTITLE',
      category: settings.category,
      icon: settings.icon,
      colorTheme: settings.colorTheme,
      isPublic: settings.isPublic,
    }

    if (this.mode === 'complete') {
      const config = settings.getConfig
        ? await settings.getConfig({ site, factory })
        : {}

      // Process schema if available
      const schemaStructure = config.schema
        ? await zodToSimpleSchema(config.schema)
        : undefined

      out = { ...out, schema: schemaStructure, demoPage: config.demoPage?.cards[0] }
    }

    return out
  }

  async generateStructure() {
    const structure = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      templates: await Promise.all(this.templates.map(t => this.processTemplate(t))),
    }

    return {
      json: JSON.stringify(structure, null, 2),
      data: structure,
    }
  }
}

export async function generateCardStructure(args: {
  templates: CardTemplate[]
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
}) {
  const { templates, fictionSites, fictionRouterSites } = args

  const site = await Site.create({
    fictionSites,
    siteRouter: fictionRouterSites,
    themeId: 'minimal',
    isProd: false,
    siteId: `generate-${shortId()}`,
  })

  const factory = new CardFactory({ site, templates: site.theme.value.templates, caller: 'generateCardStructure' })

  const generator = new CardStructureGenerator({ templates, site, factory })
  return await generator.generateStructure()
}
