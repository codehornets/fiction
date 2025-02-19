import type { FactorPost } from './__post'

export type Attachment = {
  mimetype: string
  imageData?: Buffer
  size: number
  url: string
} & FactorPost

export interface PreUploadProperties {
  mode?: 'resized' | 'started' | 'finished'
  percent?: number
  preview?: string
}
