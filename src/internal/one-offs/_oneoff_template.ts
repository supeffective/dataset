import { type Pokemon, type PokemonIndexItem, pokemonSchema } from '../../schemas'
import { localDataLoader } from '../loader'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'
import { jsonStringifyRecords } from '../utils/json'
import { populatePokemonAndGameIdsFromDexes, sortGameIdsInOrder } from '../utils/misc'

// Use this file to run one-off scripts like this example.
// The run it with `bun src/maintenance/scripts/one-off.ts`
// NOTE: Do not commit the changes to this file.

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
function runUpdateIndexFile() {
  // Get the data file contents
  const dataFile = getDataPath('pokemon-index.json')
  const records = readFileAsJson<PokemonIndexItem[]>(dataFile)
  const pokemonMap = localDataLoader.pokemon()

  for (const record of records) {
    const fullRecord = pokemonMap.get(record.id)
    if (!fullRecord) {
      throw new Error(`Unknown pokemon ID found in pokemon-index: '${record.id}'`)
    }
    // Do something with each record here.
    console.log(record.id)
  }

  // Save the changes
  writeFile(dataFile, jsonStringifyRecords(records))
}

function runUpdateRecordFiles() {
  // Get the data file contents
  const dataFile = getDataPath('pokemon-index.json')
  const records = readFileAsJson<PokemonIndexItem[]>(dataFile)
  const pokemonAndGameIdsFromDexes = populatePokemonAndGameIdsFromDexes()

  for (const indexRecord of records) {
    const recordFile = getDataPath(`pokemon/${indexRecord.id}.json`)
    const record = readFileAsJson<Pokemon>(recordFile)

    // Do something with each record here.
    // console.log(record.id)
    record.storableIn = sortGameIdsInOrder(record.storableIn)
    record.obtainableIn = sortGameIdsInOrder(record.obtainableIn)
    record.eventOnlyIn = sortGameIdsInOrder(record.eventOnlyIn)

    const gameIdsFromDexes = pokemonAndGameIdsFromDexes[record.id] ?? []

    const registrableIn = Array.from(
      new Set(['home', record.debutIn, ...record.storableIn, ...record.obtainableIn, ...record.eventOnlyIn]),
    )
      // exclude gameIds if the pokemon is not in their dex
      .filter((gameId) => gameIdsFromDexes.includes(gameId))

    record.registrableIn = sortGameIdsInOrder(registrableIn)

    pokemonSchema.parse(record) // validate

    // Save the changes
    writeFile(recordFile, JSON.stringify(record, undefined, 2))
  }
}

// runUpdateIndexFile()
runUpdateRecordFiles()
