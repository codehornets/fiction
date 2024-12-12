import type { Knex } from 'knex'
import type { ZodSchema } from 'zod'
import type { LogHelper } from '../plugin-log/index.js'
import { z } from 'zod'
import { log } from '../plugin-log/index.js'
import { FictionObject } from '../plugin.js'
import { toSnake } from '../utils/index.js'

type PrepareForStorage<T extends ColDefaultValue = ColDefaultValue> = (args: { value: T, key: string, db?: Knex }) => unknown

export type ColDefaultValue = Knex.Value | undefined
type SecurityType = 'permanent' | 'setting' | 'authority' | 'admin' | 'private' | 'composite'

type MakeCol = <U extends string = string, T extends ColDefaultValue = ColDefaultValue> (params: { s: Knex.AlterTableBuilder, col: Col<U, T>, db: Knex }) => void
export type ColSettings<U extends string = string, T extends ColDefaultValue = ColDefaultValue> = {
  key: U
  make: MakeCol
  sec?: SecurityType
  sch: (args: { z: typeof z }) => ZodSchema<T>
  prepare?: PrepareForStorage<T>
}

export class Col<U extends string = string, T extends ColDefaultValue = ColDefaultValue> extends FictionObject<ColSettings<U, T>> {
  key = this.settings.key
  k = toSnake(this.settings.key)
  sec = this.settings.sec || 'setting'
  sch = this.settings.sch
  prepare = this.settings.prepare as PrepareForStorage
  make = this.settings.make

  constructor(settings: ColSettings<U, T>) {
    super('Col', settings)
  }

  createColumn(schema: Knex.AlterTableBuilder, db: Knex): void {
    return this.settings.make({ s: schema, col: this, db })
  }
}

export type TableConstraint = {
  type: 'unique' | 'index' | 'foreign' | 'check'
  columns: string[]
  name?: string
}

export interface FictionDbTableSettings {
  tableKey: string
  timestamps?: boolean
  cols?: readonly Col<any, any>[]
  dependsOn?: string[]
  constraints?: TableConstraint[]
}

export class FictionDbTable {
  readonly tableKey: string
  readonly pgTableKey: string
  cols: Col[]
  log: LogHelper
  timestamps: boolean
  dependsOn: string[]
  constraints: TableConstraint[] = []
  constructor(params: FictionDbTableSettings) {
    this.tableKey = params.tableKey
    this.pgTableKey = toSnake(params.tableKey)
    this.log = log.contextLogger(`FictionDbTable:${this.tableKey}`)
    this.timestamps = params.timestamps ?? false
    this.cols = this.addStandardCols((params.cols || []) as Col[])
    this.dependsOn = params.dependsOn ?? []
    this.constraints = params.constraints ?? []
  }

  settingsKeys() {
    return [...this.cols.filter(c => c.sec === 'setting').map(c => c.key), 'updatedAt']
  }

  tableSchema() {
    const o = Object.fromEntries(this.cols.map(c => [c.key, c.sch({ z })]))
    return z.object(o).partial()
  }

  addStandardCols(cols: Col[] = []) {
    const tsCols = [
      new Col({ key: 'createdAt', sec: 'permanent', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).notNullable().defaultTo(db.fn.now()) }),
      new Col({ key: 'updatedAt', sec: 'setting', sch: ({ z }) => z.string(), make: ({ s, col, db }) => s.string(col.k).notNullable().defaultTo(db.fn.now()) }),
    ]
    return [...cols, ...tsCols] as Col[]
  }

  async createColumns(db: Knex) {
    const rows: string[] = []

    const p2 = this.cols.filter(c => c.settings.sec !== 'composite').map(async (col) => {
      const hasColumn = await db.schema.hasColumn(this.pgTableKey, col.k)
      if (!hasColumn) {
        await db.schema.table(this.pgTableKey, t => col.createColumn(t, db))
        rows.push(col.k)
      }
    })

    await Promise.all(p2)

    if (rows.length > 0)
      this.log.info(`${this.tableKey}: ${rows.length} columns created`, { data: rows })
  }

  async create(db: Knex): Promise<void> {
    try {
      const tableExists = await db.schema.hasTable(this.pgTableKey)

      if (!tableExists) {
        this.log.info(`creating table: ${this.pgTableKey}`)
        await db.schema.createTable(this.pgTableKey, () => {})
      }

      await this.createColumns(db)
      await this.ensureConstraints(db)
    }
    catch (error) {
      this.log.error(`Error creating/updating table ${this.pgTableKey}`, { error })
      throw error
    }
  }

  async ensureConstraints(db: Knex): Promise<void> {
    for (const constraint of this.constraints) {
      const colsList = constraint.columns.map(c => toSnake(c))
      const constraintName = constraint.name || `${this.pgTableKey}_${colsList.join('_')}_${constraint.type}`

      // Check if constraint exists
      const [existingConstraint] = await db
        .select('constraint_name')
        .from('information_schema.table_constraints')
        .where({
          table_name: this.pgTableKey,
          constraint_name: constraintName,
        })

      if (!existingConstraint) {
        this.log.info(`Adding missing constraint: ${constraintName}`)

        switch (constraint.type) {
          case 'unique':
            await db.schema.alterTable(this.pgTableKey, (table) => {
              table.unique(colsList, { indexName: constraintName })
            })
            break
          // Add other constraint types as needed
        }
      }
    }
  }
}
