import type { FictionRouter } from '@fiction/core'
import type { FictionSites, Theme } from '@fiction/site'

export class ThemeStructureGenerator {
  themes: Theme[]
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  mode?: 'simple' | 'complete'
  constructor(args: {
    themes: Theme[]
    fictionSites: FictionSites
    fictionRouterSites: FictionRouter
    mode?: 'simple' | 'complete'
  }) {
    this.themes = args.themes
    this.fictionSites = args.fictionSites
    this.fictionRouterSites = args.fictionRouterSites
    this.mode = args.mode || 'simple'
  }

  private async processTheme(theme: Theme) {
    const { settings } = theme

    const out: Record<string, any> = {
      themeId: settings.themeId,
      title: settings.title,
      description: settings.description || 'NO_DESCRIPTION',
      subTitle: settings.subTitle || 'NO_SUBTITLE',
      category: settings.category,
      icon: settings.icon,
      colorTheme: settings.colorTheme,
      isPublic: settings.isPublic,
    }

    return out
  }

  async generateStructure() {
    const structure = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      templates: await Promise.all(this.themes.map(t => this.processTheme(t))),
    }

    return {
      json: JSON.stringify(structure, null, 2),
      data: structure,
    }
  }
}

export async function generateThemeStructure(args: {
  themes: Theme[]
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
}) {
  const { themes, fictionSites, fictionRouterSites } = args

  const generator = new ThemeStructureGenerator({ themes, fictionSites, fictionRouterSites })
  return await generator.generateStructure()
}
