/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createGoogleFontsLink, googleFontsUtility, variantToGoogleFontsFormat } from '../fonts'
import { fonts } from '../lib/fontList'

const fontA = 'Space Mono'
const fontB = 'Libre Baskerville'

describe('googleFontsUtility', () => {
  beforeEach(() => {
    googleFontsUtility.reset()
  })

  describe('variantToGoogleFontsFormat', () => {
    it('should convert regular variants correctly', () => {
      expect(googleFontsUtility.variantToGoogleFontsFormat('100')).toBe('0,100')
      expect(googleFontsUtility.variantToGoogleFontsFormat('regular')).toBe('0,400')
    })

    it('should convert italic variants correctly', () => {
      expect(googleFontsUtility.variantToGoogleFontsFormat('100italic')).toBe('1,100')
      expect(googleFontsUtility.variantToGoogleFontsFormat('700italic')).toBe('1,700')
    })
  })

  describe('createGoogleFontsLink', () => {
    it('should return correct URL for valid font keys', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: [fontA, fontB] })
      expect(fontLink).toContain('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap')
    })

    it('should encode spaces as plus signs in font family names', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: ['Libre Baskerville'] })
      expect(fontLink).toContain('Libre+Baskerville')
    })

    it('should return an empty string when no font keys are provided', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: [] })
      expect(fontLink).toBe('')
    })
  })

  it('should load fonts correctly', async () => {
    await googleFontsUtility.loadFont(fontB)
    let linkElement = document.querySelector('link#google-font-libre-baskerville')
    expect(linkElement).not.toBeNull()
    expect(linkElement?.getAttribute('href')).toBe('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap')
    expect(linkElement?.getAttribute('rel')).toBe('stylesheet')

    // Should not load again
    await googleFontsUtility.loadFont(fontB)
    expect(document.querySelectorAll('link#google-font-libre-baskerville').length).toBe(1)

    await googleFontsUtility.loadFont(fontA)
    linkElement = document.querySelector('link#google-font-space-mono')
    expect(linkElement).not.toBeNull()
    expect(linkElement?.getAttribute('href')).toBe('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap')
    expect(linkElement?.getAttribute('rel')).toBe('stylesheet')
  })

  it('should check if a font is loaded', async () => {
    await googleFontsUtility.loadFont(fontA)
    expect(googleFontsUtility.isFontLoaded(fontA)).toBe(true)
    expect(googleFontsUtility.isFontLoaded(fontB)).toBe(false)
  })
})

describe('variantToGoogleFontsFormat', () => {
  it('should convert regular variants correctly', () => {
    expect(variantToGoogleFontsFormat('100')).toBe('0,100')
    expect(variantToGoogleFontsFormat('regular')).toBe('0,400')
  })

  it('should convert italic variants correctly', () => {
    expect(variantToGoogleFontsFormat('100italic')).toBe('1,100')
    expect(variantToGoogleFontsFormat('700italic')).toBe('1,700')
  })
})

describe('createGoogleFontsLink', () => {
  it('should return correct URL for valid font keys', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: [fontA, fontB], fonts })
    const expectedLink = 'https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap'
    expect(fontLink).toBe(expectedLink)
  })

  it('should encode spaces as plus signs in font family names', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: [fontA], fonts })
    expect(fontLink).toContain('Space+Mono')
  })

  it('should return an empty string when no font keys are provided', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: [], fonts })
    expect(fontLink).toBe('')
  })
})
