import crypto from 'node:crypto'

const algorithm = 'aes-256-cbc'
const key = crypto.createHash('sha256').update(process.env.APP_ENCRYPTION_SECRET).digest()

export function encrypt() {
  return crypto.createCipher(algorithm, key)
}

export function decrypt() {
  return crypto.createDecipher(algorithm, key)
}
