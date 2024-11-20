import type { colorTheme, Query, vueRouter } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { CardQuerySettings } from './cardQuery.js'
import type { CardOptionsWithStandard, SiteUserConfig } from './schema.js'
import type { Site } from './site.js'
import type { CardConfigPortable, TableCardConfig } from './tables.js'
import type { ComponentConstructor } from './type-utils.js'
import { deepMerge, FictionObject, objectId, setNested, toLabel, vue } from '@fiction/core'
import { z } from 'zod'
import { CardFactory } from './cardFactory.js'
import { getContentWidthClass, getSpacingClass } from './styling.js'
import { siteGoto, siteLink } from './utils/manage.js'

export const CardCategorySchema = z.enum(['basic', 'posts', 'theme', 'stats', 'marketing', 'content', 'layout', 'media', 'navigation', 'social', 'commerce', 'form', 'other', 'special', 'portfolio', 'advanced', 'effect'])

type CardCategory = z.infer<typeof CardCategorySchema>

// Utility type to merge two types
type MergeTypes<T, U> = T & Omit<U, keyof T>

export type CardTemplateSurfaceDefault<T extends string = string> = {
  templateId: T
  userConfig: Record<string, unknown>
  schema: z.AnyZodObject
  queries: Record<string, Query>
  component: ComponentConstructor
}

// Use defaults
type CardTemplateSurface<T> = MergeTypes<T, CardTemplateSurfaceDefault>
type CardTemplateUserConfigAll<T extends CardTemplateSurfaceDefault> = SiteUserConfig & T['userConfig']

type ConfigArgs = { site?: Site, factory: CardFactory }

export type ConfigResponse<S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault> = {
  schema?: CardTemplateSurface<S>[ 'schema' ]
  options?: InputOption[]
  userConfig?: CardTemplateUserConfigAll<S>
  effects?: TableCardConfig[]
  demoPage?: { cards: (CardConfigPortable< CardTemplateUserConfigAll<S>> & { el?: vue.Component })[] }
}

interface CardTemplateSettings<
  S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault,
> {
  root?: string

  templateId: CardTemplateSurface<S>[ 'templateId' ]
  title?: string
  description?: string
  category?: CardCategory[]
  icon?: string
  colorTheme?: typeof colorTheme[number]
  el: CardTemplateSurface<S>[ 'component' ]
  isPublic?: boolean
  isEffect?: boolean
  isPageCard?: boolean // full page wrap
  isContainer?: boolean // ui drawer
  isRegion?: boolean
  options?: InputOption[]
  schema?: CardTemplateSurface<S>[ 'schema' ]
  sections?: Record<string, CardConfigPortable>
  getConfig?: (args: ConfigArgs) => Promise<ConfigResponse<S>>
  getBaseConfig?: (args: CardSettings<CardTemplateUserConfigAll<S>>) => CardTemplateUserConfigAll<S>
  getUserConfig?: (args: ConfigArgs) => Promise<CardTemplateUserConfigAll<S>> | (CardTemplateUserConfigAll<S>)
  getEffects?: (args: ConfigArgs) => Promise<TableCardConfig[]>
  demoPage?: (args: ConfigArgs) => Promise<{
    cards: (CardConfigPortable< CardTemplateUserConfigAll<S>> & { el?: vue.Component })[]
  }>
  getQueries?: (args: CardQuerySettings) => CardTemplateSurface<S>[ 'queries' ]
  getSitemapPaths?: (args: { site: Site, card: Card<CardTemplateUserConfigAll<S>>, pagePath: string }) => Promise<string[]>
  singleCard?: (args: { card: Card }) => CardConfigPortable

}

export class CardTemplate<
  S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault,
> extends FictionObject< CardTemplateSettings<S> > {
  constructor(settings: CardTemplateSettings<S>) {
    super('CardTemplate', { title: toLabel(settings.templateId), ...settings })
  }

  getBaseConfig = this.settings.getBaseConfig || (() => ({ }))

  async getConfig(args: { site?: Site }) {
    const { site } = args
    const factory = new CardFactory({ site, templates: site?.theme.value?.templates || [] })
    const a = { site, factory }
    if (this.settings.getConfig) {
      return this.settings.getConfig(a)
    }
    else {
      return {
        schema: this.settings.schema,
        options: this.settings.options,
        userConfig: await this.settings.getUserConfig?.(a) || {},
        effects: await this.settings.getEffects?.(a) || [],
        demoPage: await this.settings.demoPage?.(a),
      }
    }
  }

  async toCard(args: {
    cardId?: string
    site?: Site
    userConfig?: CardTemplateUserConfigAll<S>
    baseConfig?: CardTemplateUserConfigAll<S>
  } & CardSettings) {
    const { cardId, site, baseConfig = {}, userConfig } = args
    const { getUserConfig, getEffects, getConfig } = this.settings
    const factory = new CardFactory({ site, templates: [this] })

    const config = getConfig ? await getConfig({ ...args, factory }) : {}
    const asyncUserConfig = getUserConfig ? await getUserConfig({ ...args, factory }) : {}
    const effects = getEffects ? (await getEffects({ ...args, factory })) : []

    const specificUserConfig = deepMerge([
      baseConfig,
      asyncUserConfig,
      config.userConfig,
      userConfig,
    ].filter(Boolean))

    // pass user defined values to base config, allowing for adjustments
    const templateBaseConfig = this.getBaseConfig({ ...args, userConfig: specificUserConfig })

    const finalUserConfig = deepMerge([templateBaseConfig, specificUserConfig].filter(Boolean))

    return new Card({
      cardId: cardId || objectId({ prefix: 'crd' }),
      templateId: this.settings.templateId,
      ...args,
      userConfig: finalUserConfig,
      effects,
    })
  }
}

