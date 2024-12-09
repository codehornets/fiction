import { z } from 'zod'

const CardContentTypeSchema = z.enum([
  'text', // Primarily text content
  'media', // Images/videos primary
  'mixed', // Balanced text/media
  'interactive', // User input focused
  'data', // Numbers/charts/stats
])

const CardPurposeSchema = z.enum([
  'conversion',
  'engagement',
  'awareness',
  'education',
  'trust',
  'navigation',
  'presentation',
])

/**
 * Categories users will be looking for
 */
const CardCategorySchema = z.enum([
  'common', // Fundamental components
  'layout', // Structure and grid systems
  'tour', // Text and rich media content
  'list',
  'cta', // Call-to-action buttons
  'navigation', // Menus, links, site structure
  'gallery', // Image and media displays
  'slider', // Carousel and slideshow
  'social', // Social proof, sharing
  'forms', // Shopping, payments
  'posts', // Blog, articles, news
  'quotes', // Reviews, quotes
  'typography', // Text styling and effects
  'data', // Data visualization, stats
  'utility', // Helper components
  'advanced', // Complex, composite components
])

const CardUseCaseSchema = z.enum([
  // Professional
  'resume', // CV/Resume presentation
  'job-posting', // Career/job listings
  'case-study', // Project/work showcases
  'service-offer', // Service descriptions

  // Marketing
  'product-launch', // New product/feature releases
  'event-promo', // Event promotion
  'lead-magnet', // Lead generation offers
  'sales-page', // Product/service sales

  // Content
  'tutorial', // How-to guides
  'comparison', // Product/service comparisons
  'showcase', // Portfolio items
  'announcement', // News/updates

  // Social Proof
  'testimonial', // Client reviews
  'awards', // Achievements/recognition
  'press', // Media mentions
  'team', // Team members

  // Journey
  'timeline', // Historical progression
  'roadmap', // Future plans
  'milestones', // Achievement tracking
  'process', // Step-by-step flows

  // Community
  'membership', // Member profiles/directories
  'discussion', // Forums/comments
  'newsletter', // Email signups
  'social-feed', // Social media integration

  // Commerce
  'pricing', // Pricing tables
  'product-card', // Product displays
  'cart', // Shopping cart
  'checkout', // Payment process
])

const ComplexitySchema = z.enum([
  'basic', // Simple, single purpose
  'standard', // Moderate complexity
  'advanced', // Complex functionality
])

export const CardClassificationSchema = z.object({
  type: z.array(CardContentTypeSchema).optional(),
  purpose: z.array(CardPurposeSchema).optional(),
  category: z.array(CardCategorySchema).optional(),
  useCase: z.array(CardUseCaseSchema).optional(),
  complexity: ComplexitySchema.optional(),
})

export type CardClassification = z.infer<typeof CardClassificationSchema>
