import type { FontFamily } from '../schemas/schemas.js'
import type { FontEntry } from './lib/fontList.js'
import { toCamel } from './casing'
import { fonts } from './lib/fontList.js'

export const safeStacks = {
  monospace: `'Nimbus Mono PS', 'Courier New', monospace`,
  serif: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
  sans: `Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif`,
  system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
}

export function variantToGoogleFontsFormat(variant: string): string {
  const weightMap: Record<string, string> = {
    100: '100',
    200: '200',
    300: '300',
    regular: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
    900: '900',
  }
  const isItalic = variant.includes('italic')
  const weightKey = variant.replace('italic', '').trim() // Trim to remove extra spaces after replacement
  const weight = weightMap[weightKey] || '400' // Default to '400' if not found

  return `${isItalic ? '1' : '0'},${weight}`
}

// export function createGoogleFontsLink(args: { fontKeys: string[], fonts?: FontEntry[] }) {
//   const deduped = [...new Set(args.fontKeys || [])]
//   const fontEntries = args.fonts || fonts

//   const fontParams = deduped.map((fontKey) => {
//     const normalizedFontKey = toCamel(fontKey)

//     const font = fontEntries.find(f => toCamel(f.family) === normalizedFontKey)
//     if (!font) {
//       console.error(`Font family not found: ${fontKey} (${normalizedFontKey})`)
//       return ''
//     }

//     // Process each variant and convert to the correct format
//     const variants = font.variants
//       .map(variantToGoogleFontsFormat)
//       .sort()
//       .join(';')

//     const family = font.family.replace(/ /g, '+')
//     return `${family}:ital,wght@${variants}`
//   }).filter(Boolean).join('&family=')

//   return fontParams ? `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap` : ''
// }

class GoogleFontsUtility {
  private fontsList: FontEntry[] = fonts
  private loadedFonts: Set<string> = new Set()

  public variantToGoogleFontsFormat(variant: string): string {
    const weightMap: Record<string, string> = {
      100: '100',
      200: '200',
      300: '300',
      regular: '400',
      500: '500',
      600: '600',
      700: '700',
      800: '800',
      900: '900',
    }
    const isItalic = variant.includes('italic')
    const weightKey = variant.replace('italic', '').trim()
    const weight = weightMap[weightKey] || '400'
    return `${isItalic ? '1' : '0'},${weight}`
  }

  public createGoogleFontsLink(args: { fontFamilies: FontFamily[], fonts?: FontEntry[] }): string {
    const { fontFamilies, fonts: providedFonts = [] } = args
    const deduped = [...new Set(fontFamilies.map(_ => _.family))]

    const fontEntries = [...this.fontsList, ...providedFonts]

    if (!fontEntries.length) {
      throw new Error('No fonts provided')
    }

    const fontParams = deduped.map((familyName) => {
      const fam = fontFamilies.find(_ => _.family === familyName)
      const normalizedFontKey = toCamel(familyName)
      const font = fontEntries.find(f => toCamel(f.family) === normalizedFontKey)
      if (!font) {
        console.error(`Font family not found: ${familyName} (${normalizedFontKey}-${fontEntries.map(f => toCamel(f.family)).join(', ')})`)
        return ''
      }
      const variants = font.variants
        .map(_ => this.variantToGoogleFontsFormat(_))
        .sort()
        .join(';')
      const family = font.family.replace(/ /g, '+')
      return `${family}:wght@300;400;500;600;700;800;900`
    }).filter(Boolean).join('&family=')

    return fontParams ? `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap` : ''
  }

  public async loadFont(fontFamily: FontFamily): Promise<void> {
    const { family = '' } = fontFamily
    if (typeof window === 'undefined' || this.loadedFonts.has(family)) {
      return
    }

    const fontEntry = this.fontsList?.find(font => toCamel(font.family) === toCamel(family))
    if (fontEntry) {
      const link = document.createElement('link')
      link.href = this.createGoogleFontsLink({
        fontFamilies: [fontFamily],
        fonts: this.fontsList || undefined,
      })
      link.rel = 'stylesheet'
      link.id = `google-font-${family.replace(/\s+/g, '-').toLowerCase()}`
      document.head.appendChild(link)
      this.loadedFonts.add(family)
    }
  }

  public isFontLoaded(fontFamily: FontFamily): boolean {
    const { family = '' } = fontFamily
    return this.loadedFonts.has(family)
  }

  public reset() {
    if (typeof document !== 'undefined') {
      const links = document.head.querySelectorAll('link[id^="google-font-"]')
      links.forEach(link => link.remove())
    }

    this.loadedFonts.clear()
  }
}

export const googleFontsUtility = new GoogleFontsUtility()
