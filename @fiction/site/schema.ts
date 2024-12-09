import type { EditorState } from './site'
import type { CardConfigPortable } from './tables'
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
  SuperTitleSchema,
  UiOriginSchema,
} from '@fiction/core'
import { z } from 'zod'

export type SizeBasic = z.infer<typeof SizeSchemaComplete>

export const prefersColorScheme = ['light', 'dark', 'auto', ''] as const

const baseFontsSchema = z.object({
  title: fontFamilySchema.optional(),
  body: fontFamilySchema.optional(),
  sans: fontFamilySchema.optional(),
  serif: fontFamilySchema.optional(),
  mono: fontFamilySchema.optional(),
  input: fontFamilySchema.optional(),
  highlight: fontFamilySchema.optional(),
})

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
    superTitle: SuperTitleSchema.optional(),
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
    title: z.string().optional(),
    description: z.string().optional(),
    robotsTxt: z.string().optional(),
    locale: z.string().optional(),
    titleTemplate: z.string().optional(),
    timezone: z.string().optional(),
    favicon: MediaDisplaySchema.optional(),
    icon: MediaDisplaySchema.optional(),
    shareImage: MediaDisplaySchema.optional(),
    logo: logoSchema.optional(),
    gtmContainerId: z.string().optional(),
    fonts: fontsSchema.optional(),
    buttons: ButtonTypeSchema.optional(),
    prefersColorScheme: z.enum(prefersColorScheme).optional(),
    primaryColor: ColorThemeSchema.optional(),

  }).optional(),
  standard: CardStandardSchema.optional(),
})

export type SiteUserConfig = z.infer<typeof SiteUserConfigSchema>

export const SiteSchema = z.object({
  siteId: z.string(),
  userId: z.string().optional(),
  orgId: z.string(),
  title: z.string().optional(),
  themeId: z.string().optional(),
  subDomain: z.string().optional(),
  customDomains: z.array(z.any()).optional(),
  status: z.enum(['pending', 'active', 'inactive']).optional().default('pending'),
  userConfig: SiteUserConfigSchema.optional(),
  userPrivate: z.record(z.unknown()).optional(),
  editor: z.record(z.unknown()).optional(),
  sections: z.record(z.unknown()).optional(),
  draft: z.record(z.unknown()).optional(),
}).strict()
