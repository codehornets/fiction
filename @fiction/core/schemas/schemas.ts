import type { IconName } from '@fiction/ui/lib/systemIcons.js'
import type { vue } from '../utils/libraries.js'
import { z } from 'zod'
import { OrFilterGroupSchema } from '../types/endpoint.js'
import { ColorScaleSchema, colorThemeUser, colorThemeWithInvert } from '../utils/colors.js'

export const PostStatusSchema = z.enum(['draft', 'scheduled', 'published', 'hidden', 'protected', 'deleted', 'archived', 'trashed', 'spam'])
export const ProgressStatusSchema = z.enum(['pending', 'requested', 'processing', 'ready', 'error', 'cancelled'])
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>
export const SyndicateStatusSchema = z.enum(['active', 'unsubscribed', 'pending', 'cancelled', 'bounced', 'complained'])
export const ColorThemeSchema = z.enum(colorThemeWithInvert)
export const ImageFiltersSchema = z.enum(['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'])
export type ImageFilter = z.infer<typeof ImageFiltersSchema>

export const SizeSchema = z.enum(['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export const SizeSchemaComplete = z.enum(['none', 'full', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'])
export type StandardSize = z.infer<typeof SizeSchema>
export type StandardSizeComplete = z.infer<typeof SizeSchemaComplete>
export const UiOriginSchema = z.enum(['topLeft', 'topCenter', 'topRight', 'middleLeft', 'middleCenter', 'middleRight', 'bottomLeft', 'bottomCenter', 'bottomRight'])
export const FontWeightsSchema = z.enum(['400', '500', '600', '700', '800'])
export const BackgroundRepeatSchema = z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y'])
export const BackgroundPositionSchema = z.enum(['center', 'top', 'bottom', 'left', 'right'])
export const BackgroundSizeSchema = z.enum(['cover', 'contain', 'auto'])
export const BlendModesSchema = z.enum(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'])
export const HeaderLayoutSchema = z.enum(['left', 'right', 'center', 'justify'])
export const ButtonColorThemeSchema = z.enum(colorThemeUser)
export const ButtonFormatSchema = z.enum(['block', 'spread', 'default'])
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'link'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])
export const AspectRatioSchema = z.enum(['square', 'portrait', 'landscape', 'golden', 'wide', 'tall', 'cinema', 'panorama'])

// Inferred types
export type ButtonFormat = z.infer<typeof ButtonFormatSchema>
export type ButtonDesign = z.infer<typeof ButtonDesignSchema>
export type ButtonRounding = z.infer<typeof ButtonRoundingSchema>
export type ButtonHover = z.infer<typeof ButtonHoverSchema>
export type ButtonShadow = z.infer<typeof ButtonShadowSchema>
export type ButtonFontWeight = z.infer<typeof ButtonFontWeightSchema>
export type ButtonBorder = z.infer<typeof ButtonBorderSchema>

// So it works in node
const MouseEventType = typeof MouseEvent !== 'undefined' ? MouseEvent : class {}

const ClickHandlerSchema = z.function()
  .args(
    z.object({
      event: z.instanceof(MouseEventType).optional(),
      item: z.record(z.any()).optional(),
      props: z.record(z.string(), z.any()).optional(),
    }),
  )
  .returns(z.any())

export const fontFamilySchema = z.object({
  family: z.string().optional(),
  stack: z.enum(['monospace', 'sans', 'serif']).optional(),
  variants: z.array(z.string()).optional(),
  source: z.enum(['google', 'system']).optional(),
})

export type FontFamily = z.infer<typeof fontFamilySchema>

export const fontStyleSchema = z.object({
  family: z.string().optional(),
  weight: FontWeightsSchema.optional(),
})
export const GradientPointSchema = z.object({
  color: z.string().optional(),
  percent: z.number().min(0).max(100).optional(),
  theme: ColorThemeSchema.optional(),
  scale: ColorScaleSchema.optional(),
  opacity: z.number().min(0).max(1).optional(),
})
export type GradientPoint = z.infer<typeof GradientPointSchema>
export const GradientSettingSchema = z.object({
  angle: z.number().min(0).max(360).optional(),
  stops: z.array(GradientPointSchema).optional(),
  css: z.string().optional(),
})
export type GradientSetting = z.infer<typeof GradientSettingSchema>
export const OverlaySettingSchema = z.object({
  gradient: GradientSettingSchema.optional(),
  opacity: z.number().min(0).max(1).optional(),
  blendMode: BlendModesSchema.optional(),
  color: z.string().optional(),
})
export const ImageFilterConfigSchema = z.object({
  filter: ImageFiltersSchema.optional(),
  percent: z.number().min(0).max(100).optional(),
  value: z.string().optional(),
})
export type ImageFilterConfig = z.infer<typeof ImageFilterConfigSchema>

