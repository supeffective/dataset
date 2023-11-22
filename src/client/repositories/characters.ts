import type { Character } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Character[]>
} = {
  collection: new Map(),
}

export async function getAllCharacters(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Character[]> {
  return fetchCollectionWithCache<Character>(_memCache, 'characters.min.json', baseUrl, params)
}

export async function getCharacterById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Character> {
  return getAllCharacters(baseUrl, params).then((records) => getResourceById(records, id, 'Character'))
}

export async function findCharacterById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Character | undefined> {
  return getAllCharacters(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findCharactersByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Character[]> {
  return getAllCharacters(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
