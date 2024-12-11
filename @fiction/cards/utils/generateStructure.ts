import type { FictionRouter } from '@fiction/core'
import type { FictionSites } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
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

  private async filterAiSchema(schema: Record<string, any>): Promise<Record<string, any>> {
    const processValue = (value: any): string | undefined => {
      if (!value?.description?.includes('[ai]'))
        return undefined

      return `${value.type}${value.description ? `, ${value.description}` : ''}`
    }

    const processObject = (obj: Record<string, any>): Record<string, any> => {
      const result: Record<string, any> = {}

      for (const [key, value] of Object.entries(obj)) {
        // Skip internal properties
        if (key.startsWith('_'))
          continue

        if (value?.type === 'object' && value.properties) {
          const nested = processObject(value.properties)
          if (Object.keys(nested).length > 0)
            result[key] = nested
          continue
        }

        if (value?.type === 'array' && value.items?.properties) {
          const nested = processObject(value.items.properties)
          if (Object.keys(nested).length > 0)
            result[key] = [nested]
          continue
        }

        const processedValue = processValue(value)
        if (processedValue)
          result[key] = processedValue
      }

      return result
    }

    return processObject(schema)
  }

  private async processTemplate(template: CardTemplate) {
    const { settings } = template
    const site = this.site
    const factory = this.factory

    const out: Record<string, any> = {
      templateId: settings.templateId,
      title: settings.title,
      description: settings.description || 'NO_DESCRIPTION',
      subTitle: settings.subTitle || 'NO_SUBTITLE',
      category: settings.category,
      icon: settings.icon,
      colorTheme: settings.colorTheme,
      isPublic: settings.isPublic,
    }

    const config = settings.getConfig
      ? await settings.getConfig({ site, factory, templateId: settings.templateId || 'NO_TEMPLATE_ID' })
      : {}

    if (config.schema) {
      const { zodToJsonSchema } = await import('zod-to-json-schema')
      const jsonSchema = zodToJsonSchema(config.schema, { $refStrategy: 'none' }) as JsonSchema7ObjectType
      const aiSchema = await this.filterAiSchema(jsonSchema.properties || {})
      if (Object.keys(aiSchema).length > 0)
        out.aiSchema = aiSchema
    }

    // Optionally include demo if needed
    if (config.demoPage?.cards?.[0]) {
      const demoCard = config.demoPage.cards[0]
      out.demo = {
        templateId: demoCard.templateId,
        title: demoCard.title,
        description: demoCard.description,
      }
    }

    return out
  }

  async generateStructure() {
    const structure = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      templates: await Promise.all(
        this.templates
          .filter(t => t.settings.isPublic)
          .map(t => this.processTemplate(t)),
      ),
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

  const factory = new CardFactory({
    site,
    templates: site.theme.value.templates,
    caller: 'generateCardStructure',
  })

  const generator = new CardStructureGenerator({ templates, site, factory })
  return await generator.generateStructure()
}
