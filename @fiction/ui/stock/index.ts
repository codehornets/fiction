import type { tagSet } from './tags'
import { log } from '@fiction/core'

const logger = log.contextLogger('stockMedia')

type TagCategory = keyof typeof tagSet
export type Tag = typeof tagSet[TagCategory][number]

type MediaFormat = 'image' | 'video'

type MediaItem = {
  format: MediaFormat
  url: string
  tags: Tag[]
  slug: string
}

type MediaCollection = MediaItem[]

type GetMediaArgs = {
  format?: MediaFormat
  tags?: Tag[]
  caller?: string
}

export class StockMedia {
  private usedMedia: Set<string> = new Set()

  constructor() {
  }

  async getMediaCollection(): Promise<MediaCollection> {
    const { default: MediaCollection } = await import('./mediaItems.json')
    return MediaCollection as MediaCollection
  }

  private async filterMedia(args: GetMediaArgs = {}): Promise<MediaItem[]> {
    const media = await this.getMediaCollection()

    const r = media.filter((item) => {
      if (this.usedMedia.has(item.url))
        return false
      if (args.format && item.format !== args.format)
        return false
      if (args.tags && !args.tags.every(tag => item.tags.includes(tag)))
        return false
      return true
    })

    return r
  }

  private markAsUsed(item: MediaItem): void {
    if (!item.url) {
      logger.error('No url on media item', { data: { item } })
      throw new Error('No url on media item')
    }

    this.usedMedia.add(item.url)
  }

  async getRandomMedia(args: GetMediaArgs = {}): Promise<MediaItem> {
    let filteredMedia = await this.filterMedia(args)

    if (filteredMedia.length === 0 && this.usedMedia.size > 0) {
      this.resetUsedMedia()
      filteredMedia = await this.filterMedia(args)
    }

    if (filteredMedia.length === 0) {
      logger.error('No media items available', { data: { args, filteredMedia, usedMediaSize: this.usedMedia.size } })
      const m = await this.getMediaCollection()
      return m[0] ?? {}
    }

    const rand = Math.random()
    const randomIndex = Math.floor(rand * filteredMedia.length)
    const selectedItem = filteredMedia[randomIndex]

    if (!selectedItem) {
      logger.error('No media items available', { data: { args, filteredMedia } })
      throw new Error(`No media items available: tags: "${args.tags?.join(', ')}", randomIndex: ${randomIndex}, filteredMedia: ${filteredMedia.length}`)
    }

    this.markAsUsed(selectedItem)
    return selectedItem
  }

  async getAllMedia(args: GetMediaArgs = {}): Promise<MediaItem[]> {
    return this.filterMedia(args)
  }

  async getRandomByTags(tags: Tag[], args: Omit<GetMediaArgs, 'tags'> = {}): Promise<MediaItem > {
    return this.getRandomMedia({ ...args, tags })
  }

  async getRandomByAspectRatio(aspectRatio?: Extract<Tag, `aspect${string}`> | 'portrait' | 'landscape' | 'squarish', args: GetMediaArgs = {}): Promise<MediaItem> {
    let aspectTag: Tag
    if (aspectRatio === 'portrait') {
      aspectTag = 'aspect:portrait'
    }
    else if (aspectRatio === 'landscape') {
      aspectTag = 'aspect:landscape'
    }
    else if (aspectRatio === 'squarish') {
      aspectTag = 'aspect:square'
    }
    else {
      aspectTag = aspectRatio || 'aspect:square'
    }

    return this.getRandomMedia({ ...args, tags: [aspectTag, ...(args.tags || [])] })
  }

  async getAssetBySlug(partialSlug: string): Promise<MediaItem | undefined> {
    const normalizedPartialSlug = partialSlug.toLowerCase()
    const media = await this.getMediaCollection()
    return media.find(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  // New method to get all assets matching a partial slug
  async getAllAssetsBySlug(partialSlug: string): Promise<MediaItem[]> {
    const normalizedPartialSlug = partialSlug.toLowerCase()
    const media = await this.getMediaCollection()
    return media.filter(item =>
      item.slug.toLowerCase().includes(normalizedPartialSlug),
    )
  }

  resetUsedMedia(): void {
    this.usedMedia.clear()
  }
}

export const stockMediaHandler = new StockMedia()
