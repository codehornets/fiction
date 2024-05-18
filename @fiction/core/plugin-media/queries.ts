import path from 'node:path'
import type sharp from 'sharp'
import fs from 'fs-extra'
import type { C } from 'vitest/dist/reporters-yx5ZTtEV'
import { Query } from '../query'
import type { EndpointResponse } from '../types'
import type { CropSettings, EndpointMeta } from '../utils'
import type { FictionDb } from '../plugin-db'
import type { FictionAws } from '../plugin-aws'
import { createImageVariants, getFileExtensionFromFetchResponse, getMimeType, hashFile, isTest, objectId, prepareFields, safeDirname } from '../utils'
import { t } from './tables'
import type { FictionMedia, TableMediaConfig } from '.'

interface SaveMediaSettings {
  fictionMedia: FictionMedia
  fictionDb: FictionDb
  fictionAws: FictionAws
}

abstract class MediaQuery extends Query<SaveMediaSettings> {
  db = () => this.settings.fictionDb?.client()
  maxSide = isTest() ? 700 : 1600
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }

  async createBlurHash(
    img: sharp.Sharp,
    meta: sharp.OutputInfo,
  ): Promise<string | undefined> {
    /**
     * NOTE: that the raw img data removes the size/meta data
     * thats why its passed in above
     */
    const alphaImg = img.raw().ensureAlpha()
    const pixelBuffer = await alphaImg.toBuffer()

    const { width, height } = meta || {}

    if (!width || !height) {
      this.log.warn('could not create blurhash (no meta info)')
      return
    }

    const bh = await import('blurhash')

    const blurhash = bh.encode(new Uint8ClampedArray(pixelBuffer), width, height, 4, 4)

    if (bh.isBlurhashValid(blurhash))
      return blurhash
  }

  async createMediaFromUrl(args: {
    orgId?: string
    userId?: string
    fields?: TableMediaConfig
    storagePath?: string
  }, meta: EndpointMeta): Promise<TableMediaConfig | undefined> {
    const { orgId, userId, fields, storagePath } = args

    const { Buffer } = await import('node:buffer')
    const { sourceImageUrl } = fields || {}

    if (!sourceImageUrl)
      throw new Error('No sourceImageUrl provided')

    // Fetch the image from the URL
    const response = await fetch(sourceImageUrl)
    if (!response.ok)
      throw new Error(`Failed to fetch image from URL: ${sourceImageUrl}`)

    // Convert the response to a buffer
    const arrayBuffer = await response.arrayBuffer()
    const b = Buffer.from(arrayBuffer)

    // Create a temporary file to simulate a file upload
    const extension = await getFileExtensionFromFetchResponse(response)
    const fileName = `${objectId()}${extension}`
    const tempFilePath = path.join(safeDirname(import.meta.url), fileName)
    fs.writeFileSync(tempFilePath, b)

    try {
      // Call the existing createAndSaveMedia function with the simulated file
      const result = await this.createAndSaveMedia({
        filePath: tempFilePath,
        orgId,
        userId,
        fields,
        storagePath,

      }, meta)

      return result
    }
    catch (e) {
      return undefined
    }
    finally {
      fs.unlinkSync(tempFilePath)
    }
  }

  async saveReferenceToDb(mediaConfig: TableMediaConfig, meta: EndpointMeta) {
    const { userId, orgId } = mediaConfig

    const prepped = prepareFields({ type: 'create', fields: mediaConfig, table: t.media, meta, fictionDb: this.settings.fictionDb })

    const ins = { userId, orgId, ...prepped }

    const [insertedMedia] = await this.db().insert(ins).table(t.media).returning<TableMediaConfig[]>('*')

    return insertedMedia
  }

  async createAndSaveMedia(args: {
    file?: Express.Multer.File
    filePath?: string
    fields?: TableMediaConfig
    orgId?: string
    userId?: string
    storagePath?: string
    crop?: CropSettings
  }, meta: EndpointMeta): Promise<TableMediaConfig> {
    const cdn = this.settings.fictionMedia.cdnUrl
    const bucket = this.settings.fictionMedia.bucket
    const maxSide = this.maxSide
    const fictionAws = this.settings.fictionAws

    const { file, filePath: sourceFilePath, orgId, userId, fields, storagePath = orgId, crop } = args
    const fileSource = file?.buffer || (sourceFilePath && fs.readFileSync(sourceFilePath))
    const fileName = file?.originalname || (sourceFilePath && path.basename(sourceFilePath))
    const cleanFileName = fileName?.replace(/[^a-z0-9-.]/gi, '')
    const baseFileName = cleanFileName?.split('.').slice(0, -1).join('.') || cleanFileName

    if (!fileSource || !cleanFileName)
      throw new Error('No file provided')

    const fileMime = getMimeType(cleanFileName, file?.mimetype)
    const mediaId = objectId({ prefix: 'med' })
    const basePath = `${storagePath}/${mediaId}`
    const filePath = `${basePath}-${cleanFileName}`
    const thumbFilePath = `${basePath}-thumb-${baseFileName}.png`
    const rasterFilePath = `${basePath}-raster-${baseFileName}.png`

    const sizeOptions = { main: { width: maxSide, height: maxSide }, thumbnail: { width: 80, height: 80 }, crop } as const
    const r = await createImageVariants({ fileSource, sizeOptions, fileMime })

    const { mainBuffer, thumbnailBuffer, metadata, blurhash, rasterBuffer } = r

    const hash = await hashFile({ buffer: mainBuffer })

    const uploadPromises = [
      fictionAws.uploadS3({ data: mainBuffer, filePath, mime: fileMime, bucket }),
      thumbnailBuffer && fictionAws.uploadS3({ data: thumbnailBuffer, filePath: thumbFilePath, mime: 'image/png', bucket }),
      rasterBuffer && fictionAws.uploadS3({ data: rasterBuffer, filePath: rasterFilePath, mime: 'image/png', bucket }),
    ]

    const [mainData, thumbData] = await Promise.all(uploadPromises)
    const originUrl = mainData?.url

    const encodedBlurhash = blurhash ? encodeURIComponent(blurhash) : ''
    const url = `${cdn ? path.join(cdn, filePath) : originUrl}?blurhash=${encodedBlurhash}`
    const thumbOriginUrl = thumbData?.url || originUrl
    const thumbUrl = `${cdn ? path.join(cdn, thumbFilePath) : thumbOriginUrl}?blurhash=${encodedBlurhash}`

    const { ContentLength: size, ContentType: mime = fileMime } = mainData?.headObject || {}
    const { width, height, orientation } = metadata || {}

    const mediaConfig: TableMediaConfig = {
      ...fields,
      orgId,
      userId,
      mediaId,
      hash,
      blurhash,
      originUrl,
      url,
      thumbOriginUrl,
      thumbUrl,
      mime,
      bucket,
      filePath,
      size,
      width,
      height,
      orientation,
    }

    const insertedMedia = await this.saveReferenceToDb(mediaConfig, meta)

    return insertedMedia
  }
}

