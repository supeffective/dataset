import type { Game } from '../../schemas'
import { pokemonGames } from '../providers'
import { findResourceById, findResourcesByIds, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
// const _memCache: {
//   collection: Map<string, Game[]>
// } = {
//   collection: new Map(),
// }

export async function getAllGames(_baseUrl: string): Promise<Game[]> {
  return Promise.resolve(pokemonGames)
  // return fetchCollectionWithCache<Game>(_memCache, 'games.min.json', baseUrl)
}

export async function getGameById(id: string, baseUrl: string): Promise<Game> {
  return getAllGames(baseUrl).then((records) => getResourceById(records, id, 'Game'))
}

export async function findGameById(id: string, baseUrl: string): Promise<Game | undefined> {
  return getAllGames(baseUrl).then((records) => findResourceById(records, id))
}

export async function findGamesByIds(ids: Array<string>, baseUrl: string): Promise<Game[]> {
  return getAllGames(baseUrl).then((records) => findResourcesByIds(records, ids))
}
