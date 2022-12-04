import { Writable } from 'node:stream'
import { Upload } from '@aws-sdk/lib-storage'
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  S3Client,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand
} from '@aws-sdk/client-s3'

export const client = new S3Client({})

export class StorageMultipartWritable extends Writable {
  /**
   * @type {string | null}
   * @private
   */
  uploadId = null

  /**
   * @type {import('@aws-sdk/client-s3').CompletedPart[]}
   * @private
   */
  uploadedParts = []

  constructor() {
    super()
  }

  /**
   * @override
   * @param {(error?: Error | null) => void} callback
   */
  async _construct(callback) {
    try {
      const result = await client.send(
        new CreateMultipartUploadCommand({
          Bucket: process.env.APP_STORAGE_BUCKET,
          Key: process.env.APP_STORAGE_PATH,
        })
      )

      this.uploadId = /** @type {string} */ (result.UploadId)
      this.partNumber = 1

      callback()
    } catch (error) {
      callback(/** @type {Error} */ (error))
    }
  }

  /**
   * @override  chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void
   * @param {unknown} chunk
   * @param {BufferEncoding} _encoding
   * @param {(error?: Error | null) => void} callback
   */
  async _write(chunk, _encoding, callback) {
    try {
      console.log(chunk)
      const partNumber = this.uploadedParts.length + 1;

      const response = await client.send(
        new UploadPartCommand({
          Bucket: process.env.APP_STORAGE_BUCKET,
          Key: process.env.APP_STORAGE_PATH,
          Body: /** @type {Buffer} */ (chunk),
          UploadId: /** @type {string} */ (this.uploadId),
          PartNumber: partNumber,
        })
      )

      this.uploadedParts.push({
        ETag: /** @type {string} */ (response.ETag),
        PartNumber: partNumber
      })

      callback()
    } catch (error) {
      callback(/** @type {Error} */ (error))
    }
  }

  /**
   * @override
   * @param {(error?: Error | null) => void} callback
   */
  async _final(callback) {
    try {
      await client.send(
        new CompleteMultipartUploadCommand({
          Bucket: process.env.APP_STORAGE_BUCKET,
          Key: process.env.APP_STORAGE_PATH,
          UploadId: /** @type {string} */ (this.uploadId),
          MultipartUpload: {
            Parts: this.uploadedParts,
          },
        })
      )

      callback()
    } catch (error) {
      callback(/** @type {Error} */ (error))
    }
  }

  /**
   * @override
   * @param {Error | null} error
   * @param {(error?: Error | null) => void} callback
   */
  async _destroy(error, callback) {
    if (error) {
      console.error('Aborting upload because of error', error)
    }

    try {
      await client.send(
        new AbortMultipartUploadCommand({
          Bucket: process.env.APP_STORAGE_BUCKET,
          Key: process.env.APP_STORAGE_PATH,
          UploadId: /** @type {string} */ (this.uploadId),
        })
      )

      callback()
    } catch (anotherError) {
      callback(/** @type {Error} */ (anotherError))
    }
  }
}

/**
 * @param {object} params
 * @param {ReadableStream} data
 */
export function upload({ data }) {
  const upload = new Upload({
    client,
    params: {
      Bucket: process.env.APP_STORAGE_BUCKET,
      Key: process.env.APP_STORAGE_PATH,
      Body: data
    },
    queueSize: 8
  })

  return upload.done()
}
