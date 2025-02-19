import type { ColDefaultValue, ColSettings, FictionDbTableSettings } from '@fiction/core'
import type { TimeLineInterval } from '../types.js'
import type { FictionEvent } from '../typesTracking.js'
import type { BaseChartData, ClickHouseDatatype, FictionClickHouse } from './index.js'
import { Col, dayjs, FictionDbTable } from '@fiction/core'
import { z } from 'zod'

type ValueCallback = (params: {
  event: FictionEvent
  session: Record<string, string | number | boolean | Record<string, string>>
  key: string
}) => string | number | boolean | undefined | Record<string, string>

type SessionSelector = (args: { id: string, key: string }) => string

type FictionAnalyticsColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> = {
  clickHouseType?: ClickHouseDatatype
  sessionSelector?: SessionSelector
  indexOn?: boolean
  getValue?: ValueCallback
  description?: string
} & Omit<ColSettings<U, T>, 'make'>

export class FictionAnalyticsCol< U extends string = string, T extends ColDefaultValue = ColDefaultValue> extends Col<U, T> {
  clickHouseType: ClickHouseDatatype
  indexOn: boolean
  getValue?: ValueCallback
  sessionSelector?: SessionSelector
  constructor(settings: FictionAnalyticsColSettings<U, T>) {
    super({ ...settings, make: ({ s, col }) => s.string(col.k) })
    this.key = settings.key
    this.clickHouseType = settings.clickHouseType || 'String'
    this.indexOn = settings.indexOn || false
    this.getValue = settings.getValue
    this.sessionSelector = settings.sessionSelector
  }
}

type FictionAnalyticsTableSettings = FictionDbTableSettings & {
  cols: readonly FictionAnalyticsCol<string, any>[]
}

// readonly is just for types
type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export class FictionAnalyticsTable extends FictionDbTable {
  override cols: FictionAnalyticsCol[]
  constructor(settings: FictionAnalyticsTableSettings) {
    super(settings)
    this.cols = this.addDefaultColumns(settings.cols || []) as Writeable< FictionAnalyticsCol[] >
  }

  addDefaultColumns(
    cols: Col[] | readonly Col[],
  ): Col[] {
    const tsCols = this.timestamps
      ? [
          new Col({ key: 'createdAt', sec: 'setting', make: ({ s, col, db }) => s.timestamp(col.k).notNullable().defaultTo(db.fn.now()), sch: () => z.string() }),
          new Col({ key: 'updatedAt', sec: 'setting', make: ({ s, col, db }) => s.timestamp(col.k).notNullable().defaultTo(db.fn.now()), sch: () => z.string() }),
        ]
      : []

    return [...cols, ...tsCols] as Col[]
  }

  async createClickHouseTable(fictionClickHouse: FictionClickHouse) {
    const dbName = fictionClickHouse.dbName
    const fieldsInQuery = this.cols
      .map(col => `${col.key} ${col.clickHouseType}`)
      .join(`,\n`)

    const orderBy = this.cols
      .filter(c => c.indexOn)
      .map(c => c.key)
      .join(', ')

    const tableName = `${dbName}.${this.tableKey}`

    const query = `
      CREATE TABLE IF NOT EXISTS ${tableName}
      ( ${fieldsInQuery} ) ENGINE = MergeTree()
      PARTITION BY toYYYYMM(timestamp)
      ORDER BY (${orderBy})
    `

    await fictionClickHouse.clickHouseQuery({ query })

    const addColumnQuery = `ALTER TABLE ${tableName} ${this.cols
      .map((col) => {
        return `ADD COLUMN IF NOT EXISTS ${col.key} ${col.clickHouseType}`
      })
      .join(', ')}`

    await fictionClickHouse.clickHouseQuery({ query: addColumnQuery })
  }
}

export function fillData<T extends BaseChartData>(args: {
  timeZone: string
  timeStartAt: dayjs.Dayjs
  timeEndAt: dayjs.Dayjs
  interval: TimeLineInterval
  withRollup?: boolean
  data: T[]
}): T[] {
  const { timeStartAt, timeEndAt, timeZone, interval, data = [], withRollup } = args

  const newData: { date: string, [key: string]: any }[]
    = withRollup && data[0] ? [data[0]] : [{} as T]

  // clickhouse returns different timezone handling for weeks/months/years vs days/hours
  // appropriate timezone is returned for < weeks but always utc otherwise
  let loopTime: dayjs.Dayjs
  let finishTime: dayjs.Dayjs
  if (interval === 'week' || interval === 'month') {
    loopTime = timeStartAt.utc().startOf(interval)
    finishTime = timeEndAt.utc().endOf(interval)
  }
  else {
    loopTime = timeStartAt.clone().tz(timeZone)
    finishTime = timeEndAt.clone().tz(timeZone)
  }

  const duration = Math.abs(finishTime.diff(loopTime, 'day'))

  const sample = data[0] ?? {}
  // create default object from sample set to zeros
  const defaultObjectIfMissing = Object.fromEntries(
    Object.entries(sample)
      .map(([k, v]) => {
        return ((typeof v === 'string' && /^-?\d+$/.test(v)) || typeof v === 'number') ? [k, 0] : undefined
      })
      .filter(Boolean) as [string, number][],
  )

  while (
    loopTime.isBefore(finishTime, interval)
    || loopTime.isSame(finishTime, interval)
  ) {
    const date = loopTime.toISOString()
    const displayDate = loopTime.tz(timeZone)

    const now = dayjs()
    const found = data.find(_ => _.date === date) || defaultObjectIfMissing

    const dateFormat
      = duration < 3 ? 'ha' : duration > 180 ? 'MMM D, YYYY' : 'MMM D'

    const d: BaseChartData = {
      ...found,
      date,
      label: displayDate.format(dateFormat),
      tense: displayDate.isSame(now, interval)
        ? 'present'
        : displayDate.isAfter(now, interval)
          ? 'future'
          : 'past',
    }

    newData.push(d)

    loopTime = loopTime.add(1, interval)
  }

  return newData as T[]
}
