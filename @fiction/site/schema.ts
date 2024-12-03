import {
  ButtonDesignSchema,
  ButtonHoverSchema,
  ButtonRoundingSchema,
  ColorThemeSchema,
  fontFamilySchema,
  fontStyleSchema,
  HeaderLayoutSchema,
  logoSchema,
  MediaDisplaySchema,
  SizeSchemaComplete,
  superTitleSchema,
  UiOriginSchema,
} from '@fiction/core'
import { z } from 'zod'

export type SizeBasic = z.infer<typeof SizeSchemaComplete>

const KnownFontKeys = ['mono', 'input', 'title', 'sans', 'body', 'serif', 'highlight'] as const

export const prefersColorScheme = ['light', 'dark', 'auto', ''] as const

const baseFontsSchema = z.object(
  Object.fromEntries(KnownFontKeys.map(key => [key, fontFamilySchema.optional()])),
)

// .catchall(). This method allows the schema to accept any additional properties of the specified type.
const fontsSchema = baseFontsSchema.catchall(fontFamilySchema)

const Scheme = z.object({
  bg: MediaDisplaySchema.optional(),
  theme: ColorThemeSchema.optional(),
  primary: ColorThemeSchema.optional(),
})

// Main schema
export const CardStandardSchema = z.object({

  handling: z.object({
    hideOnPage: z.boolean().optional(),
    showOnSingle: z.boolean().optional(),
  }).optional(),

  scheme: z.object({
    light: Scheme.optional(),
    base: Scheme.optional(),
    reverse: z.boolean().optional(),
  }).optional(),

  fontStyle: z.object({
    title: fontStyleSchema.optional(),
    body: fontStyleSchema.optional(),
    highlight: fontStyleSchema.optional(),
  }).optional(),

  spacing: z.object({
    contentWidth: SizeSchemaComplete.optional(),
    contentPad: SizeSchemaComplete.optional(),
    verticalSpacing: SizeSchemaComplete.optional(),
  }).optional(),

  headers: z.object({
    layout: HeaderLayoutSchema.optional(),
    size: SizeSchemaComplete.optional(),
    superTitle: superTitleSchema.optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
  }).optional(),

  effect: z.object({
    origin: UiOriginSchema.optional(),
    size: SizeSchemaComplete.optional(),
    rotation: z.number().min(0).max(360).optional(),
  }).optional(),

  ai: z.object({
    prompt: z.string().optional(),
    fields: z.record(z.object({
      prompt: z.string().optional(),
      isUserEnabled: z.boolean().optional(),
    })).optional(),
  }).optional(),
})

export const CardOptionsWithStandardSchema = z.object({
  standard: CardStandardSchema.optional(),
})

export type CardStandardOptions = z.infer<typeof CardStandardSchema>

export type CardOptionsWithStandard = z.infer<typeof CardOptionsWithStandardSchema>

const ButtonTypeSchema = z.object({
  rounding: ButtonRoundingSchema.optional(),
  design: ButtonDesignSchema.optional(),
  hover: ButtonHoverSchema.optional(),
})

export const SiteUserConfigSchema = z.object({
  site: z.object({
    brand: z.object({
      favicon: MediaDisplaySchema.optional(),
      icon: MediaDisplaySchema.optional(),
      shareImage: MediaDisplaySchema.optional(),
      logo: logoSchema.optional(),
      primaryColor: ColorThemeSchema.optional(),
    }).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.string().optional(),
      robotsTxt: z.string().optional(),
      locale: z.string().optional(),
      titleTemplate: z.string().optional(),
    }).optional(),
    customCode: z.object({
      gtmContainerId: z.string().optional(),
    }).optional(),
    ai: z.object({
      objectives: z.object({
        about: z.string().optional(),
        targetCustomer: z.string().optional(),
        imageStyle: z.string().optional(),
      }).optional(),
    }).optional(),
    styling: z.object({
      isLightMode: z.boolean().optional(),
      fonts: fontsSchema.optional(),
      buttons: ButtonTypeSchema.optional(),
      prefersColorScheme: z.enum(prefersColorScheme).optional(),
    }).optional(),
  }).optional(),
  standard: CardStandardSchema.optional(),
})

export type SiteUserConfig = z.infer<typeof SiteUserConfigSchema>