export const MediaFormat = z.enum(['url', 'image', 'video', 'iframe', 'html', 'component', 'iconId', 'iconClass', 'typography'])

// MediaBasic schema
export const MediaBasicSchema = z.object({
  html: z.string().optional(),
  url: z.string().optional(),
  format: MediaFormat.optional(),
  alt: z.string().optional(),

  el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
    return typeof val === 'function' || val instanceof Promise
  }, { message: 'Must be an async component or Promise' }).optional(),
  props: z.record(z.string(), z.any()).optional(),
  aspect: AspectRatioSchema.optional(),
})

export const MediaIconSchema = MediaBasicSchema.extend({
  iconId: z.string().optional().describe('iconId is common icon name (e.g. user, check, lock)') as z.Schema<IconName | undefined>,
  class: z.string().optional().describe('tabler iconify class i-tabler-[icon-name]'),
})

export const typographySchema = z.object({
  label: z.string().optional(),
  weight: z.string().optional(),
  lineHeight: z.string().optional(),
  letterSpacing: z.string().optional(),
  font: fontFamilySchema.optional(),
})

export type TypographyObject = z.infer<typeof typographySchema>

// MediaContent schema (includes MediaBasic)
export const MediaContentSchema = MediaIconSchema.extend({

  caption: z.string().optional(),
  mime: z.string().optional(),
  blurhash: z.string().optional(),
  thumbUrl: z.string().optional(),
})

// MediaDisplaySchema (extends MediaContent with display properties)
export const MediaDisplaySchema = MediaContentSchema.extend({
  backgroundColor: z.string().optional(),
  gradient: GradientSettingSchema.optional(),
  backgroundRepeat: BackgroundRepeatSchema.optional(),
  backgroundPosition: BackgroundPositionSchema.optional(),
  backgroundSize: BackgroundSizeSchema.optional(),
  filters: z.array(ImageFilterConfigSchema).optional(),
  overlay: OverlaySettingSchema.optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  tags: z.array(z.string()).optional(),
  displayWidthPercent: z.number().optional(),
  displayHeightPercent: z.number().optional(),
  modify: z.object({
    flip: z.enum(['horizontal', 'vertical']).optional(),
  }).optional(),
})
export type MediaObject = z.infer<typeof MediaDisplaySchema & typeof MediaIconSchema>

const emphasisSchema = z.enum(['default', 'highlighted', 'muted'])

// First define base schema without recursive parts
const BaseNavListItemSchema = z.object({
  // Core content
  id: z.string().optional().describe('Globally unique identifier for the item'),
  label: z.string().optional().describe('Primary text displayed for the item (e.g., "Products")'),
  subLabel: z.string().optional().describe('Secondary text shown below label for additional context'),
  value: z.union([z.string(), z.number()]).optional().describe('Value associated with the item'),
  description: z.string().optional().describe('Longer description or explanation of the item'),
  info: z.string().optional().describe('Tertiary text, often used for metadata like "5 min read" or counts'),

  // Visual
  media: MediaDisplaySchema.optional().describe('Media content shown with the item'),
  icon: MediaIconSchema.optional().describe('Leading icon shown before the label'),
  iconAfter: MediaIconSchema.optional().describe('Trailing icon shown after the label'),
  badge: z.object({
    content: z.union([z.string(), z.number()]).optional(),
    color: z.enum(colorThemeUser).optional(),
  }).optional().describe('Badge shown near label (e.g., "New" or count)'),

  // Navigation behavior
  href: z.string().optional().describe('Navigation URL - internal path or external link'),
  target: z.enum(['_self', '_blank']).optional().describe('Link target - "_blank" opens in new tab'),
  onClick: ClickHandlerSchema.optional().describe('Click handler - use for custom navigation or actions'),

  // Visual & behavioral variants
  variant: z.enum([
    'default', // Standard link
    'button', // Button-like appearance
    'avatar', // User avatar display
  ]).optional(),

  emphasis: emphasisSchema.optional(),

  theme: z.enum(colorThemeUser).optional().describe('Color theme for the item'),
  design: ButtonDesignSchema.optional().describe('Design style for the item'),

  // State management
  onAuthState: z.enum([
    'loggedIn', // Only shown when user is logged in
    'loggedOut', // Only shown when user is logged out
    'all', // Always shown
  ]).optional(),

  isActive: z.boolean().optional().describe('Marks the item as active or selected'),
  isDisabled: z.boolean().optional().describe('Disables the item from interaction'),
  isHidden: z.boolean().optional().describe('Hides the item from view'),

  // Editing
  basePath: z.string().optional(),

  // Organization
  priority: z.number().optional().describe('Priority for sorting items default is 100. Less is higher priority'),

  // Development
  testId: z.string().optional(),
  figure: z.object({
    el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
      return typeof val === 'function' || val instanceof Promise
    }),
    props: z.record(z.string(), z.any()).optional(),
  }).optional(),
})

