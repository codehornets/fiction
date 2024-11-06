import { colorThemeBright } from '@fiction/core'
import { z } from 'zod'

// Core brand voice options that shape content tone
const brandVoiceStyles = [
  'teacher', // Explains complex topics simply
  'mentor', // Guides and encourages growth
  'pioneer', // Challenges conventional thinking
  'friend', // Relates through shared experiences
  'expert', // Delivers authoritative insights
] as const

// Main Brand Guide Schema
export const BrandGuideSchema = z.object({
  visual: z.object({
    primaryColor: z.enum(colorThemeBright).describe('main brand color'),
  }),
  // Core identity that shapes all content
  core: z.object({
    targetAudience: z.string().describe('Who specifically will value your content most'),
    valuePromise: z.string().describe('The main transformation you help create'),
    primaryVoice: z.enum(brandVoiceStyles).describe('Your natural teaching/sharing style'),
    uniqueAngle: z.string().describe('Your specific lens on your topic'),
  }),

  // Content creation guidelines
  content: z.object({
    mainTopics: z.array(z.string()).max(3).describe('Your 3 core content pillars - main themes you cover'),
    proofPoints: z.array(z.string()).max(5).describe('Specific experiences that prove your expertise'),
    phrases: z.array(z.string()).max(10).describe('Example phrases that reflect your voice'),
  }),

  // Quick content checks
  rules: z.object({
    include: z.array(z.string()).describe('Elements in every piece'),
    avoid: z.array(z.string()).describe('Things that don\'t fit your brand'),
    hooks: z.array(z.string()).describe('Example ways to start content and hook readers'),
    closers: z.array(z.string()).describe('Example ways to end content and encourage action'),
  }),
})

export type BrandGuide = z.infer<typeof BrandGuideSchema>
