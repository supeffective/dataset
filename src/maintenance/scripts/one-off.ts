import type { Pokedex } from '../../schemas'
import { jsonStringifyRecords } from '../../utils'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

// Use this file to run one-off scripts like this example.
// The run it with `bun src/maintenance/scripts/one-off.ts`
// NOTE: Do not commit the changes to this file.

function run() {
  // Get the data file contents
  const dataFile = getDataPath('pokedexes.json')
  const records = readFileAsJson<Pokedex[]>(dataFile)

  for (const record of records) {
    // Do something with each record here.
    console.log(record.id)
  }

  // Save the changes
  writeFile(dataFile, jsonStringifyRecords(records))
}

run()
