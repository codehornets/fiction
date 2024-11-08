import fictionIcon from '@fiction/ui/brand/icon.png'
import { describe, expect, it, vi } from 'vitest'
import { getDefaultIconUrl, getHeadIconConfig, getSiteIcons } from '../icon'

describe('icon Utils', () => {
  const mockSite = {
    title: { value: 'Test Site' },
    fullConfig: {
      value: {
        branding: {
          favicon: { url: 'custom-favicon.png' },
          icon: { url: 'custom-icon.png' },
          shareImage: { url: 'custom-share.png' },
        },
      },
    },
  } as any // Type as any to avoid full Site implementation

  describe('getDefaultIconUrl', () => {
    it('returns fiction icon when no site is provided', () => {
      const result = getDefaultIconUrl({ site: undefined })
      expect(result).toBe(fictionIcon)
    })

    it('generates correct url with default options', () => {
      const result = getDefaultIconUrl({ site: mockSite })
      const url = new URL(result)

      expect(url.origin).toBe('https://ui-avatars.com')
      expect(url.pathname).toBe('/api/')

      const params = Object.fromEntries(url.searchParams)
      expect(params).toMatchInlineSnapshot(`
        {
          "background": "1e40af",
          "bold": "true",
          "color": "e4ebfb",
          "font-size": "0.65",
          "format": "png",
          "length": "1",
          "name": "Test Site",
          "rounded": "false",
          "size": "128",
          "uppercase": "true",
        }
      `)

      expect(url).toMatchInlineSnapshot(`"https://ui-avatars.com/api/?name=Test+Site&size=128&background=1e40af&color=e4ebfb&length=1&rounded=false&bold=true&format=png&font-size=0.65&uppercase=true"`)
    })

    it('allows overriding default options', () => {
      const result = getDefaultIconUrl({
        site: mockSite,
        options: {
          size: 64,
          rounded: true,
          format: 'png',
        },
      })

      const params = new URL(result).searchParams
      expect(params.get('size')).toBe('64')
      expect(params.get('rounded')).toBe('true')
      expect(params.get('format')).toBe('png')
    })

    it('properly formats color values', () => {
      const result = getDefaultIconUrl({
        site: mockSite,
        options: {
          background: '#123ABC',
          color: '#DEF456',
        },
      })

      const params = new URL(result).searchParams
      expect(params.get('background')).toBe('123ABC')
      expect(params.get('color')).toBe('DEF456')
    })
  })

  describe('getSiteIcons', () => {
    it('returns all icon variants with correct sizes', () => {
      const icons = getSiteIcons({ site: mockSite })

      // Test favicon
      const faviconParams = new URL(icons.favicon).searchParams
      expect(faviconParams.get('size')).toBe('32')
      expect(faviconParams.get('format')).toBe('png')

      // Test apple touch icon
      const appleParams = new URL(icons.appleTouchIcon).searchParams
      expect(appleParams.get('size')).toBe('180')
      expect(appleParams.get('format')).toBe('png')

      // Test MS tile icon
      const msParams = new URL(icons.msTileIcon).searchParams
      expect(msParams.get('size')).toBe('144')
      expect(msParams.get('format')).toBe('png')

      // Test OG image
      const ogParams = new URL(icons.ogImage).searchParams
      expect(ogParams.get('size')).toBe('512')
      expect(ogParams.get('format')).toBe('png')
      expect(ogParams.get('font-size')).toBe('0.4')
    })

    it('returns fiction icon for all variants when no site provided', () => {
      const icons = getSiteIcons({ site: undefined })
      expect(icons.favicon).toBe(fictionIcon)
      expect(icons.appleTouchIcon).toBe(fictionIcon)
      expect(icons.msTileIcon).toBe(fictionIcon)
      expect(icons.ogImage).toBe(fictionIcon)
    })
  })

  describe('getHeadIconConfig', () => {
    it('uses custom icons when provided', () => {
      const config = getHeadIconConfig({ site: mockSite })

      expect(config.faviconUrl).toBe('custom-favicon.png')
      expect(config.appleTouchIconUrl).toBe('custom-icon.png')
      expect(config.msTileIconUrl).toBe('custom-icon.png')
      expect(config.ogImageUrl).toBe('custom-share.png')
    })

    it('falls back to default icons when custom not provided', () => {
      const siteMock = {
        title: { value: 'Test Site' },
        fullConfig: { value: { branding: {} } },
      } as any

      const config = getHeadIconConfig({ site: siteMock })

      expect(config.faviconUrl).toMatch(/ui-avatars\.com/)
      expect(config.appleTouchIconUrl).toMatch(/ui-avatars\.com/)
      expect(config.msTileIconUrl).toMatch(/ui-avatars\.com/)
      expect(config.ogImageUrl).toMatch(/ui-avatars\.com/)
    })

    it('correctly determines favicon mime type', () => {
      const tests = [
        { ext: 'svg', expected: 'image/svg+xml' },
        { ext: 'png', expected: 'image/png' },
        { ext: 'ico', expected: 'image/x-icon' },
        { ext: 'jpg', expected: 'image/png' }, // Falls back to png
      ]

      tests.forEach(({ ext, expected }) => {
        const siteMock = {
          title: { value: 'Test Site' },
          fullConfig: { value: { branding: { favicon: { url: `icon.${ext}` } } } },
        } as any

        const config = getHeadIconConfig({ site: siteMock })
        expect(config.faviconType).toBe(expected)
      })
    })

    it('handles missing site gracefully', () => {
      const config = getHeadIconConfig({ site: undefined })
      expect(config.faviconUrl).toBe(fictionIcon)
      expect(config.faviconType).toBe('image/png')
    })
  })
})
