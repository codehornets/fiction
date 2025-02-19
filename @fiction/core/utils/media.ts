import type { Buffer } from 'node:buffer'
import type sharp from 'sharp'
import type { MediaObject } from '../schemas/schemas.js'
import path from 'node:path'
import fs from 'fs-extra'
import { stringify } from './utils'

export function determineMediaFormat(media?: MediaObject): MediaObject['format'] | undefined {
  if (!media)
    return undefined

  // Helper functions
  const isValidUrl = (str: string): boolean => {
    try {
      const _x = new URL(str, 'http://dummybase.com')
      return true
    }
    catch {
      return false
    }
  }

  const getExtension = (url: string): string =>
    url.split('.').pop()?.toLowerCase() || ''

  const isImageHost = (hostname: string): boolean =>
    ['imgur', 'gravatar', 'flickr'].some(host => hostname.includes(host))

  const formatMap: Record<string, string> = {
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    webp: 'image',
    svg: 'image',
    mp4: 'video',
    webm: 'video',
    ogg: 'video',
    html: 'html',
  }

  // Main logic
  if (media.format !== 'url') {
    if (media.format)
      return media.format
    if (media.iconId)
      return 'iconId'
    if (media.class)
      return 'iconClass'
    if (media.html)
      return 'html'
  }

  if (media.url && isValidUrl(media.url)) {
    const url = new URL(media.url, 'http://dummybase.com')

    const extension = getExtension(url.pathname)

    if (formatMap[extension]) {
      return formatMap[extension] as MediaObject['format']
    }

    if (isImageHost(url.hostname))
      return 'image'

    return 'image'
  }

  return undefined
}

export async function hashFile(fileInput: {
  filePath?: string
  buffer?: Buffer
  settings?: object
}): Promise<string> {
  const { createHash } = await import('node:crypto')
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')

    const { filePath, buffer, settings } = fileInput

    if (settings) {
      const settingsString = stringify(settings)
      hash.update(settingsString)
    }

    if (filePath) {
      // If a file path is provided, read the file as a stream
      const stream = fs.createReadStream(filePath)

      stream.on('data', chunk => hash.update(chunk))
      stream.on('end', () => resolve(hash.digest('hex')))
      stream.on('error', err => reject(err))
    }
    else if (buffer) {
      // If a buffer is provided (e.g., from a Multer file), use it directly
      hash.update(buffer)
      resolve(hash.digest('hex'))
    }
    else {
      // Handle the case where neither a buffer nor a path is provided
      reject(new Error('No valid file input provided'))
    }
  })
}

export async function createBlurHash(img: sharp.Sharp, meta: sharp.OutputInfo): Promise<string | undefined> {
  const { encode, isBlurhashValid } = await import('blurhash')

  const alphaImg = img.raw().ensureAlpha()
  const pixelBuffer = await alphaImg.toBuffer()

  const { width, height } = meta

  if (!width || !height) {
    console.warn('Could not create blurhash (no meta info)')
    return
  }

  const blurhash = encode(new Uint8ClampedArray(pixelBuffer), width, height, 4, 4)

  if (isBlurhashValid(blurhash))
    return blurhash
}

export type CropSettings = { width: number, height: number, left: number, top: number }

export type ImageSizeOptions = {
  main: { width: number, height: number }
  thumbnail: { width: number, height: number }
  crop?: CropSettings
}

export type ImageVariantStreams = {
  mainImage?: sharp.Sharp
  thumbnailImage?: sharp.Sharp
  mainBuffer: Buffer
  thumbnailBuffer?: Buffer
  rasterBuffer?: Buffer
  metadata?: sharp.Metadata
  blurhash?: string
}

export async function createImageVariants(args: { fileSource: Buffer, sizeOptions: ImageSizeOptions, fileMime: string }): Promise<ImageVariantStreams> {
  const { fileSource, sizeOptions, fileMime } = args

  const isRaster = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileMime)
  const isSvg = fileMime === 'image/svg+xml'
  const isImage = isRaster || isSvg

  if (!isImage)
    return { mainBuffer: fileSource }

  const { default: sharp } = await import('sharp')

  const out: ImageVariantStreams = { mainBuffer: fileSource }
  const width = sizeOptions.main.width
  const height = sizeOptions.main.height
  const resizeOptions = { withoutEnlargement: true, fit: 'inside', kernel: sharp.kernel.nearest } as const
  try {
    if (isSvg) {
      out.mainImage = sharp(fileSource, { density: 300 }).resize(width, height, { kernel: sharp.kernel.nearest, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })

      out.rasterBuffer = await out.mainImage.toBuffer()
    }
    else {
      let mainImage = sharp(fileSource).withMetadata()
      if (sizeOptions.crop)
        mainImage = mainImage.extract(sizeOptions.crop)

      out.mainImage = mainImage.resize(width, height, resizeOptions)
      out.mainBuffer = await mainImage.toBuffer()
    }

    const baseImage = out.mainImage
    if (baseImage) {
      out.thumbnailImage = baseImage.clone().resize(sizeOptions.thumbnail.width, sizeOptions.thumbnail.height, resizeOptions).png()
      const thumb = await out.thumbnailImage.toBuffer({ resolveWithObject: true })
      out.thumbnailBuffer = thumb.data

      out.blurhash = thumb.info ? await createBlurHash(out.thumbnailImage, thumb.info) : ''
    }

    out.metadata = await out.mainImage.metadata()
  }
  catch (error) {
    console.error('Error processing image:', error)
  }

  return out
}

const mimeTypes: { [extension: string]: string } = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.avi': 'video/x-msvideo',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.zip': 'application/zip',
  // Add more as needed
}

export function getExtensionFromMimeType(mimeType: string): string {
  const entries = Object.entries(mimeTypes)
  for (const [extension, type] of entries) {
    if (type === mimeType)
      return extension // Return extension including the dot
  }
  return '.jpg' // Default extension if not found
}

export async function getFileExtensionFromFetchResponse(response: Response) {
  if (!response.ok)
    throw new Error(`Failed to fetch: ${response.url}`)

  // Extract MIME type from the Content-Type header
  const contentType = response.headers.get('Content-Type')
  const mimeType = contentType ? contentType.split(';')[0] : ''

  return getExtensionFromMimeType(mimeType)
}

export function getMimeType(filePath: string, fileMimeType?: string): string {
  const ext = path.extname(filePath).toLowerCase()

  const mime = mimeTypes[ext] || fileMimeType || 'application/octet-stream'
  if (!mime)
    throw new Error(`No mimeType found for file: ${filePath}`)

  return mime
}
