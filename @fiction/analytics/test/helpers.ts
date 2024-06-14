import type { FictionMedia, Organization } from '@fiction/core'
import { FictionAws, FictionCache, getEnvVars, objectId, setupTestPorts, waitFor } from '@fiction/core'
import { faker } from '@faker-js/faker'
import type express from 'express'
import type { InitializedTestUtils, TestUtils } from '@fiction/core/test-utils/init.js'
import { createTestUtils, initializeTestUtils } from '@fiction/core/test-utils/init.js'
import { testEnvFile } from '@fiction/core/test-utils'
import { runServicesSetup } from '@fiction/core/plugin-env/entry.js'
import { FictionClient } from '@fiction/core/tag/client.js'
import type { FictionEvent, FictionEventUserDefined } from '../tracking.js'
import type { FictionBeacon } from '../plugin-beacon/index.js'
import type { FictionClickHouse } from '../plugin-clickhouse/index.js'
import { FictionAnalytics } from '../index.js'

export type AnalyticsTestUtils = TestUtils & {
  fictionMedia: FictionMedia
  fictionAws: FictionAws
  fictionAnalytics: FictionAnalytics
  fictionCache: FictionCache
  fictionClickhouse: FictionClickHouse
  fictionBeacon: FictionBeacon
  runApp: (args: { context: 'app' | 'node', isProd?: boolean }) => Promise<void>
  close: () => Promise<void>
  start: () => Promise<AnalyticsInitializedTestUtils>
  end: () => Promise<void>
  anonymousId: string
}

type AnalyticsInitializedTestUtils = InitializedTestUtils & {
  fictionClient: FictionClient
  org: Organization
}

export async function createAnalyticsTestUtils(args: { mainFilePath?: string, context?: 'node' | 'app' } = {}): Promise<AnalyticsTestUtils> {
  const { mainFilePath, context = 'node' } = args

  const testUtils = createTestUtils({ mainFilePath, envFiles: [testEnvFile], ...args })

  const envVarNames = ['AWS_BUCKET_MEDIA', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'FLY_API_TOKEN', 'OPENAI_API_KEY'] as const
  const v = getEnvVars(testUtils.fictionEnv, envVarNames)

  const fictionEnv = testUtils.fictionEnv

  const { awsAccessKey, awsAccessKeySecret } = v
  const out = { ...testUtils } as Partial<AnalyticsTestUtils> & TestUtils
  out.fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret })

  const { beaconPort, sessionPort } = setupTestPorts({ opts: args, envVars: ['BEACON_PORT', 'SESSION_PORT'] as const, context })

  out.fictionCache = new FictionCache({ ...out, redisUrl: 'http://localhost:8123' })
  out.fictionAnalytics = new FictionAnalytics({ ...(out as AnalyticsTestUtils), clickhouseUrl: 'http://localhost:8123', beaconPort })
  out.fictionClickhouse = out.fictionAnalytics.fictionClickhouse
  out.fictionBeacon = out.fictionAnalytics.fictionBeacon

  await runServicesSetup(out, { context: 'test' })

  out.fictionEnv.log.info(`Analytics Test Utils Created (${context})`)

  out.close = () => testUtils.close()

  out.start = async (): Promise<AnalyticsInitializedTestUtils> => {
    const promises = [
      out.fictionAnalytics?.fictionClickhouse?.init(),
      out.fictionCache?.init(),
    ]

    await Promise.all(promises)

    const created = await initializeTestUtils(out)

    const initialized: AnalyticsInitializedTestUtils = {
      ...created,
      fictionClient: new FictionClient({ orgId: created.orgId }),
    }

    return initialized
  }

  out.anonymousId = objectId()

  out.close = async () => {
    await testUtils.close()
    await out.fictionBeacon?.close()
    await out.fictionAnalytics?.close()
  }

  return out as AnalyticsTestUtils
}

export async function createFictionEvents(testUtils: AnalyticsTestUtils, fictionClient: FictionClient): Promise<FictionEvent[]> {
  const events = [] as FictionEvent[]
  const anonymousId = testUtils.anonymousId
  const generatedEvents: FictionEventUserDefined[] = [
    { type: 'track', event: 'view', anonymousId },
    { type: 'track', event: 'view', anonymousId },
    {
      type: 'identify',
      event: 'identify',
      anonymousId,
      userId: 'user1',
      traits: { email: 'em@ail.com' },
    },
    {
      event: 'custom',
      anonymousId,
      properties: { label: 'test' },
    },
  ]

  const throttled = await Promise.all(
    generatedEvents.map(async (_) => {
      await waitFor(500)
      return fictionClient.createTrackingEvent(_)
    }),
  )

  events.push(...(throttled.filter(Boolean) as FictionEvent[]))

  const remoteAddress = faker.internet.ip()

  const mockRequest = {
    query: { events: JSON.stringify(events) },
    headers: {
      'user-agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`,
    },
    socket: { remoteAddress },
  } as unknown as express.Request

  const serverEvents = await testUtils.fictionBeacon.parseRequestEvents(
    mockRequest,
  )

  return serverEvents
}

export async function saveFictionEvents(testUtils: AnalyticsTestUtils, fictionClient: FictionClient): Promise<FictionEvent[]> {
  const events = await createFictionEvents(testUtils, fictionClient)

  const mgr = testUtils.fictionBeacon.sessionManager

  const saveEvents = await mgr?.processRawEvents(events)

  mgr?.saveBuffer.batch(saveEvents || [])

  mgr?.saveBuffer.flushBuffer({ reason: 'test' })

  await waitFor(1000)

  return events
}
