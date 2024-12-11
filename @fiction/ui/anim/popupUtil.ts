export class PopupUtility {
  private originalBodyPosition: string
  private originalBodyTop: string
  private originalBodyLeft: string
  private originalBodyWidth: string
  private originalBodyOverflow: string
  private originalScrollPosition: number
  private siteContentElement?: HTMLElement | null
  isActivated = false

  constructor(siteContentSelector: string = '.x-site-content') {
    this.originalBodyPosition = ''
    this.originalBodyTop = ''
    this.originalBodyLeft = ''
    this.originalBodyWidth = ''
    this.originalBodyOverflow = ''
    this.originalScrollPosition = 0

    if (typeof document !== 'undefined') {
      this.siteContentElement = document.querySelector(siteContentSelector)
    }
  }

  activate() {
    this.isActivated = true
    // Store original body styles and scroll position
    this.originalBodyPosition = document.body.style.position
    this.originalBodyTop = document.body.style.top
    this.originalBodyLeft = document.body.style.left
    this.originalBodyWidth = document.body.style.width
    this.originalBodyOverflow = document.body.style.overflow
    this.originalScrollPosition = window.pageYOffset

    // Calculate transform origin based on viewport position
    const viewportHeight = window.innerHeight
    const scrolledPercent = this.originalScrollPosition / (document.documentElement.scrollHeight - viewportHeight)
    const originY = Math.min(Math.max((scrolledPercent * 100), 30), 70) // Clamp between 30% and 70%

    // Lock scroll at current position
    document.body.style.position = 'fixed'
    document.body.style.top = `-${this.originalScrollPosition}px`
    document.body.style.left = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    // Scale down effect
    if (this.siteContentElement) {
      this.siteContentElement.style.transformOrigin = `center ${originY}%`
      this.siteContentElement.style.transform = 'scale(.96)'
      this.siteContentElement.style.transition = 'transform .75s cubic-bezier(0.25, 1, 0.33, 1)'
      this.siteContentElement.style.overflow = 'hidden'
    }
  }

  deactivate() {
    if (!this.isActivated)
      return

    this.isActivated = false

    // Restore original body styles
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.width = ''
    document.body.style.overflow = ''

    // Reset scale and other styles
    if (this.siteContentElement) {
      this.siteContentElement.style.transform = 'scale(1)'
      this.siteContentElement.style.overflow = ''
    }

    // Restore original scroll position
    window.scrollTo(0, this.originalScrollPosition)

    setTimeout(() => {
      if (this.siteContentElement) {
        this.siteContentElement.style.transform = ''
        this.siteContentElement.style.transformOrigin = ''
        this.siteContentElement.style.transition = ''
      }
    }, 2000)
  }
}
