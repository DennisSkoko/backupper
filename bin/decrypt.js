#!/usr/bin/env node

import { createReadStream, createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { decrypt } from '../src/encryption.js'

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) throw new Error('Must provide both input and output file paths as arguments')

await pipeline(createReadStream(input), decrypt(), createWriteStream(output))
