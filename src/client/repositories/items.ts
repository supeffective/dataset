import type { Item } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Item[]>
} = {
  collection: new Map(),
}

export async function getAllItems(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Item[]> {
  return fetchCollectionWithCache<Item>(_memCache, 'items.min.json', baseUrl, params)
}

export async function getItemById(id: string, baseUrl: string, params?: NextCompatibleRequestInit): Promise<Item> {
  return getAllItems(baseUrl, params).then((records) => getResourceById(records, id, 'Item'))
}

export async function findItemById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Item | undefined> {
  return getAllItems(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findItemsByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Item[]> {
  return getAllItems(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
