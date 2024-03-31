import type { Game, Pokedex } from '../../schemas'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'
import { jsonStringifyRecords } from '../utils/json'

// This is a one-off script, but might need to be run from time to time.
function run() {
  // Get the data file contents
  const dataFile = getDataPath('games.json')
  const dexesDataFile = getDataPath('pokedexes.json')
  const records = readFileAsJson<Game[]>(dataFile)
  const dexRecords = readFileAsJson<Pokedex[]>(dexesDataFile)
  const pokedexesByGameSetId: Record<string, Pokedex[]> = {}

  for (const pokedex of dexRecords) {
    for (const gameId of pokedex.gameIds) {
      if (!pokedexesByGameSetId[gameId]) {
        pokedexesByGameSetId[gameId] = []
      }

      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      pokedexesByGameSetId[gameId]!.push(pokedex)
    }
  }

  for (let i = 0; i < records.length; i++) {
    const record = records[i] as Game
    const dexes = pokedexesByGameSetId[record.id] ?? (record.gameSet ? pokedexesByGameSetId[record.gameSet] : [])
    if (!dexes) {
      record.pokedexes = []
      records[i] = record
      continue
    }
    record.pokedexes = dexes.map((dex) => dex.id)
    records[i] = record
  }

  // Save the changes
  writeFile(dataFile, jsonStringifyRecords(records))
}

run()
