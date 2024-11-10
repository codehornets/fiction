import type { ListItem } from '@fiction/core'
import { colorThemeBright } from '@fiction/core'
import { z } from 'zod'

const ARCHETYPE_VALUES = [
  'sage',
  'hero',
  'creator',
  'explorer',
  'rebel',
  'magician',
  'regular',
  'lover',
  'caregiver',
  'jester',
  'ruler',
  'innocent',
] as const

export const brandArchetypes: { name: string, value: typeof ARCHETYPE_VALUES[number], desc: string }[] = [
  {
    name: 'Sage',
    value: 'sage',
    desc: 'Shares wisdom and deep insights. Examples: Neil deGrasse Tyson, Brené Brown - focused on empowering others through knowledge and understanding.',
  },
  {
    name: 'Hero',
    value: 'hero',
    desc: 'Overcomes personal challenges to inspire others. Examples: David Goggins, Simone Biles - sharing authentic struggles and triumphs to motivate transformation.',
  },
  {
    name: 'Creator',
    value: 'creator',
    desc: 'Innovates and expresses unique ideas. Examples: Casey Neistat, Issa Rae - turning personal creativity into impactful content and projects.',
  },
  {
    name: 'Explorer',
    value: 'explorer',
    desc: 'Seeks growth through new experiences. Examples: Anthony Bourdain, Jane Goodall - sharing discoveries and insights from personal journeys.',
  },
  {
    name: 'Rebel',
    value: 'rebel',
    desc: 'Challenges status quo through authentic voice. Examples: Malcolm Gladwell, Gary Vaynerchuk - disrupting conventional wisdom with fresh perspectives.',
  },
  {
    name: 'Magician',
    value: 'magician',
    desc: 'Facilitates personal transformation. Examples: Tony Robbins, Marie Kondo - guiding others to unlock their potential through expertise.',
  },
  {
    name: 'Regular',
    value: 'regular',
    desc: 'Connects through relatable authenticity. Examples: Jennifer Garner, Chrissy Teigen - building trust by sharing genuine everyday experiences.',
  },
  {
    name: 'Lover',
    value: 'lover',
    desc: 'Builds deep emotional connections. Examples: Michelle Obama, Tom Hanks - inspiring through vulnerability and genuine care.',
  },
  {
    name: 'Caregiver',
    value: 'caregiver',
    desc: 'Empowers through support and guidance. Examples: Malala Yousafzai, Fred Rogers - leading with empathy and service to others.',
  },
  {
    name: 'Jester',
    value: 'jester',
    desc: 'Uses humor to deliver value. Examples: Ryan Reynolds, Mindy Kaling - making meaningful connections through entertainment and wit.',
  },
  {
    name: 'Ruler',
    value: 'ruler',
    desc: 'Leads through expertise and standards. Examples: Anna Wintour, Gordon Ramsay - building authority through mastery and high expectations.',
  },
  {
    name: 'Innocent',
    value: 'innocent',
    desc: 'Inspires through authentic optimism. Examples: Dolly Parton, Emma Watson - sharing genuine positivity and values-driven content.',
  },
]

export const BrandGuideSchema = z.object({
  personality: z.object({
    archetype: z.enum(ARCHETYPE_VALUES).describe('Select your core personal archetype that authentically reflects your natural way of connecting with others'),

    traits: z.array(z.string()).describe('3-5 distinctive personality traits that make your personal brand uniquely you and resonate with your audience'),

    voice: z.object({
      tone: z.string().describe('Your authentic communication style and how you naturally express yourself to your audience'),
      guidelines: z.string().describe('Specific examples of language, phrases, and communication approaches that reflect your personal brand voice'),
    }),
    story: z.object({
      journey: z.string().describe('Your authentic personal narrative - the experiences and lessons that shaped who you are today'),
      pivotalMoments: z.array(z.string()).describe('Key transformational moments in your journey that demonstrate your growth and credibility'),
    }),
  }),

  purpose: z.object({
    mission: z.string().describe('Your core motivation for building a personal brand - what drives you to share and serve others'),
    vision: z.string().describe('The lasting impact you want your personal brand to have on your audience and industry'),
    positioning: z.string().describe('Your unique perspective or approach that sets you apart in your field'),
    values: z.array(z.object({
      value: z.string(),
      description: z.string(),
      inPractice: z.string().describe('Specific examples of how you demonstrate this value through your content and interactions'),
    })).describe('Core personal values that guide your decisions and content creation'),
  }),

  communities: z.array(z.object({
    name: z.string().describe('Specific segment of your audience with shared characteristics'),
    interests: z.array(z.string()).describe('Specific topics and themes that deeply matter to this audience segment'),
    challenges: z.array(z.string()).describe('Real pain points and obstacles this audience faces that you can help solve'),
    content: z.array(z.string()).describe('Content formats and topics proven to resonate with this specific audience'),
  })),

  pillars: z.array(z.object({
    topic: z.string().describe('Key area of expertise or value you consistently deliver'),
    description: z.string().describe('How this content theme serves your audience and supports your mission'),
    examples: z.array(z.string()).describe('Specific content ideas and formats that showcase your expertise in this area'),
    audiences: z.array(z.string()).describe('Which audience segments this content pillar primarily serves'),
  })),

  futurePacing: z.object({
    declaration: z.string().describe('Powerful vision of your evolved personal brand written as if already achieved - be specific and ambitious'),

    nextSteps: z.array(z.object({
      statement: z.string().describe('Specific milestone or achievement needed to realize your vision'),
      action: z.string().describe('Clear, measurable action you will take to reach this milestone'),
      deadline: z.string().describe('Realistic but ambitious timeframe for completing this action'),
    })),
  }).describe('Strategic roadmap for evolving your personal brand with clear actions and accountability'),

  visuals: z.object({
    primaryColor: z.enum(colorThemeBright).describe('Signature color that reflects your personal brand personality'),
    typography: z.object({
      title: z.string(),
      body: z.string(),
    }),
    imageStyle: z.string().describe('Guidelines for visual content that authentically represents your personal brand'),
  }),

  systemMessage: z.string().describe('Detailed instructions for maintaining consistency in your personal brand voice across all content'),

  version: z.string().default('1.0.0').describe('Version number for tracking evolution of your personal brand guidelines'),
}).describe('Comprehensive personal brand strategy framework for authentic content creation and brand growth')

export type BrandGuide = z.infer<typeof BrandGuideSchema>
