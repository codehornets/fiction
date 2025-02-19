import type { CardConfigPortable, PageRegion, Site, TableCardConfig } from './index.js'
import type { SiteUserConfig } from './schema.js'
import type { ComponentConstructor } from './type-utils.js'
import { FictionObject } from '@fiction/core'
import { createStockMediaHandler } from '@fiction/ui/stock'
import { CardTemplate } from './card.js'

// type CreateTuple<T extends readonly CardTemplate[]> = {
//   [P in keyof T]: T[P] extends CardTemplate<infer S> ? [NonNullable<S['templateId']>, S['userConfig'] ] : never
// }[number]

// type TupleToObject<T extends [string, any]> = {
//   [P in T[0]]: T extends [P, infer B] ? B : never
// }

// export type TemplateUserConfigMap<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

// export type ExtractComponentUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never

// export type ExtractCardTemplateUserConfig<T extends CardTemplate<any>> =
//     T extends CardTemplate<infer S> ?
//       S['component'] extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never
//       : never

// type UserConfigType<
//   T extends keyof TemplateUserConfigMap<U>,
//   U extends readonly CardTemplate[],
//   W extends CardTemplate | undefined,
//   X extends ComponentConstructor | undefined,
// > = W extends CardTemplate
//   ? TemplateUserConfigMap<U>[T] & SiteUserConfig
//   : X extends ComponentConstructor
//     ? ExtractComponentUserConfig<X>
//     : U extends readonly CardTemplate[] ? TemplateUserConfigMap<U>[T] : Record<string, unknown>

// type CreateCardArgs<
//   T extends keyof TemplateUserConfigMap<U>,
//   U extends readonly CardTemplate[],
//   W extends CardTemplate | undefined,
//   X extends ComponentConstructor | undefined,
// > = {
//   tpl?: W
//   templateId?: T | 'cardPageWrapV1'
//   el?: X
//   userConfig?: UserConfigType<T, U, W, X>
//   baseConfig?: UserConfigType<T, U, W, X>
// } & BaseCardConfig

// type TemplateSurface<T extends CardTemplate | never> = T extends CardTemplate<infer S> ? S : never

// type CardMakeArgs<T extends CardTemplate> = {
//   templateId?: TemplateSurface<T>['templateId']
//   tpl?: T
//   el?: ComponentConstructor
//   userConfig?: TemplateSurface<T>['userConfig'] & SiteUserConfig
//   baseConfig?: TemplateSurface<T>['userConfig'] & SiteUserConfig
//   effects?: CardConfigPortable[]
// } & BaseCardConfig

type BaseCardConfig = {
  regionId?: PageRegion
  layoutId?: string
  cards?: CardConfigPortable[]
  cardId?: string
  isSystem?: boolean
  slug?: string
  title?: string
  description?: string
  isHome?: boolean
  is404?: boolean
}

type CardFactorySettings<U extends readonly CardTemplate[]> = {
  templates: U
  site?: Site
  caller: string
}

type ExtractTemplateInfo<T extends CardTemplate> = {
  templateId: T extends CardTemplate<infer S> ? S['templateId'] : never
  userConfig: T extends CardTemplate<infer S> ? S['userConfig'] : never
}

export class CardFactory<U extends readonly CardTemplate<any>[] = readonly CardTemplate<{ userConfig: SiteUserConfig }>[]> extends FictionObject<CardFactorySettings<U>> {
  templates: U
  caller: string

  constructor(settings: CardFactorySettings<U>) {
    super('CardFactory', settings)

    this.templates = this.settings.templates
    this.caller = this.settings.caller || 'CardFactory(Unknown)'
  }

  async getStockMedia() {
    return createStockMediaHandler()
  }

  async fromTemplate<
    TTemplate extends CardTemplate<any> | U[number] = U[number],
  >(args: {
    // Template identification
    templateId?: ExtractTemplateInfo<TTemplate>['templateId']
    tpl?: TTemplate
    el?: ComponentConstructor

    // Config
    userConfig?: ExtractTemplateInfo<TTemplate>['userConfig'] & SiteUserConfig
    baseConfig?: ExtractTemplateInfo<TTemplate>['userConfig'] & SiteUserConfig
    effects?: CardConfigPortable[]
    // Base card properties
  } & BaseCardConfig,
  ): Promise<TableCardConfig> {
    const { tpl, el, userConfig, baseConfig } = args

    const templateId = args.templateId || (args.slug ? 'cardPageWrapV1' : 'cardPageAreaV1')

    if (!templateId && !tpl)
      throw new Error('CardFactory: templateId or tpl required')

    const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-inline` }) : undefined)

    const template = inlineTemplate || this.templates?.find(template => template.settings.templateId === templateId)

    // Ensure that 'templates' contains 'templateId'
    if (!template) {
      this.log.error(
        `Template with key "${templateId}" not found in provided templates (${this.caller})`,
        { data: { templateId, templates: this.templates.map(_ => _.settings.templateId) } },
      )
      return { templateId: 'cardHeroV1', userConfig: { heading: `Template not found (${templateId})` } }
    }

    const createdCard = await template.toCard({
      ...args,
      inlineTemplate,
      site: this.settings.site,
      userConfig,
      baseConfig,
    }, { factory: this })

    return createdCard.toConfig() as TableCardConfig
  }

  // async create<
  //   T extends keyof TemplateUserConfigMap<U>,
  //   W extends CardTemplate | undefined,
  //   X extends ComponentConstructor | undefined,
  // >(
  //   args: CreateCardArgs<T, U, W, X>,
  // ): Promise<TableCardConfig> {
  //   const { tpl, el, userConfig, baseConfig } = args

  //   const templateId = args.templateId || (args.slug ? 'cardPageWrapV1' : 'cardPageAreaV1')

  //   if (!templateId && !tpl)
  //     throw new Error('CardFactory: templateId or tpl required')

  //   const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-inline` }) : undefined)

  //   const template = inlineTemplate || this.templates?.find(template => template.settings.templateId === templateId)

  //   // Ensure that 'templates' contains 'templateId'
  //   if (!template) {
  //     log.error('CardFactory', `Template with key "${templateId}" not found in provided templates.`)
  //     return { templateId: 'cardHeroV1', userConfig: { heading: `Template not found (${templateId})` } }
  //   }

  //   const createdCard = await template.toCard({ ...args, inlineTemplate, site: this.settings.site, userConfig, baseConfig })

  //   return createdCard.toConfig() as TableCardConfig
  // }
}
