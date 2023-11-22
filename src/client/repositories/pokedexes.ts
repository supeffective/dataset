import type { Pokedex, PokedexIndexItem } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollection, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResource, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Pokedex[]>
} = {
  collection: new Map(),
}

export async function getAllPokedexes(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Pokedex[]> {
  return fetchCollectionWithCache<Pokedex>(_memCache, 'pokedexes.min.json', baseUrl, params)
}

export async function getPokedexById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokedex> {
  return getAllPokedexes(baseUrl, params).then((records) => getResourceById(records, id, 'Pokedex'))
}

export async function findPokedexById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokedex | undefined> {
  return getAllPokedexes(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findPokedexesByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokedex[]> {
  return getAllPokedexes(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}

// Memory-optimized functions (avoids fetching the whole collection):
export async function fetchPokedexIndex(baseUrl: string): Promise<PokedexIndexItem[]> {
  return fetchCollection<PokedexIndexItem>('pokedexes-index.min.json', baseUrl)
}

export async function fetchPokedex(id: string, regionId: string | null | undefined, baseUrl: string): Promise<Pokedex> {
  return getResource<Pokedex>('pokedexes', regionId, id, baseUrl, 'Pokedex')
}
