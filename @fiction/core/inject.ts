import { vue } from './utils'
import type { FictionApp } from './plugin-app'
import type { FictionRouter } from './plugin-router'
import type { FictionUser } from './plugin-user'
import type { FictionEnv, ServiceList } from './plugin-env'
import type { FictionMedia } from './plugin-media'
import type { FictionDb } from './plugin-db'
import type { FictionServer } from './plugin-server'

export type RunVars = {
  APP_INSTANCE: string
  MOUNT_CONTEXT: Record<string, string>
  FICTION_ORG_ID: string // integrate db org with static
  FICTION_SITE_ID: string // integrate db site with static
  APP_PORT: string
  COMMAND: string
  COMMAND_OPTS: string
  GOOGLE_CLIENT_ID: string
  HOST: string
  HOSTNAME: string
  IP_ADDRESS: string
  IS_VITE: string
  NODE_ENV: string
  PATHNAME: string
  PROTOCOL: string
  SERVER_PORT: string
  SUBDOMAIN: string
  ORIGINAL_HOST: string
  USER_AGENT: string
  ORIGIN: string
  URL: string
  ALL_HEADERS: string
  IS_TEST: string
  VITEST: string
  CI: string
  DEBUG: string
  IS_RESTART: string
  RUNTIME_VERSION: string
  RUNTIME_COMMIT: string
}

export type StandardServices = {
  fictionRouter: FictionRouter
  fictionUser: FictionUser
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionMedia: FictionMedia
  fictionDb: FictionDb
  fictionServer: FictionServer
  runVars?: RunVars
} & ServiceList

export function useService<T extends ServiceList>(): T & StandardServices {
  const service = vue.inject<vue.ShallowRef<T & StandardServices>>('service')

  if (!service)
    throw new Error('service for injection not found')

  return service.value
}
