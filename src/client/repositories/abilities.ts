import type { Ability } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Ability[]>
} = {
  collection: new Map(),
}

export async function getAllAbilities(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Ability[]> {
  return fetchCollectionWithCache<Ability>(_memCache, 'abilities.min.json', baseUrl, params)
}

export async function findAbilityById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Ability | undefined> {
  return getAllAbilities(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function getAbilityById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Ability> {
  return getAllAbilities(baseUrl, params).then((records) => getResourceById(records, id, 'Ability'))
}

export async function findAbilitiesByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Ability[]> {
  return getAllAbilities(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}
