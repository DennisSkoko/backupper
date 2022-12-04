import { create } from 'tar'

/**
 * @param {object} params
 * @param {string} params.source
 * @returns {import('node:stream').Readable}
 */
export function compress({ source }) {
  return create({ gzip: true }, [source])
}

/**
 * @param {object} params
 * @param {import('node:stream').Readable} params.source
 * @returns {import('node:stream').Readable}
 */
export function decompress({ source }) {
}
