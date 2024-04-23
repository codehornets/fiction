/**
 * @vitest-environment happy-dom
 */
import { createTestUtils } from '@fiction/core/test-utils/init'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { getTestEmail, snap } from '../../test-utils'
import type { User } from '../types'

let user: Partial<User> | undefined
let token: string | undefined
const email = getTestEmail()

describe('user tests', async () => {
  const testUtils = createTestUtils()
  await testUtils.init()

  afterAll(async () => {
    await testUtils.close()
  })

  it('creates user', async () => {
    const spy = vi.spyOn(testUtils?.fictionEmail, 'sendEmail')

    const { fictionUser } = testUtils ?? {}
    const response = await fictionUser?.requests.StartNewUser.request({
      email,
      fullName: 'test',
    })

    expect(response?.data).toBeTruthy()

    user = response?.user
    token = response?.token

    expect(spy).toHaveBeenCalled()

    // due to timeouts
    delete user.geo

    expect(snap(user, { maskedKeys: ['cityName', 'timezone', 'ipOrganization', 'latitude', 'longitude', 'regionName'] })).toMatchInlineSnapshot(`
      {
        "createdAt": "[dateTime:]",
        "email": "[email:********+**********@*****.***]",
        "fullName": "[name:****]",
        "lastSeenAt": "[dateTime:]",
        "orgs": "[object Object]",
        "role": "subscriber",
        "status": "active",
        "updatedAt": "[dateTime:]",
        "userId": "[id:***************************]",
      }
    `)

    expect(user?.userId).toBeTruthy()
    expect(user?.fullName).toBe('test')
    expect(token).toBeTruthy()
    expect(user?.verificationCode).toBeFalsy()
    expect(user?.emailVerified).toBeFalsy()
    const fields = testUtils?.fictionUser.decodeClientToken(token)

    expect(fields).toBeTruthy()
  }, 20000)

  it('verifies with code', async () => {
    const { fictionUser } = testUtils ?? {}
    const response = await fictionUser?.requests.VerifyAccountEmail.request({
      email,
      verificationCode: 'test',
    })

    if (!response?.data) {
      console.warn(response)
      throw new Error('problem verifying user')
    }

    user = response.data

    expect(response.message).toMatchInlineSnapshot(`"verification successful"`)
    expect(user?.emailVerified).toBeTruthy()
  })

  it('sets the fallback organization', async () => {
    const { fictionUser } = testUtils ?? {}

    expect(fictionUser.fallbackOrgId.value).toBeTruthy()
    expect(fictionUser.activeOrgId.value).toBeTruthy()
  })

  it('handles route organization', async () => {
    const { fictionUser } = testUtils ?? {}

    expect(fictionUser.fallbackOrgId.value).toBeTruthy()
    expect(fictionUser.activeOrgId.value).toBeTruthy()
  })
})
