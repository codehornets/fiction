import type { IconId } from '@fiction/ui/lib/systemIcons.js'
import type { vue } from '../utils/libraries.js'
import { z } from 'zod'
import { OrFilterGroupSchema } from '../types/endpoint.js'
import { ColorScaleSchema, colorTheme, colorThemeUser, colorThemeWithInvert } from '../utils/colors.js'

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
export const ButtonDesignSchema = z.enum(['solid', 'ghost', 'outline', 'textOnly'])
export const ButtonRoundingSchema = z.enum(['none', 'md', 'full'])
export const ButtonHoverSchema = z.enum(['none', 'basic', 'rise', 'fade', 'slide', 'pop'])
export const ButtonShadowSchema = z.enum(['none', 'sm', 'md', 'lg'])
export const ButtonFontWeightSchema = z.enum(['normal', 'medium', 'semibold', 'bold'])
export const ButtonBorderSchema = z.enum(['none', 'normal', 'thick'])

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

export const FontConfigValSchema = z.object({
  fontKey: z.string().optional(),
  stack: z.enum(['monospace', 'sans', 'serif']),
  weight: FontWeightsSchema.optional(),
})
export const FontStyleSchema = z.object({
  fontKey: z.string().optional(),
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

  el: z.custom<vue.AsyncComponentLoader | vue.Component>((val) => {
    return typeof val === 'function' || val instanceof Promise
  }, { message: 'Must be an async component or Promise' }).optional(),
  props: z.record(z.string(), z.any()).optional(),
})

export const MediaIconSchema = MediaBasicSchema.extend({
  iconId: z.string().optional().describe('iconId is common icon name (e.g. user, check, lock)') as z.Schema<IconId | undefined>,
  class: z.string().optional().describe('tabler iconify class i-tabler-[icon-name]'),
})

export const MediaTypographySchema = MediaBasicSchema.extend({
  typography: z.object({
    text: z.string().optional(),
    weight: z.string().optional(),
    lineHeight: z.string().optional(),
    letterSpacing: z.string().optional(),
    font: z.string().optional(),
    scale: z.number().optional(),
  }).optional(),
})

// MediaContent schema (includes MediaBasic)
export const MediaContentSchema = MediaIconSchema.extend({
  alt: z.string().optional(),
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
export type MediaObject = z.infer<typeof MediaDisplaySchema & typeof MediaTypographySchema & typeof MediaIconSchema>

// First define base schema without recursive parts
const BaseNavListItemSchema = z.object({
  // Core content
  id: z.string().optional().describe('Globally unique identifier for the item'),
  label: z.string().optional().describe('Primary text displayed for the item (e.g., "Products")'),
  value: z.union([z.string(), z.number()]).optional().describe('Value associated with the item'),
  description: z.string().optional().describe('Secondary text shown below label for additional context'),
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

  emphasis: z.enum([
    'default', // Standard appearance
    'highlighted', // Emphasized appearance
    'muted', // Diminished appearance
  ]).optional(),

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
export const navListSchema = z.object({
  title: z.string().optional().describe('Optional section/group title'),
  description: z.string().optional().describe('Optional section/group description'),
  items: z.array(BaseNavListItemSchema as z.Schema<NavListItem>).optional().describe('Navigation items in this section'),
  variant: z.enum(['default', 'expanded']).optional().describe('Variant of the list'),
})

// Full navigation item with recursive list support
export const navListItemSchema = BaseNavListItemSchema.extend({
  list: z.lazy(() => navListSchema).optional().describe('Nested navigation list (e.g., dropdown menu)'),
})

export type NavList = z.infer<typeof navListSchema>

// Define the complete type including recursive items property
export type NavListItem = z.infer<typeof BaseNavListItemSchema> & {
  list?: NavList
}

export const ActionButtonSchema = z.object({
  label: z.string().optional(),
  href: z.string().optional(),
  size: SizeSchema.optional(),
  theme: ButtonColorThemeSchema.optional(),
  design: ButtonDesignSchema.optional(),
  format: ButtonFormatSchema.optional(),
  rounding: ButtonRoundingSchema.optional(),
  icon: z.union([z.string(), MediaIconSchema]).optional(),
  iconAfter: z.union([z.string(), MediaIconSchema]).optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  onClick: ClickHandlerSchema.optional(),
  testId: z.string().optional(),
  target: z.enum(['_blank', '_self']).optional(),
  hover: ButtonHoverSchema.optional(),
})

export type ActionButton = z.infer<typeof ActionButtonSchema>

export const actionAreaSchema = z.object({
  title: z.string().optional(),
  variant: z.enum(['buttons', 'subscribe']).optional(),
  buttons: z.array(ActionButtonSchema).optional(),
  size: SizeSchema.optional(),
  theme: ButtonColorThemeSchema.optional(),
  design: ButtonDesignSchema.optional(),
  subscribe: z.object({
    placeholder: z.string().optional(),
    button: z.object({
      text: z.string().optional(),
    }),
    success: z.object({
      title: z.string().optional(),
      message: z.string().optional(),
    }).optional(),
  }).optional(),
  proof: z.object({
    community: z.object({
      isEnabled: z.boolean().optional(),
      text: z.string().optional(),
      count: z.number().optional(),
      thumbCount: z.number().optional(),
    }).optional(),
  }).optional(),
})

export type ActionArea = z.infer<typeof actionAreaSchema>

export const superTitleSchema = z.object({
  text: z.string().optional(),
  icon: MediaIconSchema.optional(),
  theme: z.enum(colorThemeUser).optional(),
})

export type SuperTitle = z.infer<typeof superTitleSchema>

export const TaxonomySchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  type: z.enum(['category', 'tag']).optional(),
})

export const UserSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  avatar: MediaBasicSchema.optional(),
  title: z.string().optional(),
  websiteUrl: z.string().optional(),
})

