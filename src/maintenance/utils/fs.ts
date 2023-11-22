import fs, { createReadStream } from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline'
import type { BaseEntity } from '../../schemas'

const DATA_PATH = path.resolve(path.join(__dirname, '..', '..', '..', 'data'))

export type DataOverrideDefinition<T extends { id: string } = { id: string }> = {
  exclude: string[]
  append?: T[]
  merge?: [string, T][]
}

export function getDataPath(basename?: string): string {
  return basename ? path.join(DATA_PATH, basename) : DATA_PATH
}

export function getSafeDataPath(filename: string, basePath?: string): string | null {
  const safeFilename = filename.replace(/[^a-z0-9-_.]/gi, '')

  if (safeFilename !== filename) {
    return null
  }

  if (basePath) {
    return getDataPath(path.join(basePath, safeFilename))
  }

  return getDataPath(safeFilename)
}

export function getSafeDataPathOrFail(filename: string, basePath?: string): string {
  const path = getSafeDataPath(filename, basePath)

  if (!path) {
    throw new Error(`Invalid filename: ${filename}`)
  }

  return path
}

export function readFile(filename: string): string {
  return fs.readFileSync(filename, 'utf8')
}

export async function* readFileAsLines(filename: string): AsyncGenerator<string> {
  const fileStream = createReadStream(filename)
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    yield line
  }
}

export function createFileWriter(filename: string): fs.WriteStream {
  const fileStream = fs.createWriteStream(filename, { flags: 'a' })

  return fileStream
}

export function readFileAsJson<T = any>(filename: string): T {
  const data = readFile(filename)

  return JSON.parse(data)
}

export function writeFile(filename: string, data: string): void {
  const dirName = path.dirname(filename)
  ensureDir(dirName)
  fs.writeFileSync(filename, data)
}

export function writeFileAsJson(filename: string, data: any): void {
  writeFile(filename, `${JSON.stringify(data, null, 2)}\n`)
}

export function writeEntitiesFileAsJson(filename: string, records: BaseEntity[]): void {
  let jsonlDoc = '[\n'

  for (const record of records) {
    jsonlDoc += `  ${JSON.stringify(record)},\n`
  }

  jsonlDoc = jsonlDoc.replace(/,\n$/, '\n')
  jsonlDoc += ']\n'

  writeFile(filename, jsonlDoc)
}

export function pathExists(absPath: string): boolean {
  return fs.existsSync(absPath)
}

export function ensureDir(fullPath: string): void {
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}