export class QuerySaveMedia extends MediaQuery {
  async run(
    _params: Record<string, unknown>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableMediaConfig>> {
    // created by multer
    const file = meta.request?.file
    const userId = meta.request?.body.userId
    const orgId = meta.request?.body.orgId

    if (!file)
      throw this.stop('no file provided to endpoint by request')
    if (!userId || !orgId)
      throw this.stop('no userId or orgId')

    const media = await this.createAndSaveMedia({ file, userId, orgId }, meta)

    const message = 'uploaded successfully'

    return { status: 'success', data: media, message }
  }
}

interface MediaIndexParams {
  _action: 'list'
  limit?: number
  userId?: string
  url?: string
}

export class QueryMediaIndex extends MediaQuery {
  async run(
    params: MediaIndexParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableMediaConfig[]>> {
    const { _action } = params

    const userId = params.userId || meta.bearer?.userId

    if (_action !== 'list')
      throw this.stop('invalid action')
    if (!userId)
      throw this.stop('userId required')

    const r = await this.db()
      .select('*')
      .from(t.media)
      .where({ userId })

    return { status: 'success', data: r, message: '' }
  }
}

type ManageMediaParams = {
  _action: 'delete' | 'retrieve' | 'checkAndCreate' | 'createFromUrl'
  fields: TableMediaConfig
  userId?: string
  orgId?: string
  storagePath?: string
  crop?: CropSettings
}

export class QueryManageMedia extends MediaQuery {
  async run(params: ManageMediaParams, meta: EndpointMeta): Promise<EndpointResponse<TableMediaConfig | undefined>> {
    this.validateParams(params)
    const { _action } = params

    let media: TableMediaConfig | undefined = undefined
    let message = ''

    switch (_action) {
      case 'createFromUrl':
        media = await this.handleCreateFromUrl(params, meta)
        break
      case 'checkAndCreate':
        media = await this.handleCheckAndCreate(params, meta)
        message = media ? 'using existing media' : 'created successfully'
        break
      case 'retrieve':
        media = await this.handleRetrieve(params)
        break
      case 'delete':
        media = await this.handleDelete(params)
        message = 'deleted successfully'
        break
      default:
        throw this.stop('Invalid action')
    }

    if (!media)
      return { status: 'error', data: undefined }

    return { status: 'success', data: media, message }
  }

