import type {
  EndpointMeta,
  EndpointResponse,
  FictionDb,
  FictionEmail,
  FictionEnv,
} from '@fiction/core'
import {
  Query,
} from '@fiction/core'
import type { FictionMonitor } from '@fiction/plugin-monitor'
import type { TableSubmissionConfig } from './tables'
import { tableName } from './tables'
import type { FictionContact } from '.'

interface SaveMediaSettings {
  fictionContact: FictionContact
  fictionDb?: FictionDb
  fictionEnv: FictionEnv
  fictionMonitor: FictionMonitor
  fictionEmail: FictionEmail
}

abstract class ContactQuery extends Query<SaveMediaSettings> {
  fictionContact = this.settings.fictionContact
  fictionDb = this.settings.fictionDb
  fictionEnv = this.settings.fictionEnv
  fictionMonitor = this.settings.fictionMonitor
  fictionEmail = this.settings.fictionEmail
  maxSide = this.utils.isTest() ? 700 : 1600
  constructor(settings: SaveMediaSettings) {
    super(settings)
  }
}

interface SubmissionParams {
  _action: 'create'
  submission: Partial<TableSubmissionConfig>
}

export class QueryManageSubmission extends ContactQuery {
  async run(
    params: SubmissionParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TableSubmissionConfig>> {
    if (!this.fictionDb)
      throw this.stop('no fictionDb')
    const { _action, submission } = params

    const db = this.fictionDb.client()

    let message = ''
    let resultSubmission: TableSubmissionConfig | undefined
    if (_action === 'create') {
      const prepped = this.utils.prepareFields({
        type: 'settings',
        fields: submission,
        table: tableName,
        meta,
        fictionDb: this.fictionDb,
      })

      ;[resultSubmission] = await db
        .insert(prepped)
        .into(tableName)
        .returning<TableSubmissionConfig[]>('*')

      message = 'submission saved'

      await this.fictionMonitor.slackNotify({
        message: '*New Contact Form Submission*',
        data: resultSubmission,
      })
    }

    return { status: 'success', data: resultSubmission, message }
  }
}
