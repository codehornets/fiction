import type http from 'node:http'
import path from 'node:path'
import fs from 'fs-extra'
import type { ViteDevServer } from 'vite'
import { createServer } from 'vite'
import type { Browser, BrowserContextOptions, LaunchOptions } from 'playwright'
import type { faker } from '@faker-js/faker'
import { createExpressApp, safeDirname, vue } from '../utils'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import { version } from '../package.json'
import sharedConfig from './vite.config'

interface TestingConfig {
  headless?: boolean
  uiSpeed?: number
  devtools?: false
  playwrightSettings?: LaunchOptions
  random?: boolean
  mode?: 'development' | 'production'
  isLive?: vue.Ref<boolean>
  liveUrl?: string
}
type FictionTestingAppSettings = {
  port?: number
  head?: string
  body?: string
} & TestingConfig &
FictionPluginSettings
export class FictionTestingApp extends FictionPlugin<FictionTestingAppSettings> {
  port = this.settings.port
  liveUrl = this.settings.liveUrl
  localUrl = `http://localhost:${this.port}`
  url = vue.computed(() => {
    const isLive = this.settings.isLive?.value || false
    return isLive && this.liveUrl ? this.liveUrl : this.localUrl
  })

  head = this.settings.head || ''
  body = this.settings.body || ''
  root = safeDirname(import.meta.url)
  server?: http.Server
  browser?: Browser
  faker?: typeof faker
  initialized: Promise<void> = Promise.resolve()
  visitorId: number = 0
  headless = this.settings.headless ?? true
  uiSpeed = this.settings.uiSpeed ?? 1000
  playwrightSettings = this.settings.playwrightSettings || {}
  viewportSizes = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 414, height: 896 },
    { width: 480, height: 853 },
    { width: 700, height: 1200 },
  ]

  isLive = this.settings.isLive ?? false
  useBuilt = true
  version = version
  constructor(settings: FictionTestingAppSettings) {
    super('testingApp', settings)
  }

  async initialize(settings: TestingConfig) {
    if (this.browser && this.faker) {
      return {
        faker: this.faker,
        browser: this.browser,
      }
    }

    const playwright = await import('playwright')
    const { faker } = await import('@faker-js/faker')

    const launchSettings = {
      headless: this.headless,
      slowMo: this.uiSpeed,
      devtools: false,
      ...this.playwrightSettings,
      ...settings,
    }

    this.log.info('creating playwright with settings', { data: launchSettings })
    const browser = await playwright.chromium.launch(launchSettings)

    return { faker, browser }
  }

  async newContext(
    opts: TestingConfig = {},
    contextOpts: BrowserContextOptions = {},
  ) {
    if (!this.server)
      throw new Error('no testing app server created')

    const { faker, browser } = await this.initialize(opts)

    const { random = true } = opts

    const userAgent = faker.internet.userAgent()
    const rand = Math.floor(Math.random() * this.viewportSizes.length)
    const viewport = this.viewportSizes[rand]
    const locale = 'en-US'
    const contextSettings: BrowserContextOptions = random
      ? {
          userAgent,
          viewport,
          locale,
          ...contextOpts,
        }
      : contextOpts

    const context = await browser.newContext(contextSettings)

    return {
      context,
      url: this.url,
      userAgent,
      viewport,
      locale,
    }
  }

  async close() {
    await this.browser?.close()
    this.browser = undefined

    this.server?.close()
  }

  logReady(): void {
    const port = `[ ${this.port} ]`

    this.log.info(`serving test app [ready]`, {
      data: {
        port,
        liveUrl: this.liveUrl,
        localUrl: this.localUrl,
        isLive: this.settings.isLive?.value ?? false,
        version: this.version,
      },
    })
  }

  async createApp(options: { head?: string, body?: string } = {}) {
    if (this.fictionEnv?.isApp.value)
      return

    let { head = '', body = '' } = options

    this.log.info('creating test app', { head, useBuilt: this.useBuilt })

    head = [head, this.head].join('\n')
    body = [body, this.body].join('\n')

    const app = createExpressApp({
      // in dev these cause images/scripts to fail locally
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      id: 'testingApp',
    })

    let viteServer: ViteDevServer | undefined

    if (this.useBuilt) {
      const { default: serveStatic } = await import('serve-static')
      const clientDir = path.join(this.root, 'dist/client')
      app.use(serveStatic(clientDir, { index: false }))
    }
    else {
      viteServer = await createServer({
        root: this.root,
        mode: 'production',
        server: {
          middlewareMode: true,
          hmr: false,
        },
        appType: 'custom',
        ...sharedConfig({ buildName: 'ssr' }),
      })
      app.use(viteServer.middlewares)
    }

    app.use('*', async (req, res) => {
      const url = req.originalUrl
      try {
        let template = ''

        if (this.useBuilt) {
          template = fs.readFileSync(
            path.join(this.root, 'dist/client/index.html'),
            'utf8',
          )
        }
        else {
          template = fs.readFileSync(
            path.resolve(this.root, 'index.html'),
            'utf8',
          )

          const transformed = await viteServer?.transformIndexHtml(
            url,
            template,
          )

          template = transformed || ''
        }

        const appHtml = ''

        const html = template
          .replace(`<!--app-html-->`, appHtml)
          .replace(/<\/head>/i, `${head}\n</head>`)
          .replace(/<\/body>/i, `${body}\n</body>`)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      }
      catch (error) {
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
        viteServer?.ssrFixStacktrace(error as Error)
        this.log.error('test app middleware error', { error })
      }
    })

    this.server = app.listen(this.port)

    this.server.addListener('error', (error: Error) => {
      this.log.error('test app server error', { error })
    })

    this.logReady()

    return this.server
  }
}