  validateParams(params: ManageMediaParams) {
    if (!params._action)
      throw this.stop('Invalid action')

    if (!params.orgId || !params.userId)
      throw this.stop('userId or orgId required')
  }

  async handleCreateFromUrl(params: ManageMediaParams, meta: EndpointMeta): Promise<TableMediaConfig | undefined> {
    if (params._action !== 'createFromUrl')
      throw this.stop('Invalid action')

    const { orgId, userId, fields, storagePath } = params
    return await this.createMediaFromUrl({ orgId, userId, fields, storagePath }, meta)
  }

  async handleCheckAndCreate(params: ManageMediaParams, meta: EndpointMeta): Promise<TableMediaConfig | undefined> {
    if (params._action !== 'checkAndCreate')
      throw this.stop('Invalid action')

    const { fields, storagePath, userId, orgId, crop } = params
    const { filePath } = fields

    if (!filePath)
      throw this.stop('File path is required for checkAndCreate action.')

    const fileHash = await hashFile({ filePath })

    const [existingMedia] = await this.db().select().from(t.media).where({ hash: fileHash })

    let media: TableMediaConfig | undefined = undefined

    if (!existingMedia)
      media = await this.createAndSaveMedia({ filePath, userId, orgId, fields, storagePath, crop }, meta)

    else
      media = existingMedia

    return media
  }

  async handleRetrieve(params: ManageMediaParams): Promise<TableMediaConfig | undefined> {
    if (params._action !== 'retrieve')
      throw this.stop('Invalid action')

    const { orgId, fields } = params

    const { url, mediaId, hash } = fields

    const queryConditions = { orgId, ...(url && { url }), ...(mediaId && { mediaId }), ...(hash && { hash }) }

    const [media] = await this.db().select().from(t.media).where(queryConditions)

    return media
  }

  async handleDelete(params: ManageMediaParams): Promise<TableMediaConfig | undefined> {
    if (params._action !== 'delete')
      throw this.stop('Invalid action')

    const { orgId, fields } = params

    const { url, mediaId, hash } = fields

    const queryConditions = { orgId, ...(url && { url }), ...(mediaId && { mediaId }), ...(hash && { hash }) }

    const [media] = await this.db().delete().from(t.media).where(queryConditions).returning<TableMediaConfig[]>('*')

    if (media && media.url) {
      const filePath = new URL(media.url).pathname.replace(/^\/+/g, '')
      await this.settings.fictionAws.deleteS3({ filePath, bucket: this.settings.fictionMedia.bucket })
    }

    return media
  }
}
