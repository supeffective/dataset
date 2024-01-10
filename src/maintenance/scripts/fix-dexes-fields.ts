import { type Pokedex, type PokedexIndexItem, pokedexSchema } from '../../schemas'
import { localDataLoader } from '../loader'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

// This is a one-off script, but might need to be run from time to time.
function run() {
  // Get the data file contents
  const dataFile = getDataPath('pokedexes-index.json')
  const indexRecords = readFileAsJson<PokedexIndexItem[]>(dataFile)
  const pokedexesMap = localDataLoader.pokedexes()

  for (const indexRecord of indexRecords) {
    const dex = pokedexesMap.get(indexRecord.id)
    if (!dex) {
      throw new Error(`Unknown pokedex ID found in pokedex-index: '${indexRecord.id}'`)
    }

    const regionSegment = dex.region ? `${dex.region}/` : ''
    const dexFile = getDataPath(`pokedexes/${regionSegment}${dex.id}.json`)

    // dex.gameIds = sortGameIdsInOrder(dex.gameSets ?? [])

    const reorganizedDexProps: Pokedex = {
      id: dex.id,
      name: dex.name,
      region: dex.region,
      generation: dex.generation,
      gameIds: dex.gameIds,
      pokeApiId: dex.pokeApiId,
      baseDex: dex.baseDex,
      entries: dex.entries,
    }

    pokedexSchema.parse(reorganizedDexProps) // validate

    // Save the changes
    writeFile(dexFile, JSON.stringify(reorganizedDexProps, undefined, 2))
  }

  // Save the changes
  // writeFile(dataFile, jsonStringifyRecords(indexRecords))
}

run()
