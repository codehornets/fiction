import { formatNumber, type NumberFormats } from '@fiction/core'
import anime from 'animejs'

type AnimationThemeConfig = Partial<{
  translateX: number[] | number
  translateY: number[] | number
  translateZ: number
  opacity: number[]
  overallDelay: number
  totalAnimationTime: number
  scale: number[]
  isRandom?: boolean
  delay?: number | ReturnType<typeof anime.stagger>
}> & anime.AnimeAnimParams

const themes: Record<string, AnimationThemeConfig > = {
  none: {},
  rise: {
    translateY: [30, 0],
    translateZ: 0,
    opacity: [0, 1],
    easing: 'easeInOutCubic',
    duration: 700, // Total duration each word's animation should last
    overallDelay: 150, // Initial delay before the first word starts animating
    totalAnimationTime: 1200, // Total time from the start of the first word's animation to the end of the last word's animation
  },
  fade: {
    translateY: [0, 0], // No vertical movement
    translateZ: 0,
    opacity: [0, 1],
    easing: 'easeInOutCubic',
    duration: 1000,
    overallDelay: 200,
    totalAnimationTime: 1200,
  },
  slide: {
    translateX: [100, 0],
    translateY: [0, 0],
    translateZ: 0,
    opacity: [0, 1],
    easing: 'easeInOutCubic',
    duration: 300,
    overallDelay: 200,
    totalAnimationTime: 1000,
    scale: [1, 1],
  },
  pop: {
    translateX: [0, 0],
    translateY: [0, 0],
    translateZ: 0,
    opacity: [0, 1],
    duration: 300,
    overallDelay: 200,
    totalAnimationTime: 1000,
    scale: [0.4, 1],
  },
}

function scaleTime(time: number | undefined, factor: number): number | undefined {
  return typeof time === 'number' ? time * factor : undefined
}

export function animateItemEnter(args: { targets: string, themeId?: keyof typeof themes, config?: AnimationThemeConfig, totalTime?: number }) {
  const { targets, themeId = 'rise', config, totalTime } = args

  if (themeId === 'none')
    return

  const theme: AnimationThemeConfig = { ...themes[themeId] || themes.rise, ...config }
  const { duration, totalAnimationTime = 1000 } = theme
  const scaleFactor = totalTime ? totalTime / totalAnimationTime : 1

  const scaledTheme = {
    ...theme,
    duration: typeof duration === 'number' ? scaleTime(duration, scaleFactor) : duration,
    overallDelay: scaleTime(theme.overallDelay, scaleFactor) || 0,
    totalAnimationTime: totalAnimationTime * scaleFactor,
  }

  function calculateDelay(el: HTMLElement, i: number, length: number) {
    if (typeof scaledTheme.duration !== 'number')
      return 0

    if (scaledTheme.isRandom) {
      return Math.random() * scaledTheme.totalAnimationTime
    }

    if (length <= 4) {
      return scaledTheme.overallDelay + 200 * scaleFactor * i
    }

    return scaledTheme.overallDelay + (scaledTheme.totalAnimationTime - scaledTheme.duration) * i / (length - 1)
  }

  anime.timeline({ loop: false }).add({
    targets,
    delay: calculateDelay,
    ...scaledTheme,
    easing: 'cubicBezier(0.25, 1, 0.33, 1)',
  })
}

export async function useElementVisible(args: { caller: string, selector: string, onVisible: () => void, onHidden?: () => void }): Promise<{ close: () => void }> {
  const { selector, onVisible, onHidden, caller = 'unknown' } = args

  if (typeof IntersectionObserver === 'undefined') {
    console.warn('IntersectionObserver is not supported in this environment.')
    return { close: () => {} }
  }

  let intervalId: NodeJS.Timeout
  let isVisible = false
  const observer = new IntersectionObserver((entries, observer) => {
    const [entry] = entries
    if (entry?.isIntersecting && !isVisible) {
      isVisible = true
      onVisible()

      if (!onHidden) {
        observer.disconnect()
      }
    }
    else if (!entry?.isIntersecting && isVisible) {
      isVisible = false
      if (onHidden) {
        onHidden()
      }
    }
  }, {
    threshold: 0.05, // Customize the threshold as needed
  })

  let count = 0
  // Function to check for element and start observing
  const checkAndObserve = () => {
    const element = document.querySelector(selector)
    if (element) {
      observer.observe(element)
      clearInterval(intervalId) // Clear the interval once the element is found and observed
    }
    else {
      count++
      if (count > 100) {
        console.warn(`Element with selector "${selector}" not found after 5 seconds (called by ${caller})`)
        clearInterval(intervalId)
      }
    }
  }

  // Interval to check for the element periodically until it is available
  intervalId = setInterval(checkAndObserve, 50) // Check every 50 ms

  return {
    close: () => {
      observer.disconnect()
      clearInterval(intervalId)
    },
  }
}

