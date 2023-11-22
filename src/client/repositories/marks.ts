import type { Mark } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Mark[]>
} = {
  collection: new Map(),
}

export async function getAllMarks(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Mark[]> {
  return fetchCollectionWithCache<Mark>(_memCache, 'marks.min.json', baseUrl, params)
}

export async function getMarkById(id: string, baseUrl: string, params?: NextCompatibleRequestInit): Promise<Mark> {
  return getAllMarks(baseUrl, params).then((records) => getResourceById(records, id, 'Mark'))
}

export async function findMarkById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Mark | undefined> {
  return getAllMarks(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findMarksByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Mark[]> {
  return getAllMarks(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
