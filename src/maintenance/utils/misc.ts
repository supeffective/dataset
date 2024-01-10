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
      const uniqueGameIdSet = new Set([...(registry[entry.id] ?? []), ...dex.gameSets])
      registry[entry.id] = sortGameIdsInOrder(Array.from([...uniqueGameIdSet]))
    }
  }

  return registry
}
