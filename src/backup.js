import { pipeline } from 'node:stream/promises'
import { compress } from './compression.js'
import { encrypt } from './encryption.js'
import { upload } from './storage.js'
import { PassThrough } from 'node:stream'

export async function backup() {
  const passThrough = new PassThrough()

  await Promise.all([
    pipeline(compress({ source: process.env.APP_BACKUP_PATH }), encrypt(), passThrough),
    upload({ data: passThrough })
  ])
}
