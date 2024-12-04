import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../@fiction/core/.env') })

// Core configuration
const CATEGORY_LIMITS = {
  'sans-serif': 50,
  'serif': 50,
  'display': 50,
  'monospace': 50,
  'handwriting': 50,
} as const

const TRENDING_RATIO = 0.4 // 40% trending, 60% popular

// Recommended core fonts that should always be included
const RECOMMENDED_FONTS = [
  'Poppins',
  'DM Sans',
  'Plus Jakarta Sans',
  'Fraunces',
  'Playfair Display',
  'Space Grotesk',
  'Bebas Neue',
  'Syne',
  'Inter',
  'Cormorant',
  'Spectral',
  'Libre Baskerville',
  'Lora',
  'Oswald',
  'Work Sans',
  'Caveat',
  'Architects Daughter',
  'Gochi Hand',
  'Fira Code',
] as const

// Font filtering
const NON_LATIN_PATTERNS = [
  /[\u3000-\u9FFF]/, // CJK
  /[\u0E00-\u0E7F]/, // Thai
  /[\uAC00-\uD7AF]/, // Korean
  /^(?:Yuji|Zen|Noto(?! Sans$| Serif$)|BIZ|Kaisei|Klee)/,
  /(?:JP|KR|SC|TC|Thai|Arabic|Tamil)$/,
]

// Types
type Category = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace'
type SerifCategory = 'transitional' | 'modern' | 'geometric' | 'humanist' | 'old-style' | 'slab-serif'
type SansSerifCategory = 'grotesque' | 'neo-grotesque' | 'humanist' | 'geometric' | 'rounded' | 'square' | 'superellipse' | 'glyphic'
type FontFeeling = 'business' | 'casual' | 'creative' | 'elegant' | 'modern' | 'playful' | 'technical'
type FontReason = 'popular' | 'trending' | 'recommended'

type FontEntry = {
  family: string
  category: Category
  tags: (SerifCategory | SansSerifCategory | FontFeeling)[]
  variants: string[]
  popularity: number
  reason: FontReason
}

type GoogleFontResponse = {
  items: {
    family: string
    category: string
    variants: string[]
    subsets: string[]
  }[]
}

// Font filtering
const BLOCKED_FONTS = [
  'Lobster',
  'Lobster Two', // Block the variant as well
  'Comic Sans MS',
  'Papyrus',
]

function isLatinFont(font: { family: string, subsets: string[] }): boolean {
  // Check blocked fonts first
  if (BLOCKED_FONTS.includes(font.family))
    return false

  if (RECOMMENDED_FONTS.includes(font.family as typeof RECOMMENDED_FONTS[number]))
    return true
  if (!font.subsets.includes('latin'))
    return false
  return !NON_LATIN_PATTERNS.some(pattern => pattern.test(font.family))
}

function determineSerifCategory(fontName: string, variants: string[]): SerifCategory {
  const name = fontName.toLowerCase()
  const hasWideWeightRange = variants.length > 5

  if (name.includes('slab') || name.includes('rockwell'))
    return 'slab-serif'
  if (name.includes('bodoni') || name.includes('didot') || hasWideWeightRange)
    return 'modern'
  if (name.includes('caslon') || name.includes('garamond'))
    return 'old-style'
  if (name.includes('optima') || name.includes('stone'))
    return 'humanist'
  if (name.includes('geometric') || name.includes('futura'))
    return 'geometric'
  return 'transitional'
}

function determineSansCategory(fontName: string, variants: string[]): SansSerifCategory {
  const name = fontName.toLowerCase()
  const hasWideWeightRange = variants.length > 5

  if (name.includes('grotesque') || name.includes('grotesk'))
    return hasWideWeightRange ? 'neo-grotesque' : 'grotesque'
  if (name.includes('geometric') || name.includes('futura'))
    return 'geometric'
  if (name.includes('rounded'))
    return 'rounded'
  if (name.includes('square'))
    return 'square'
  if (name.includes('optima') || name.includes('gill'))
    return 'humanist'
  return 'neo-grotesque'
}

function determineFontFeeling(font: { family: string, category: string, variants: string[] }): FontFeeling[] {
  const feelings: FontFeeling[] = []
  const name = font.family.toLowerCase()
  const hasMultipleWeights = font.variants.length > 3
  const hasItalics = font.variants.some(v => v.includes('italic'))

  if (font.category === 'monospace' || name.includes('mono'))
    feelings.push('technical', 'business')
  if (font.category === 'serif' && hasItalics)
    feelings.push('elegant')
  if (font.category === 'handwriting')
    feelings.push('creative', 'casual')
  if (hasMultipleWeights && (font.category === 'sans-serif' || font.category === 'serif'))
    feelings.push('business', 'modern')
  if (font.category === 'display')
    feelings.push('creative')

  return [...new Set(feelings)]
}

