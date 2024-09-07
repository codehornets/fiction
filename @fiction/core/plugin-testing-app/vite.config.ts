import path from 'node:path'
import pluginVue from '@vitejs/plugin-vue'
import type { InlineConfig } from 'vite'
import { safeDirname } from '../utils'

export default (_opts: { buildName: string }): InlineConfig => {
  const vars = {
    NODE_ENV: 'production',
  }

  const root = safeDirname(import.meta.url)

  const processDefines = Object.fromEntries(
    Object.entries(vars).map(([k, v]) => {
      return [`process.env.${k}`, JSON.stringify(v)]
    }),
  )

  const { buildName } = _opts

  let ssr
  let ssrManifest
  let outDir
  if (buildName === 'testAppServer') {
    ssr = path.join(root, 'src/server-entry.ts')
    outDir = path.join(root, 'dist', 'server')
  }
  else if (buildName === 'testAppClient') {
    ssrManifest = true
    outDir = path.join(root, 'dist', 'client')
  }

  return {
    define: processDefines,
    configFile: false,
    root,
    build: { outDir, ssr, ssrManifest },
    plugins: [
      pluginVue(),

    ],
  }
}
