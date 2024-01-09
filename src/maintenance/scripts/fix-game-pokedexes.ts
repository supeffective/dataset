import type { Game, Pokedex } from '../../schemas'
import { jsonStringifyRecords } from '../../utils'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

// Use this file to run one-off scripts like this example.
// The run it with `bun src/maintenance/scripts/one-off.ts`
// NOTE: Do not commit the changes to this file.

function run() {
  // Get the data file contents
  const dataFile = getDataPath('games.json')
  const dexesDataFile = getDataPath('pokedexes.json')
  const records = readFileAsJson<Game[]>(dataFile)
  const dexRecords = readFileAsJson<Pokedex[]>(dexesDataFile)
  const pokedexesByGameSetId: Record<string, Pokedex[]> = {}

  for (const pokedex of dexRecords) {
    for (const gameId of pokedex.gameSets) {
      if (!pokedexesByGameSetId[gameId]) {
        pokedexesByGameSetId[gameId] = []
      }

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