export function cardTemplate<
  TTemplateId extends string,
  TSchema extends z.AnyZodObject,
  TComponent extends ComponentConstructor,
  TQueries extends Record<string, Query> = Record<string, Query>,
>(settings: CardTemplateSettings<{
  templateId: TTemplateId
  component: TComponent
  queries: TQueries
  userConfig: z.infer<TSchema>
  schema: TSchema
}>) {
  return new CardTemplate<{
    templateId: TTemplateId
    userConfig: z.infer<TSchema>
    schema: TSchema
    queries: TQueries
    component: TComponent
  }>(settings)
}

export type CardSettings<T extends Record<string, unknown> = Record<string, unknown> > = CardConfigPortable<T> & {
  site?: Site
  inlineTemplate?: CardTemplate<any>
  el?: ComponentConstructor
  templates?: CardTemplate[] | readonly CardTemplate[]
  onSync?: (card: Card) => void
}
export type CardBaseConfig = CardOptionsWithStandard & SiteUserConfig & Record<string, unknown>

export type CardSurface = {
  requests: {
    [key: string]: { params: unknown, result: unknown }
  }
}

// Use defaults
type Surface<T> = MergeTypes<T, CardSurface>

function getDetaultTemplateId(card: Card): string {
  const inlineTemplateId = card.settings.inlineTemplate ? card.settings.inlineTemplate.settings.templateId : undefined
  return inlineTemplateId || card.settings.templateId || (card.parentId ? 'area' : card.site?.theme.value?.templateDefaults.value.page || 'wrap')
}

export class Card<
  T extends CardBaseConfig = CardBaseConfig,
  U extends CardSurface = CardSurface,
