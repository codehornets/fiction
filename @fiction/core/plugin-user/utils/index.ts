import type { MediaObject } from '@fiction/platform'
import type { FictionUser, Organization, User } from '..'
import type { FictionDb } from '../../plugin-db'
import type { WhereUser } from '../endpoint'
import type { VerificationCode } from '../schema'
import bcrypt from 'bcrypt'
import { standardTable } from '../../tbl'
import { gravatarUrlSync, isValid, toLabel } from '../../utils'
import { abort } from '../../utils/error'
import { dayjs } from '../../utils/libraries'

export function getOrgAvatar(org: Organization): MediaObject {
  return org.avatar ? org.avatar : gravatarUrlSync(org.orgEmail, { size: 400, default: 'identicon' })
}

export function defaultOrgName(email: string, suffix: string = 'Newsletter'): string {
  // Extract username from email and clean special characters
  const username = email.substring(0, email.lastIndexOf('@')).split('+')[0]

  const capitalized = toLabel(username).replace(/\W/g, '').replace(/\d+$/, '')

  // Append possessive form correctly based on the last character
  const possessiveUsername = capitalized + (capitalized.endsWith('s') ? '\'' : '\'s')

  const orgName = [possessiveUsername, suffix].join(' ')

  return orgName
}
/**
 * A random 6 digit number, ideal for verification code
 */
export function getCode(): string {
  return Math.random().toString().slice(2, 8)
}
/**
 * Create a md5 of password
 * @remarks
 * 6 salt rounds - https://security.stackexchange.com/a/83382
 */
export async function hashPassword(password?: string): Promise<string | undefined> {
  return password ? bcrypt.hash(password, 6) : undefined
}
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function setUserVerificationCode(params: { context: string, fictionUser: FictionUser, where: WhereUser }): Promise<User | undefined> {
  const { where, fictionUser, context } = params

  const code = getCode()
  const verify: VerificationCode = {
    code,
    expiresAt: dayjs().add(1, 'day').toISOString(),
    context,
  }

  const result = await fictionUser.queries.ManageUser.serve({ _action: 'update', where, fields: { verify } }, { server: true })

  const user = result.data

  return user
}

/**
 * Verify if a passed code matches the stored one
 */
export async function verifyCode(args: {
  email?: string
  userId?: string
  verificationCode: string
  fictionDb: FictionDb
  isProd?: boolean
}): Promise<true> {
  const { email, verificationCode, userId, fictionDb, isProd = true } = args

  if (!verificationCode)
    throw abort(`no code provided`)

  if (!email && !userId)
    throw abort(`need email or userId`)

  const where = userId ? { userId } : { email }

  const db = fictionDb.client()
  const r = await db
    .select<{ verify: VerificationCode }[]>(['verify'])
    .from(standardTable.user)
    .where(where)

  const row = r && r.length > 0 ? r[0] : undefined
  const verify = row?.verify

  // allow short circuit in development
  if (!isProd && verificationCode === 'test')
    return true

  if (!verify || verify.code !== verificationCode)
    throw abort(`verification code is not a match (${isProd ? 'prod' : 'dev'})`, { data: !isProd ? { verify, verificationCode } : {} })

  else if (!verify.expiresAt || dayjs().isAfter(verify.expiresAt))
    throw abort(`verification code is expired`)

  return true
}

export async function emailExists(params: { email: string, fictionUser: FictionUser }): Promise<boolean> {
  const { fictionUser } = params

  const email = params.email.toLowerCase().trim()

  if (!isValid(email, 'email'))
    throw abort('email is not formatted correctly')

  const { data: user } = await fictionUser.queries.ManageUser.serve(
    { _action: 'retrieve', where: { email } },
    { server: true, returnAuthority: ['verify'] },
  )

  return !!user?.userId
}

/**
 * Verify a new user email is valid and unique
 */
export async function validateNewEmail(params: {
  newEmail?: string
  code?: string
  existingUser?: User
  fictionUser: FictionUser
  onValidNewEmail: (email: string) => Promise<void> | void
}): Promise<true> {
  const { newEmail, fictionUser, existingUser, code = '' } = params

  const { fictionDb, fictionEnv } = fictionUser.settings
  const email = newEmail?.toLowerCase().trim()

  // if no email or same as existing, return true
  if (!email || email === existingUser?.email) {
    return true
  }

  if (!code) {
    throw abort(`code is required to change email from ${existingUser?.email} to ${email}`, { data: { email } })
  }

  const exists = await emailExists({ email, fictionUser })

  if (exists)
    throw abort(`verifyEmail: email ${email} already exists`, { data: { email } })

  const { userId } = existingUser || {}

  const isProd = fictionEnv.isProd.value

  await verifyCode({ email, userId, verificationCode: code, fictionDb, isProd })

  await params.onValidNewEmail(email)

  return true
}
