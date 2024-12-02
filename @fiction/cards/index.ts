import type { FictionEnv, FictionPluginSettings, FictionRouter } from '@fiction/core'
import type { FictionSites } from '@fiction/site'
import type { CardTemplate } from '@fiction/site/card'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { Site } from '@fiction/site/site.js'
import { envConfig, FictionPlugin, safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import { generateCardStructure } from './utils/generateStructure'

// Register path for tailwindcss to scan for styles
envConfig.register({
  name: 'CARD_UI_ROOT',
  onLoad: ({ fictionEnv }) => fictionEnv.addUiRoot(safeDirname(import.meta.url)),
})

// Template imports organized by category
export const templates = {
  layout: {
    wrap: () => import('./wrap'),
    area: () => import('./area'),
    nav: () => import('./nav'),
    footer: () => import('./footerPro'),
    footerX: () => import('./footerX'),
  },
  content: {
    hero: () => import('./hero'),
    story: () => import('./story'),
    quote: () => import('./quotes'),
    profile: () => import('./profile'),
    features: () => import('./features'),
    faq: () => import('./faq'),
    statement: () => import('./statement'),
    testimonials: () => import('./testimonials'),
    metrics: () => import('./metrics'),
    people: () => import('./people'),
    logos: () => import('./logos'),
    numberedList: () => import('./numberedList'),
    bento: () => import('./bento'),
    timeline: () => import('./timeline'),
  },
  posts: {
    postList: () => import('./postList'),
    magazine: () => import('./magazine'),
    insta: () => import('./insta'),
  },
  media: {
    cinema: () => import('./cinema'),
    gallery: () => import('./gallery'),
    contentModal: () => import('./contentModal'),
    showcase: () => import('./showcase'),
  },
  interactive: {
    capture: () => import('./capture'),
    contact: () => import('./contact'),
    map: () => import('./maps'),
    pricing: () => import('./pricing'),
    tour: () => import('./tour'),
    ctaAlpha: () => import('./callToAction'),
  },
  effects: {
    effectShape: () => import('./effectShape'),
    fitText: () => import('./fitText'),
    marquee: () => import('./marquee'),
    overSlide: () => import('./overSlide'),
    textEffects: () => import('./textEffects'),
    ticker: () => import('./ticker'),
    trek: () => import('./trek'),
  },
  special: {
    four04: () => import('./404'),
    transaction: () => import('./transactions'),
  },
} as const

// Type utilities for template configuration
type TemplateModule = { template: CardTemplate<any> }

async function getTemplateModules() {
  const loadedTemplates: Record<string, TemplateModule> = {}
  const loadErrors: Record<string, Error> = {}

  // Flatten the nested template structure for parallel loading
  const templateEntries = Object.values(templates).flatMap(category =>
    Object.entries(category).map(([key, importFn]) => ({ key, importFn })),
  )

  // Load all templates in parallel with error handling
  const results = await Promise.allSettled(
    templateEntries.map(async ({ key, importFn }) => {
      try {
        const module = await importFn()
        return { key, module }
      }
      catch (error) {
        loadErrors[key] = error instanceof Error ? error : new Error('Unknown error loading template')
        throw error
      }
    }),
  )

  // Process results and populate loadedTemplates
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { key, module } = result.value
      loadedTemplates[key] = module
    }
  })

  // Log any errors that occurred during loading
  if (Object.keys(loadErrors).length > 0) {
    console.error('Template loading errors:', loadErrors)
  }

  return loadedTemplates
}

// Main template getter
export async function getCardTemplates(): Promise<CardTemplate<any>[]> {
  const modules = await getTemplateModules()

  return [
    ...Object.values(modules).map(m => m.template),
  ]
}

// Demo templates for UI components
const demoTemplates = {
  buttons: {
    templateId: 'xbutton',
    title: 'Buttons',
    description: 'Standard button styles',
    icon: 'i-tabler-square-rounded-chevron-right-filled',
    component: () => import('@fiction/ui/buttons/test/TestButtonsAll.vue'),
  },
  inputs: {
    templateId: 'xinput',
    title: 'Inputs',
    description: 'Standard input styles',
    icon: 'i-tabler-input-check',
    component: () => import('@fiction/ui/inputs/test/TestInputsAll.vue'),
  },
  logo: {
    templateId: 'xlogo',
    title: 'Logo Component',
    description: 'Standard logo handling',
    icon: 'i-tabler-brand-apple',
    component: () => import('@fiction/ui/test/TestLogoHandling.vue'),
  },
  media: {
    templateId: 'xmedia',
    title: 'Media Component',
    description: 'Standard media handling',
    icon: 'i-tabler-photo-hexagon',
    component: () => import('@fiction/ui/test/TestMediaHandling.vue'),
  },
}

// Create demo templates
function createDemoTemplate(config: typeof demoTemplates[keyof typeof demoTemplates]) {
  return cardTemplate({
    ...config,
    category: ['advanced'],
    el: vue.defineAsyncComponent(config.component),
    isPublic: false,
  })
}

// Get demo pages
export async function getDemoPages(args: {
  site: Site
  templates: CardTemplate<any>[] | readonly CardTemplate<any>[]
  fictionEnv?: FictionEnv
  factory: CardFactory
}) {
  const { createDemoPage } = await import('./utils/demo')
  const demoTemplatesList = Object.values(demoTemplates).map(createDemoTemplate)
  const allTemplates = [...demoTemplatesList, ...args.templates]

  const demoPagePromises = allTemplates.map(async (template) => {
    const config = await template.getConfig(args)
    const demoCard = config.demoPage || {}
    return createDemoPage({ site: args.site, template, card: demoCard })
  })

  return await Promise.all(demoPagePromises)
}

export type CardsPluginSettings = {
  fictionEnv: FictionEnv
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
} & FictionPluginSettings

export class FictionCards extends FictionPlugin<CardsPluginSettings> {
  constructor(settings: CardsPluginSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionCards', s)
  }

  override setup() {
    this.addStructureFile()
  }

  addStructureFile() {
    this.fictionEnv.generators.push(async () => {
      const cardTemplates = await getCardTemplates()

      const results = await generateCardStructure({
        templates: cardTemplates,
        fictionSites: this.settings.fictionSites,
        fictionRouterSites: this.settings.fictionRouterSites,
      })

      return { fileName: 'cardStructure.json', content: results.json }
    })
  }
}
