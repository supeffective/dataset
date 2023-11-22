import type { Ribbon } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Ribbon[]>
} = {
  collection: new Map(),
}

export async function getAllRibbons(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Ribbon[]> {
  return fetchCollectionWithCache<Ribbon>(_memCache, 'ribbons.min.json', baseUrl, params)
}

export async function getRibbonById(id: string, baseUrl: string, params?: NextCompatibleRequestInit): Promise<Ribbon> {
  return getAllRibbons(baseUrl, params).then((records) => getResourceById(records, id, 'Ribbon'))
}

export async function findRibbonById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Ribbon | undefined> {
  return getAllRibbons(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findRibbonsByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Ribbon[]> {
  return getAllRibbons(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
