import type { BoxPreset, BoxPresetIndexItem } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollection, fetchCollectionWithCache } from '../providers'
import { findResourceById, findResourcesByIds, getResource, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, BoxPreset[]>
} = {
  collection: new Map(),
}

export async function getAllBoxPresets(baseUrl: string, params?: NextCompatibleRequestInit): Promise<BoxPreset[]> {
  return fetchCollectionWithCache<BoxPreset>(_memCache, 'boxpresets.min.json', baseUrl, params)
}

export async function getBoxPresetById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<BoxPreset> {
  return getAllBoxPresets(baseUrl, params).then((records) => getResourceById(records, id, 'Box Preset'))
}

export async function findBoxPresetById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<BoxPreset | undefined> {
  return getAllBoxPresets(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findBoxPresetsByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<BoxPreset[]> {
  return getAllBoxPresets(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}

// Memory-optimized functions (avoids fetching the whole collection):
export async function fetchBoxPresetIndex(
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<BoxPresetIndexItem[]> {
  return fetchCollection<BoxPresetIndexItem>('boxpresets-index.min.json', baseUrl, params)
}

export async function fetchBoxPreset(
  id: string,
  gameSetId: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<BoxPreset> {
  return getResource<BoxPreset>('boxpresets', gameSetId, id, baseUrl, 'Box Preset', params)
}