> extends FictionObject<CardSettings<T>> {
  site = this.settings.site
  cardId = this.settings.cardId || objectId({ prefix: 'crd' })
  isHome = vue.ref(this.settings.isHome)
  is404 = vue.ref(this.settings.is404)
  isSystem = vue.ref(this.settings.isSystem)
  parentId = this.settings.parentId
  depth = vue.ref(this.settings.depth || 0)
  index = vue.ref(this.settings.index)
  regionId = this.settings.regionId || 'main'
  layoutId = vue.ref(this.settings.layoutId)
  templateId = vue.ref(getDetaultTemplateId(this))
  title = vue.ref(this.settings.title)
  description = vue.ref(this.settings.description)
  slug = vue.ref(this.settings.slug)
  displayTitle = vue.computed(() => this.title.value || toLabel(this.slug.value))
  userConfig = vue.shallowRef(this.settings.userConfig || {} as T) as vue.Ref<vue.UnwrapRef<T>> // allow passing of components and other complex objects
  fullConfig = vue.computed(() => (deepMerge([
    this.site?.fullConfig.value,
    this.tpl.value?.getBaseConfig(this.settings) || {},
    this.userConfig.value as SiteUserConfig & T,
  ]) as SiteUserConfig & T))

  config = vue.computed({
    get: () => this.fullConfig.value as T,
    set: (value: T) => (this.userConfig.value = vue.ref(value).value),
  })

  cards = vue.shallowRef((this.settings.cards || []).map(c => this.initSubCard({ cardConfig: c })))
  effects = vue.shallowRef((this.settings.effects || []).map(c => this.initSubCard({ cardConfig: c })))

  tpl = vue.computed(() => {
    const templates = [...(this.settings.templates || []), ...(this.site?.theme.value?.templates || [])]
    const foundTemplate = templates.find(t => t.settings.templateId === this.templateId.value)
    if (this.settings.inlineTemplate) {
      return this.settings.inlineTemplate
    }
    else if (foundTemplate) {
      return foundTemplate
    }
    else if (this.settings.el) {
      return new CardTemplate({ el: this.settings.el, templateId: `${this.cardId}-inline` })
    }
  })

  isActive = vue.computed<boolean>(() => this.site?.editor.value.selectedCardId === this.settings.cardId)
  isNotInline = vue.ref(false) // allows cards to break out of inline mode

  constructor(settings: CardSettings<T>) {
    super('Card', settings)
  }

  classes = vue.computed(() => {
    const spacing = this.fullConfig.value?.standard?.spacing

    const contentWidthSize = spacing?.contentWidth || 'md'
    const verticalSpacing = spacing?.verticalSpacing || this.site?.userConfig.value.standard?.spacing?.verticalSpacing || 'md'

    const contentWidthClass = getContentWidthClass({ size: contentWidthSize, padSize: true })
    const verticalSpacingClass = [getSpacingClass({ size: verticalSpacing, direction: 'both' })].join(' ')
    return {
      contentWidth: contentWidthClass,
      verticalSpacing: verticalSpacingClass,
    }
  })

  initSubCard(args: { cardConfig: CardConfigPortable }): Card {
    const { cardConfig } = args
    const card = new Card({
      parentId: this.cardId,
      ...cardConfig,
      depth: this.depth.value + 1,
      site: this.settings.site,
      regionId: this.regionId,
      templates: this.settings.templates,
    })
    return card
  }

  addCard(args: { cardConfig: Partial<TableCardConfig>, location?: 'top' | 'bottom' }) {
    const { cardConfig, location = 'top' } = args
    const card = this.initSubCard({ cardConfig })
    this.cards.value = location === 'top' ? [card, ...this.cards.value] : [...this.cards.value, card]

    this.syncCard({ caller: 'addCard' })
  }

  update(cardConfig: CardConfigPortable<T>, opts: { caller: string }) {
    const { caller } = opts

    this.log.info(`update:${caller}`, { data: cardConfig })
    if (!cardConfig)
      return
    const availableKeys = ['title', 'slug', 'userConfig', 'templateId', 'isHome', 'is404']
    const entries = Object.entries(cardConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof this]))
        (this[key as keyof this] as vue.Ref).value = value

      this.settings = { ...this.settings, [key as keyof T]: value }
    })

    if (cardConfig.cards)
      this.cards.value = cardConfig.cards.map(c => this.initSubCard({ cardConfig: c }))

    this.syncCard({ caller: `updateCard:${this.templateId.value}`, cardConfig })
  }

  updateUserConfig(args: { path: string, value: unknown }) {
    const { path, value } = args

    this.userConfig.value = setNested({ data: this.userConfig.value, path, value })

    this.syncCard({ caller: `updateUserConfig:${this.templateId.value}`, cardConfig: { userConfig: this.userConfig.value } })
  }

  syncCard(args: { caller: string, noSave?: boolean, cardConfig?: CardConfigPortable }) {
    if (!this.site || this.site.siteMode.value === 'standard')
      return

    const cardConfig = args.cardConfig ? { ...args.cardConfig, cardId: this.cardId } : this.toConfig()

    this.site.frame.syncCard({ caller: `card:syncCard:${args.caller}`, cardConfig })

    // allow for parent cards and inherited type functionality
    if (this.settings.onSync) {
      this.settings.onSync(this)
    }

    if (!args.noSave)
      this.site?.autosave()
  }

  link(location?: vueRouter.RouteLocationRaw, opts?: { caller?: string }) {
    if (!location)
      return ''
    return siteLink({ site: this.site, location, ...opts })
  }

  async goto(location: vueRouter.RouteLocationRaw, options: Partial<Parameters<typeof siteGoto>[0]['options']> = { }) {
    return siteGoto({ site: this.site, location, options })
  }

  toConfig(): CardConfigPortable<T> {
    const { site: __, ...rest } = this.settings

    const cards = this.cards.value.filter(_ => !_.isSystem.value).map(c => c.toConfig())
    const effects = this.effects.value.filter(_ => !_.isSystem.value).map(c => c.toConfig())

    return {
      ...rest,
      regionId: this.regionId,
      layoutId: this.layoutId.value,
      templateId: this.templateId.value,
      cardId: this.cardId,
      isHome: !!this.isHome.value,
      is404: !!this.is404.value,
      title: this.title.value,
      description: this.description.value,
      slug: this.slug.value,
      userConfig: this.userConfig.value as T,
      cards,
      effects,
      scope: this.settings.scope,
    }
  }

  cleanup() {
    this.cards.value.forEach(c => c.cleanup())
    this.cards.value = []
  }

  async request<K extends keyof Surface<U>['requests'] = keyof Surface<U>['requests']>(
    key: K,
    params: Surface<U>['requests'][K]['params'],
  ): Promise<Surface<U>['requests'][K]['result']> {
    const site = this.site
    if (!site) {
      throw new Error('Site not found')
    }
    const templateId = this.tpl.value?.settings.templateId
    if (!templateId) {
      throw new Error('CardRequest: Template not found')
    }
    const fictionSites = site.fictionSites
    const themeId = site.theme.value?.themeId

    return fictionSites.requests.CardQuery.request({
      templateId,
      themeId,
      siteId: site.siteId,
      args: params as Record<string, any>,
      queryId: key as string,
    })
  }
}

/**
 * Special Types
 */
// type CreateTuple<T extends readonly CardTemplate[]> = {
//   [P in keyof T]: T[P] extends CardTemplate<infer S> ? [S['templateId'], S['userConfig'] ] : never
// }[number]

// type TupleToObject<T extends [string, any]> = {
//   [P in T[0]]: T extends [P, infer B] ? B : never
// }

// export type TemplateUserConfigMap<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

export type ExtractComponentUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never

export type ExtractCardTemplateUserConfig<T extends CardTemplate<any >> =
    T extends CardTemplate<infer S> ?
      S extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never
      : never
