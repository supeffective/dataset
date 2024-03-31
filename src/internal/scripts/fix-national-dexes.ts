import type { PokedexIndexItem } from '../../schemas'
import { localDataLoader } from '../loader'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'
import { getAllGamesForGameSetOrSuperset } from '../utils/misc'

// This is a one-off script, but might need to be run from time to time.
function run() {
  // Get the data file contents
  const dataFile = getDataPath('pokedexes-index.json')
  const indexRecords = readFileAsJson<PokedexIndexItem[]>(dataFile)
  const pokemonMap = localDataLoader.pokemon()
  const pokemonList = Array.from(pokemonMap.values())
  const pokedexesMap = localDataLoader.pokedexes()

  for (const indexRecord of indexRecords) {
    const dex = pokedexesMap.get(indexRecord.id)
    if (!dex) {
      throw new Error(`Unknown pokedex ID found in pokedex-index: '${indexRecord.id}'`)
    }

    if (!dex.id.includes('national')) {
      continue
    }

    dex.entries = []
    const regionSegment = dex.region ? `${dex.region}/` : ''
    const dexFile = getDataPath(`pokedexes/${regionSegment}${dex.id}.json`)

    const gameIds = dex.gameIds.flatMap((value) => getAllGamesForGameSetOrSuperset(value))

    // Iterate all pokemon and add them to dex.entries if they are available in any of the gameIds
    for (const pkm of pokemonList) {
      const pokemonGameIds = Array.from(
        new Set([...pkm.storableIn, ...pkm.obtainableIn, ...pkm.eventOnlyIn, ...pkm.registrableIn]),
      )

      if (pokemonGameIds.some((gameId) => gameIds.includes(gameId))) {
        dex.entries.push({
          id: pkm.id,
          dexNum: pkm.dexNum,
          isForm: pkm.isForm,
        })
      }
    }

    // Save the changes
    writeFile(dexFile, JSON.stringify(dex, undefined, 2))
  }

  // Save the changes
  // writeFile(dataFile, jsonStringifyRecords(indexRecords))
}

run()
