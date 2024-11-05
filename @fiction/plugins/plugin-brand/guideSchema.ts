import { z } from 'zod'

// Enums and Constants
const brandArchetypes = [
  'Sage',
  'Innocent',
  'Explorer',
  'Ruler',
  'Creator',
  'Caregiver',
  'Magician',
  'Hero',
  'Outlaw',
  'Lover',
  'Jester',
  'Regular Person',
] as const

const contentTypes = ['video', 'blog', 'social', 'podcast', 'newsletter'] as const

const toneAttributes = [
  'professional',
  'casual',
  'humorous',
  'educational',
  'inspirational',
  'controversial',
  'personal',
  'technical',
] as const

// Sub-schemas
const ColorScheme = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i),
  neutral: z.string().regex(/^#[0-9A-F]{6}$/i),
})

const ContentPillar = z.object({
  name: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  contentTypes: z.array(z.enum(contentTypes)),
  keyPhrases: z.array(z.string()),
})

// Main Brand Guide Schema
export const BrandGuideSchema = z.object({
  // Basic Information (from Question 1)
  basics: z.object({
    targetAge: z.number().min(0).max(100).optional(),
    targetGender: z.array(z.string()),
    primaryLocation: z.string(),
    industry: z.string(),
  }),

  // Vision (from Question 2)
  vision: z.object({
    headline: z.string(),
    shortDescription: z.string().max(280),
    fiveYearGoals: z.array(z.string()),
  }),

  // Brand Identity
  identity: z.object({
    archetype: z.enum(brandArchetypes),
    personalityTraits: z.array(z.string()).min(1).max(5),
    toneOfVoice: z.array(z.enum(toneAttributes)).min(1).max(5),
    uniqueValueProposition: z.string(),
  }),

  // Visual Identity
  visuals: z.object({
    colors: ColorScheme,
    recommendedImageStyles: z.array(z.string()),
    fontPairings: z.object({
      headings: z.string(),
      body: z.string(),
    }),
  }),

  // Content Strategy
  content: z.object({
    pillars: z.array(ContentPillar).length(3),
    targetPostLength: z.object({
      minimum: z.number(),
      optimal: z.number(),
      maximum: z.number(),
    }),
    contentMix: z.record(z.enum(contentTypes), z.number()),
    keyHashtags: z.array(z.string()),
  }),

  // Expertise Area (from Question 4)
  expertise: z.object({
    primaryArea: z.string(),
    secondaryAreas: z.array(z.string()),
    topicsToCover: z.array(z.string()),
    topicsToAvoid: z.array(z.string()),
  }),

  // Unique Differentiators (from Question 5)
  differentiators: z.object({
    uniqueCombination: z.string(),
    keyStoryElements: z.array(z.string()),
    competitiveAdvantages: z.array(z.string()),
  }),

  // Brand Rules for Content Auditing
  contentRules: z.object({
    requiredElements: z.array(z.string()),
    forbiddenElements: z.array(z.string()),
    toneGuidelines: z.array(z.string()),
    callToActionTemplates: z.array(z.string()),
  }),
})

// Type export for TypeScript usage
export type BrandGuide = z.infer<typeof BrandGuideSchema>
