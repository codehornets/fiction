import type { BentoItem } from './index'
import { colorList, getColorScheme } from '@fiction/core'

type ThemeMode = 'light' | 'dark' | 'auto'

export function getPositionStyles(item: BentoItem) {
  const { verticalPosition = 'bottom', horizontalPosition = 'center' } = item

  const justifyMap = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  } as const

  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  } as const

  return {
    justifyContent: justifyMap[verticalPosition as keyof typeof justifyMap],
    alignItems: alignMap[horizontalPosition as keyof typeof alignMap],
  }
}

export function getGradientStyle(item: BentoItem) {
  const {
    verticalPosition = 'bottom',
    horizontalPosition = 'left',
    theme,
  } = item

  const clr = theme ? getColorScheme(theme)[900] : '0 0 0'
  const isCentered = verticalPosition === 'center' || horizontalPosition === 'center'

  // Define gradient configurations based on positioning
  const gradients: string[] = []

  // Main positional gradient
  if (isCentered) {
    // Larger, more diffused gradient for centered content
    gradients.push(`radial-gradient(
      circle at ${horizontalPosition} ${verticalPosition},
      rgba(${clr} / 0.5) 0%,
      rgba(${clr} / 0.4) 45%,
      rgba(${clr} / 0.1) 70%,
      transparent 100%
    )`)

    // Add subtle overall gradient for better readability
    gradients.push(`linear-gradient(
      to bottom,
      rgba(${clr} / 0.2) 0%,
      rgba(${clr} / 0.3) 50%,
      rgba(${clr} / 0.2) 100%
    )`)
  }
  else {
    // Standard gradient for edge-positioned content
    const position = `${horizontalPosition} ${verticalPosition}`
    gradients.push(`radial-gradient(
      circle at ${position},
      rgba(${clr} / .7) 0%,
      rgba(${clr} / 0.4) 30%,
      rgba(${clr} / 0.2) 70%,
      transparent 100%
    )`)
  }

  return {
    background: gradients.join(', '),
    inset: 0,
  }
}

export function getContentMaxWidth(item: BentoItem) {
  const { cols = 4 } = item
  // For full width (12 cols) or large items, limit the text width
  if (cols >= 8)
    return { maxWidth: '65ch' }
  return {}
}

export function getThemeColors(item: BentoItem) {
  const { theme = 'slate', themeMode = 'dark' } = item

  const colors = getColorScheme(theme, { outputFormat: 'hex' })
  const isDark = themeMode === 'dark' || (themeMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isDark) {
    return {
      background: colors[600],
      text: '#ffffff',
      subtext: colors[50],
      supertext: colors[100],
    }
  }

  return {
    background: colors[50],
    text: colors[950],
    subtext: colors[800],
    supertext: colors[600],
  }
}

const colSpanMap = {
  1: 'col-span-12 md:col-span-1',
  2: 'col-span-12 md:col-span-2',
  3: 'col-span-12 md:col-span-3',
  4: 'col-span-12 md:col-span-4',
  5: 'col-span-12 md:col-span-5',
  6: 'col-span-12 md:col-span-6',
  7: 'col-span-12 md:col-span-7',
  8: 'col-span-12 md:col-span-8',
  9: 'col-span-12 md:col-span-9',
  10: 'col-span-12 md:col-span-10',
  11: 'col-span-12 md:col-span-11',
  12: 'col-span-12',
}

export function getGridStyle(item: BentoItem) {
  const { cols = 4, rows = 2 } = item

  return {
    style: {
      gridRow: `span ${rows}`,
    },
    class: colSpanMap[cols as keyof typeof colSpanMap] || colSpanMap[4],
  }
}

export function getItemStyles(item: BentoItem) {
  const colors = getThemeColors(item)
  return {
    backgroundColor: colors.background,
    color: colors.text,
  }
}

export function getContentStyles(item: BentoItem, type: 'text' | 'super' | 'sub') {
  const colors = getThemeColors(item)
  return {
    color: type === 'text' ? colors.text : type === 'super' ? colors.supertext : colors.subtext,
  }
}

export function getTextOverlayStyles(item: BentoItem) {
  const { verticalPosition = 'bottom', horizontalPosition = 'left' } = item
  const isCentered = verticalPosition === 'center' || horizontalPosition === 'center'

  return {
    color: '#ffffff',
    textShadow: isCentered
      ? '0 2px 4px rgba(0,0,0,0.3)'
      : 'none',
  }
}