export function splitLetters(args: { selector?: string, el?: HTMLElement }): void {
  const { selector, el } = args
  const textWrapper = el || (selector ? document.querySelector(selector) : null)

  // check if wrapper is already split
  if (textWrapper?.querySelector('.word > .fx'))
    return

  if (textWrapper) {
    const processTextNode = (node: ChildNode): void => {
      const content = node.nodeValue ?? ''
      const newContent = content.replace(/&[a-z]+;|<[^>]*>|\b\w\S*|\S/gi, (match) => {
        if (match.startsWith('<') && match.endsWith('>'))
          return match
        else if (match.startsWith('&') && match.endsWith(';'))
          return `<span class="fx">${match}</span>`
        else
          return `<span class='word'>${match.split('').map(character => `<span class='fx'>${character}</span>`).join('')}</span>`
      })

      if (node.parentNode) {
        const fragment = document.createDocumentFragment()
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = newContent
        while (tempDiv.firstChild)
          fragment.appendChild(tempDiv.firstChild)

        node.parentNode.replaceChild(fragment, node)
      }
    }

    const walkNodes = (node: ChildNode): void => {
      if (node.nodeType === 3)
        processTextNode(node)

      else if (node.nodeType === 1)
        Array.from(node.childNodes).forEach(walkNodes)
    }

    walkNodes(textWrapper)
  }
}

type EasingPreset = 'smooth' | 'accelerate' | 'decelerate' | 'emphasize'

type AnimateNumberOptions = {
  duration?: number
  delay?: number
  easingPreset?: EasingPreset
  startValue?: number
  decimals?: number
  threshold?: number
  prefix?: string
  suffix?: string
  onStart?: () => void
  onComplete?: () => void
}

const EASING_CURVES: Record<EasingPreset, string> = {
  smooth: 'cubicBezier(0.4, 0.0, 0.2, 1)',
  accelerate: 'cubicBezier(0.4, 0.0, 1, 1)',
  decelerate: 'cubicBezier(0.0, 0.0, 0.2, 1)',
  emphasize: 'cubicBezier(0.0, 0.0, 0.15, 0.95)',
}

export function animateNumber(
  element: HTMLElement,
  finalValue: number | string,
  format?: NumberFormats,
  {
    duration = 1000,
    delay = 0,
    easingPreset = 'smooth',
    startValue = 0,
    decimals = 0,
    threshold = 0.1,
    prefix = '',
    suffix = '',
    onStart,
    onComplete,
  }: AnimateNumberOptions = {},
) {
  const numericFinal = typeof finalValue === 'string' ? Number.parseFloat(finalValue) : finalValue
  const scaleFactor = Math.min(Math.max(1, Math.log10(Math.abs(numericFinal - startValue)) / 3), 1.5)

  const formatValue = (value: number) => {
    const formattedNum = format
      ? formatNumber(value, format)
      : decimals > 0
        ? value.toFixed(decimals)
        : Math.round(value).toString()

    return `${prefix}${formattedNum}${suffix}`
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && entry.intersectionRatio >= threshold) {
        onStart?.()

        anime({
          targets: { value: startValue },
          value: numericFinal,
          easing: EASING_CURVES[easingPreset],
          duration: Math.round(duration * scaleFactor),
          delay,
          round: 10 ** decimals,
          update: (anim) => {
            element.innerHTML = formatValue(+(anim.animations[0]?.currentValue ?? '0'))
          },
          complete: () => {
            element.innerHTML = formatValue(numericFinal)
            onComplete?.()
          },
        })

        observer.disconnect()
      }
    },
    { threshold: [threshold] },
  )

  observer.observe(element)
  return observer.disconnect.bind(observer)
}
