/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { WebSocket as NodeWebSocket } from 'ws'
import type {
  SocketMeta,
  SocketServerComponents,
} from '../socket'
import {
  ClientSocket,
  createSocketServer,
} from '../socket'
import type { TestUtils } from '../../test-utils/init'
import { createTestUtils } from '../../test-utils/init'
import { waitFor } from '../utils'
import { snap } from '../../test-utils'

// Polyfill WebSocket in Node.js environment
const isNode = typeof process === 'object'
  && typeof process.versions === 'object'
  && typeof process.versions.node !== 'undefined'

if (isNode)
  globalThis.WebSocket = NodeWebSocket as unknown as typeof WebSocket

type EventMap = {
  test: { req: 'ping', res: 'pong' }
}

let s: SocketServerComponents<EventMap> | undefined
const port = 1221
const host = `ws://localhost:${port}`

const serverEvents: [
  keyof EventMap,
  EventMap[keyof EventMap]['req'],
  SocketMeta<EventMap, 'test'>,
][] = []
const clientEvents: [keyof EventMap, EventMap[keyof EventMap]['res']][] = []

let testUtils: TestUtils | undefined
describe('sockets', () => {
  beforeAll(async () => {
    testUtils = createTestUtils()
    s = await createSocketServer<EventMap>({
      serverName: 'testSocketServer',
      port,
      fictionUser: testUtils.fictionUser,
    })
  })
  afterAll(async () => {
    s?.endpointServer.server?.close()
  })

  it('creates a socket server', async () => {
    const nodeSocketServer = s?.socketServer

    expect(nodeSocketServer?.wss).toBeDefined()

    nodeSocketServer?.on('test', (message, meta) => {
      if (meta.bearer)
        meta.bearer = { ...meta.bearer, iat: 888 }

      serverEvents.push(['test', message, meta])
    })
  })

  it('creates a client server', async () => {
    const fictionUser = testUtils?.fictionUser

    if (!fictionUser)
      throw new Error('no fictionUser')

    const token = testUtils?.fictionUser.createClientToken({
      email: 'hello@world.com',
      userId: 'hello',
    })
    const clientSocket = new ClientSocket<EventMap>({
      host,
      token,
      fictionUser,
    })

    await clientSocket.sendMessage('test', 'ping')

    clientSocket?.on('test', (data) => {
      clientEvents.push(['test', data])
    })

    await waitFor(100)

    const r = serverEvents.map((e) => {
      // @ts-expect-error remove connection, although it says it needs be optional
      delete e[2].connection
      return e
    })

    expect(snap(r, { maskedKeys: ['bearerToken', 'pingAliveTime', 'respond'] })).toMatchInlineSnapshot(`
      [
        [
          "test",
          "ping",
          {
            "bearer": {
              "email": "[email:*****@*****.***]",
              "iat": "888",
              "role": "",
              "userId": "[id:*****]",
            },
            "bearerToken": "**MASKED**",
            "channels": "hello",
            "clientId": "[id:********************************]",
            "connectionId": "[id:********************************_*******]",
            "pingAlive": "true",
            "pingAliveTime": "**MASKED**",
            "respond": "**MASKED**",
          },
        ],
      ]
    `)

    expect(serverEvents.find(_ => _[1] === 'ping')).toBeTruthy()
  }, { timeout: 10000 })

  it('handles bearer on request', async () => {
    expect(serverEvents.find(_ => _[2].bearer)).toBeTruthy()
    expect(serverEvents.find(_ => _[2].bearer?.userId)).toBeTruthy()
  })

  it('sends a message back to client', async () => {
    expect(clientEvents).toMatchInlineSnapshot('[]')

    const testEvent = serverEvents.find(_ => _[1] === 'ping')

    testEvent?.[2].respond('pong')

    await waitFor(100)

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "test",
          "pong",
        ],
      ]
    `)

    expect(clientEvents.find(_ => _[1] === 'pong')).toBeTruthy()

    expect(clientEvents).toMatchInlineSnapshot(`
      [
        [
          "test",
          "pong",
        ],
      ]
    `)
  })
})