// Navigation list container
export const NavListSchema = z.object({
  title: z.string().optional().describe('Optional section/group title'),
  description: z.string().optional().describe('Optional section/group description'),
  items: z.array(z.record(z.string(), z.any())).optional().describe('Navigation items in this section'),
  variant: z.enum(['default', 'expanded']).optional().describe('Variant of the list'),
})

// Full navigation item with recursive list support
export const NavListItemSchema = BaseNavListItemSchema.extend({
  list: z.lazy(() => NavListSchema).optional().describe('Nested navigation list (e.g., dropdown menu)'),
})

export type NavList = Omit<z.infer<typeof NavListSchema>, 'items'> & { items?: NavListItem[] }

// Define the complete type including recursive items property
export type NavListItem = z.infer<typeof BaseNavListItemSchema> & {
  list?: NavList
}

export const ActionButtonSchema = z.object({
  label: z.string().optional().describe('Button text [ai]'),
  href: z.string().optional().describe('Button link URL or /path [ai]'),
  size: SizeSchema.optional().describe('Button size'),
  theme: ButtonColorThemeSchema.optional().describe('Button color scheme [ai]'),
  design: ButtonDesignSchema.optional().describe('Button visual style [ai]'),
  format: ButtonFormatSchema.optional(),
  rounding: ButtonRoundingSchema.optional(),
  icon: z.union([z.string(), MediaIconSchema]).optional().describe('Button icon [ai]'),
  iconAfter: z.union([z.string(), MediaIconSchema]).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onClick: ClickHandlerSchema.optional(),
  testId: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
  hover: ButtonHoverSchema.optional(),
})

export type ActionButton = z.infer<typeof ActionButtonSchema>

export const ActionSubscribeSchema = z.object({
  input: z.object({
    placeholder: z.string().optional().describe('Email input placeholder [ai]'),
  }).optional(),
  button: z.object({
    label: z.string().optional().describe('Button text [ai]'),
    icon: MediaIconSchema.optional().describe('Button icon [ai]'),
  }).optional().describe('buttons [ai]'),
  success: z.object({
    title: z.string().optional().describe('Success message title [ai]'),
    content: z.string().optional().describe('Success message content [ai]'),
  }).optional(),
})

export type ActionSubscribe = z.infer<typeof ActionSubscribeSchema>

export const ActionAreaSchema = z.object({
  title: z.string().optional().describe('Header text above actions [ai]'),
  variant: z.enum(['buttons', 'subscribe']).optional().describe('Action type format [ai]'),
  buttons: z.array(ActionButtonSchema).optional().describe('Interactive buttons [ai]'),
  size: SizeSchema.optional().describe('Component size'),
  theme: ButtonColorThemeSchema.optional().describe('Color scheme'),
  design: ButtonDesignSchema.optional().describe('Visual style'),
  subscribe: ActionSubscribeSchema.optional().describe('Email capture settings [ai]'),
  proof: z.object({
    community: z.object({
      isEnabled: z.boolean().optional().describe('Show social proof'),
      text: z.string().optional().describe('Social proof message '),
      count: z.number().optional().describe('Community size'),
      thumbCount: z.number().optional().describe('Avatar count to show'),
    }).optional().describe('Social proof display'),
  }).optional().describe('Trust indicators'),
})

