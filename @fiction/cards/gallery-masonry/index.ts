// index.ts
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'galleryMasonry'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['media'],
  icon: 'i-tabler-library-photo',
  title: 'Masonry Gallery',
  colorTheme: 'emerald',
  subTitle: 'Create stunning masonry layouts that showcase your visual content in an engaging, responsive grid',
  description: `Transform your images and videos into an immersive visual story with our dynamic masonry gallery.
Perfect for portfolios, product showcases, or photo collections. Features automatic layout optimization,
hover effects, lightbox viewing, and customizable grid arrangements.`,
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
