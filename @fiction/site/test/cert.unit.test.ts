/**
 * @vitest-environment happy-dom
 */
import type { SiteTestUtils } from './testUtils'
import { isCi } from '@fiction/core'
import { snap } from '@fiction/core/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from './testUtils'

let testUtils: SiteTestUtils
describe('manageCertificates', { retry: isCi() ? 3 : 0 }, () => {
  const hostname = 'example.com'
  const maskedKeys = ['id', 'dnsValidationInstructions', 'dnsValidationTarget', 'issued', 'nodes']
  beforeAll(async () => {
    testUtils = await createSiteTestUtils()
    await testUtils.init()
  })

  it('should set certificates', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'www.fiction.com', appId: 'fiction-website', allowInTest: true })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`undefined`)

    const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname: 'test-site.fiction.com', appId: 'fiction-sites', allowInTest: true })
    expect(r2.status).toBe('success')
    expect(snap(r2.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "check",
        "acmeAlpnConfigured": "true",
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "check": "true",
        "clientStatus": "Ready",
        "configured": "true",
        "createdAt": "[dateTime:]",
        "dnsProvider": "cloudflare",
        "dnsValidationHostname": "_acme-challenge.test-site.fiction.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "test-site.fiction.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": "**MASKED**",
        },
        "source": "fly",
      }
    `)
  })

  it('should get certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'retrieve', hostname, allowInTest: true })
    expect(r1.status).toBe('success')
    expect(r1.data).toMatchInlineSnapshot(`undefined`)

    if (r1.data) {
      const r2 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname, allowInTest: true })

      expect(r2.status).toBe('success')
      expect(r2.data).toMatchInlineSnapshot(`undefined`)
    }
  })

  it('should create certificate', async () => {
    if (!testUtils)
      throw new Error('testUtils not defined')

    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'create', hostname, allowInTest: true })
    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "create",
        "acmeAlpnConfigured": false,
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "certificateRequestedAt": null,
        "configured": false,
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "source": "fly",
      }
    `)
  })

  it('should check certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'check', hostname, allowInTest: true })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "check",
        "acmeAlpnConfigured": false,
        "acmeDnsConfigured": false,
        "certificateAuthority": "lets_encrypt",
        "check": false,
        "clientStatus": "Awaiting configuration",
        "configured": false,
        "createdAt": "[dateTime:]",
        "dnsProvider": "icann",
        "dnsValidationHostname": "_acme-challenge.example.com",
        "dnsValidationInstructions": "**MASKED**",
        "dnsValidationTarget": "**MASKED**",
        "hostname": "example.com",
        "id": "**MASKED**",
        "issued": {
          "nodes": "**MASKED**",
        },
        "source": "fly",
      }
    `)
  })

  it('should delete certificate', async () => {
    const r1 = await testUtils.fictionSites.requests.ManageCert.request({ _action: 'delete', hostname, allowInTest: true })

    expect(r1.status).toBe('success')
    expect(snap(r1.data, { maskedKeys })).toMatchInlineSnapshot(`
      {
        "_action": "delete",
        "hostname": "example.com",
        "id": "**MASKED**",
      }
    `)
  })
})
