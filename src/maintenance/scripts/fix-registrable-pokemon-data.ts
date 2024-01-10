import { type Pokemon, type PokemonIndexItem, pokemonSchema } from '../../schemas'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'
import { populatePokemonAndGameIdsFromDexes, sortGameIdsInOrder } from '../utils/misc'

// This is a one-off script, but might need to be run from time to time.
function run() {
  // Get the data file contents
  const dataFile = getDataPath('pokemon-index.json')
  const records = readFileAsJson<PokemonIndexItem[]>(dataFile)
  const pokemonAndGameIdsFromDexes = populatePokemonAndGameIdsFromDexes()

  for (const indexRecord of records) {
    const recordFile = getDataPath(`pokemon/${indexRecord.region}/${indexRecord.id}.json`)
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

run()