export const PostSchema = z.object({
  superTitle: z.string().optional().describe('Super title of the post'),
  title: z.string().optional().describe('Title of the post'),
  subTitle: z.string().optional().describe('Subtitle of the post'),
  content: z.string().optional().describe('Content of the post'),
  excerpt: z.string().optional().describe('Excerpt of the post'),
  status: PostStatusSchema.optional().describe('Status of the post'),
  media: MediaDisplaySchema.optional().describe('Featured Media for the post'),
  slug: z.string().optional().describe('Slug of the post page'),
  href: z.string().optional().describe('Link to the post page'),
  tags: z.array(z.string()).optional().describe('Tags for the post'),
  categories: z.array(z.string()).optional().describe('Categories for the post'),
  authors: z.array(UserSchema).optional(),
  actions: z.array(ActionButtonSchema).optional().describe('Action links or buttons for the post'),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  dateAt: z.string().optional().describe('ISO Date of the post'),
})

export const GlobalQuerySchema = z.object({

  filters: z.array(OrFilterGroupSchema).optional().describe('Array of filter groups which selects by OR'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
})

// Updated PostHandlingSchema
export const PostHandlingSchema = z.object({
  format: z.enum(['standard', 'local']).optional().describe('Either get from global posts or inline entries, AI always uses local'),
  limit: z.number().optional().describe('Limit the number of posts to show - default is 12'),
  offset: z.number().optional().describe('Offset the number of posts to show'),
  entries: z.array(PostSchema).optional().describe('Inline post entries for local format'),
  query: GlobalQuerySchema.optional().describe('Query for global posts'),
})

export type PostObject = z.infer<typeof PostSchema>
export type PostHandlingObject = z.infer<typeof PostHandlingSchema>

// export const XButtonSchema = z.object({
//   name: z.string().optional().describe('Text in the button'),
//   href: z.string().optional().describe('Link to navigate to use path for local route, or full URL for external'),
//   design: ButtonDesignSchema.optional().describe('Design style of the button'),
//   theme: z.enum(colorThemeUser).optional().describe('Color theme of the button'),
//   size: SizeSchema.optional().describe('Size of the button'),
//   icon: z.string().optional(),
//   iconAfter: z.string().optional(),
//   target: z.enum(['_blank', '_self']).optional(),
// })

// export type XButtonProps = z.infer<typeof XButtonSchema>