function cleanVariants(variants: string[]): string[] {
  return [...new Set(
    variants
      .filter(v => !v.includes('italic'))
      .map(v => v === 'regular' ? '400' : v)
      .sort((a, b) => Number(a) - Number(b)),
  )]
}

// Main fetch function
async function fetchGoogleFonts(): Promise<FontEntry[]> {
  if (!process.env.GOOGLE_FONTS_API_KEY)
    throw new Error('GOOGLE_FONTS_API_KEY not set')

  const [popularRes, trendingRes] = await Promise.all([
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}&sort=popularity`),
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}&sort=trending`),
  ])

  const popularData = await popularRes.json() as GoogleFontResponse
  const trendingData = await trendingRes.json() as GoogleFontResponse

  return Object.entries(CATEGORY_LIMITS).flatMap(([category, limit]) => {
    // Get valid fonts for each category
    const getValidFonts = (data: GoogleFontResponse) =>
      data.items.filter(font =>
        font.category === category && isLatinFont(font),
      )

    const popularFonts = getValidFonts(popularData)
    const trendingFonts = getValidFonts(trendingData)

    // Select fonts based on trending ratio
    const trendingLimit = Math.floor(limit * TRENDING_RATIO)
    const popularLimit = limit - trendingLimit

    // Process and combine fonts with reasons
    const processFonts = (fonts: GoogleFontResponse['items'], reason: FontReason, startIndex: number) =>
      fonts.map((font, index) => {
        const tags: (SerifCategory | SansSerifCategory | FontFeeling)[] = []

        if (font.category === 'serif')
          tags.push(determineSerifCategory(font.family, font.variants))
        else if (font.category === 'sans-serif')
          tags.push(determineSansCategory(font.family, font.variants))

        tags.push(...determineFontFeeling(font))

        return {
          family: font.family,
          category: font.category as Category,
          tags: [...new Set(tags)],
          variants: cleanVariants(font.variants),
          popularity: startIndex + index + 1,
          reason,
        }
      })

    // Handle recommended fonts first
    const recommendedForCategory = RECOMMENDED_FONTS
      .filter((family) => {
        const font = [...popularFonts, ...trendingFonts].find(f => f.family === family)
        return font && font.category === category
      })
      .map((family) => {
        const font = [...popularFonts, ...trendingFonts].find(f => f.family === family)!
        return processFonts([font], 'recommended', 0)[0]
      })

    // Adjust limits for remaining fonts
    const remainingLimit = limit - recommendedForCategory.length
    const adjustedTrendingLimit = Math.floor(remainingLimit * TRENDING_RATIO)
    const adjustedPopularLimit = remainingLimit - adjustedTrendingLimit

    // Get remaining fonts
    const remainingPopular = popularFonts
      .filter(f => !recommendedForCategory.some(r => r.family === f.family))
      .slice(0, adjustedPopularLimit)

    const remainingTrending = trendingFonts
      .filter(f =>
        !recommendedForCategory.some(r => r.family === f.family)
        && !remainingPopular.some(p => p.family === f.family),
      )
      .slice(0, adjustedTrendingLimit)

    return [
      ...recommendedForCategory,
      ...processFonts(remainingPopular, 'popular', recommendedForCategory.length),
      ...processFonts(remainingTrending, 'trending', recommendedForCategory.length + remainingPopular.length),
    ]
  }).sort((a, b) => {
    const categoryOrder = Object.keys(CATEGORY_LIMITS)
    const reasonOrder = { recommended: 0, popular: 1, trending: 2 }
    const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    const reasonDiff = reasonOrder[a.reason] - reasonOrder[b.reason]
    return categoryDiff || reasonDiff || a.popularity - b.popularity
  })
}

// Main execution
async function main() {
  try {
    const fonts = await fetchGoogleFonts()
    const outputPath = path.resolve(__dirname, '../@fiction/core/utils/lib/fontItems.json')

    await fs.mkdir(path.dirname(outputPath), { recursive: true })

    const jsonString = JSON.stringify(fonts, null, 2)
    await fs.writeFile(outputPath, jsonString)

    // Log statistics
    console.log(`✓ Wrote ${fonts.length} fonts to ${outputPath}`)

    const stats = Object.fromEntries(
      Object.keys(CATEGORY_LIMITS).map(category => [
        category,
        fonts.filter(f => f.category === category).reduce((acc, font) => {
          acc[font.reason] = (acc[font.reason] || 0) + 1
          return acc
        }, {} as Record<FontReason, number>),
      ]),
    )

    console.log('\nFonts by category:')
    Object.entries(stats).forEach(([category, counts]) => {
      console.log(`${category}:
  recommended: ${counts.recommended || 0}
  popular: ${counts.popular || 0}
  trending: ${counts.trending || 0}
  total: ${Object.values(counts).reduce((a, b) => a + b, 0)}`)
    })
  }
  catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
