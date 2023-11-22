import { existsSync } from 'node:fs'
import type { BaseEntity } from '../../schemas'
import { getDataPath, readFileAsJson } from './fs'

export function softMerge<T extends object = any>(left: T, ...right: Array<T | Partial<T>>): T {
  return Object.assign({}, left, ...right)
}

export function mergeEntityIndex<E extends BaseEntity>(filename: string, subdirProp?: string): Map<string, E> {
  const baseFileName = filename.replace('-index.json', '')
  const srcFile = getDataPath(`${filename}`)
  const records = readFileAsJson<E[]>(srcFile)
  const recordMap = new Map<string, E>()

  // Detect duplicate IDs
  for (const record of records) {
    if (recordMap.has(record.id)) {
      throw new Error(`Duplicate record ID: ${record.id}`)
    }

    recordMap.set(record.id, record)
  }

  for (const baseRecord of records) {
    const srcRecordFile =
      subdirProp && (baseRecord as any)[subdirProp]
        ? getDataPath(`${baseFileName}/${(baseRecord as any)[subdirProp]}/${baseRecord.id}.json`)
        : getDataPath(`${baseFileName}/${baseRecord.id}.json`)

    if (!existsSync(srcRecordFile)) {
      throw new Error(`Record file does not exist: ${srcRecordFile}`)
    }
    const record = readFileAsJson<E>(srcRecordFile)

    if (record.id !== baseRecord.id) {
      throw new Error(`Record ID mismatch: ${record.id} !== ${baseRecord.id}`)
    }

    recordMap.set(record.id, record)
  }

  return recordMap
}
