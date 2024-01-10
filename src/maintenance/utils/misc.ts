import { pokemonGamesMap } from '../../client'
import { localDataLoader } from '../loader'

export function sortGameIdsInOrder(gameIds: string[]) {
  const rightOrder = Array.from(pokemonGamesMap.keys())

  return [...gameIds].sort((a, b) => {
    const aIndex = rightOrder.indexOf(a)
    const bIndex = rightOrder.indexOf(b)
    return aIndex - bIndex
  })
}

export function populatePokemonAndGameIdsFromDexes(): Record<string, string[]> {
  const allDexes = localDataLoader.pokedexes().values()
  const registry: Record<string, string[]> = {}

  for (const dex of allDexes) {
    for (const entry of dex.entries) {
      const uniqueGameIdSet = new Set([...(registry[entry.id] ?? []), ...dex.gameIds])
      registry[entry.id] = sortGameIdsInOrder(Array.from([...uniqueGameIdSet]))
    }
  }

  return registry
}

export function getAllGamesForGameSetOrSuperset(gameId: string): string[] {
  const gamesList = pokemonGamesMap.values()
  const gameSet = pokemonGamesMap.get(gameId)
  if (!gameSet) {
    throw new Error(`No game set found for '${gameId}'`)
  }

  const allGameIds = new Set([gameId])

  for (const game of gamesList) {
    if (game.gameSet === gameId || game.gameSuperSet === gameId) {
      allGameIds.add(game.id)
    }
  }

  return Array.from(allGameIds)
}
