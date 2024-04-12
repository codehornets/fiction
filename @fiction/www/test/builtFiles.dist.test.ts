import { describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { randomBetween, safeDirname } from '@fiction/core'
import { appRunTest } from '@fiction/core/test-utils/buildTest'
import { execaCommandSync } from 'execa'

describe('pre check secrets', () => {
  const services = [
    { appId: 'fiction-sites' },
    { appId: 'fiction-website' },
  ]
  it('has secrets', async () => {
    const token = process.env.FLY_API_TOKEN

    if (!token) {
      console.error('!!!FLY_API_TOKEN not found!!!')
      return
    }

    for (const service of services) {
      const { stdout } = execaCommandSync(`flyctl secrets list -a ${service.appId} --access-token ${token}`)

      const secrets = ['FLY_API_TOKEN', 'POSTGRES_URL', 'GH_TOKEN', 'TOKEN_SECRET', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
      for (const secret of secrets)
        expect(stdout).toContain(secret)
    }
  })
})

describe('files built', () => {
  const dir = safeDirname(import.meta.url, '..')
  const distDir = `${dir}/dist`
  it('has dist files', async () => {
    const files = await fs.readdir(distDir)

    const expectedDirs = ['app', 'sites']
    expect(files).toEqual(expect.arrayContaining(expectedDirs))

    const expectedFiles = ['client', 'server']

    for (const dir of expectedDirs) {
      const dirFiles = await fs.readdir(`${distDir}/${dir}`)
      expect(dirFiles).toEqual(expect.arrayContaining(expectedFiles))
    }

    const clientFiles = ['index.html', 'assets']
    const serverFiles = ['mount.js', 'assets']

    const clientDirFiles = await fs.readdir(`${distDir}/app/client`)

    expect(clientDirFiles).toEqual(expect.arrayContaining(clientFiles))

    const serverDirFiles = await fs.readdir(`${distDir}/app/server`)

    expect(serverDirFiles).toEqual(expect.arrayContaining(serverFiles))
  })
})

describe('serving built files', async () => {
  it('runs app', async () => {
    const appPort = randomBetween(1050, 60000)
    const sitesPort = randomBetween(1050, 60000)
    let html = ''
    let status = 0
    await appRunTest({
      cmd: `npm exec -w @fiction/www -- fiction run app --app-port=${appPort} --sites-port=${sitesPort}`,
      port: appPort,
      onTrigger: async () => {
        const response = await fetch(`http://localhost:${appPort}/`)
        html = await response.text()
        status = response.status
      },
    })
    expect(status).toBe(200)
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('runs sites sub domain', async () => {
    const appPort = randomBetween(1050, 60000)
    const sitesPort = randomBetween(1050, 60000)
    let html = ''
    let status = 0
    await appRunTest({
      cmd: `npm exec -w @fiction/www -- fiction run sites --app-port=${appPort} --sites-port=${sitesPort}`,
      port: appPort,
      onTrigger: async () => {
        const response = await fetch(`http://test.lan.com:${sitesPort}/`)
        html = await response.text()
        status = response.status
      },
    })
    expect(status).toBe(200)
    expect(html).toContain('<!DOCTYPE html>')
  })
})
