import type { Location } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Location[]>
} = {
  collection: new Map(),
}

export async function getAllLocations(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Location[]> {
  return fetchCollectionWithCache<Location>(_memCache, 'locations.min.json', baseUrl, params)
}

export async function getLocationById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Location> {
  return getAllLocations(baseUrl, params).then((records) => getResourceById(records, id, 'Location'))
}

export async function findLocationById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Location | undefined> {
  return getAllLocations(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findLocationsByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Location[]> {
  return getAllLocations(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