export type ActionArea = z.infer<typeof ActionAreaSchema>

export const logoSchema = z.object({
  variant: z.enum(['media', 'typography']).optional(),
  media: MediaIconSchema.optional(),
  typography: typographySchema.optional(),
  scale: z.number().optional(),
})

export const brandSchema = z.object({
  logo: logoSchema.optional(),
  tagline: z.string().optional(),
  action: ActionAreaSchema.optional(),
})

export type BrandObject = z.infer<typeof brandSchema>

export type LogoObject = z.infer<typeof logoSchema>

export const SuperTitleSchema = z.object({
  text: z.string().optional().describe('Short text above main title [ai]'),
  icon: MediaIconSchema.optional().describe('Visual indicator icon [ai]'),
  theme: z.enum(colorThemeUser).optional().describe('Color style'),
})

export type SuperTitle = z.infer<typeof SuperTitleSchema>

// export const TaxonomySchema = z.object({
//   title: z.string().optional(),
//   slug: z.string().optional(),
//   type: z.enum(['category', 'tag']).optional(),
// })

export const UserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: MediaBasicSchema.optional(),
  title: z.string().optional(),
  websiteUrl: z.string().optional(),
})

export const PostSEOSchema = z.object({
  title: z.string().optional().describe('Custom SEO title, defaults to post title if not specified'),
  description: z.string().optional().describe('Meta description for search engines and social sharing'),
}).describe('SEO metadata for the post')

const PostUserConfigSchema = z.object({
  seo: PostSEOSchema.optional().describe('Search engine and social media optimization settings'),
  isContentCompletionDisabled: z.boolean().optional(),
})

export const PostSchema = z.object({
  // Core Content
  title: z.string().optional().describe('Primary headline [ai]'),
  subTitle: z.string().optional().describe('Supporting headline [ai]'),
  superTitle: SuperTitleSchema.optional().describe('Small header text above title [ai]'),
  content: z.string().optional().describe('Main content in HTML/Markdown [ai]'),
  excerpt: z.string().optional().describe('Brief summary for previews [ai]'),

  // Meta Information
  status: PostStatusSchema.optional().describe('Publication state'),
  emphasis: emphasisSchema.optional().describe('Display prominence level'),
  dateAt: z.string().optional().describe('Publish date'),
  publishAt: z.string().optional().describe('Scheduled publish date'),

  // Visual Elements
  media: MediaDisplaySchema.optional().describe('Featured image/video [ai]'),
  icon: MediaIconSchema.optional().describe('List view icon [ai]'),

  // Taxonomy & Organization
  slug: z.string().optional().describe('URL-friendly title'),
  href: z.string().optional().describe('Content permalink'),
  tags: z.array(z.string()).optional().describe('Topic labels [ai]'),
  categories: z.array(z.string()).optional().describe('Content groupings [ai]'),

  // Associated Data
  authors: z.array(UserSchema).optional().describe('Content creators'),
  action: ActionAreaSchema.optional().describe('Interactive buttons [ai]'),

  userConfig: PostUserConfigSchema.optional().describe('Custom settings'),
})

export const GlobalQuerySchema = z.object({
  filters: z.array(OrFilterGroupSchema).optional().describe('OR-based filter groups [ai]'),
  sortBy: z.string().optional().describe('Field to sort by'),
  sortOrder: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
  search: z.string().optional().describe('Search query [ai]'),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional().describe('Date filter range'),
})

export const PostHandlingSchema = z.object({
  format: z.enum(['standard', 'local']).optional().describe('Global or inline posts source'),
  limit: z.number().optional().describe('Max posts to show'),
  offset: z.number().optional().describe('Number of posts to skip'),
  entries: z.array(PostSchema).optional().describe('Local post entries [ai]'),
  query: GlobalQuerySchema.optional()
    .describe('Filter and sort options [ai]'),
  viewSlug: z.string().optional().describe('Base URL for posts'),
})

export type PostObject = z.infer<typeof PostSchema>
export type PostHandlingObject = z.infer<typeof PostHandlingSchema>
