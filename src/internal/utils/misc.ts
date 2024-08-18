import { pokemonGamesIndexMap } from '../../provider'
import { localDataLoader } from '../loader'

export async function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function sortGameIdsInOrder(gameIds: string[] | undefined) {
  const rightOrder = Array.from(pokemonGamesIndexMap.keys())

  return [...(gameIds ?? [])].sort((a, b) => {
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
  const gamesList = pokemonGamesIndexMap.values()
  const gameSet = pokemonGamesIndexMap.get(gameId)
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
