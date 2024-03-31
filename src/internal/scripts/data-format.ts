import { existsSync } from 'node:fs'
import type { BoxPreset, Pokedex } from '../../schemas'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function formatBoxPresets(): void {
  const srcFile = getDataPath('boxpresets-index.json')
  const records = readFileAsJson<Pick<BoxPreset, 'id' | 'name' | 'gameSet'>[]>(srcFile)

  for (const baseRecord of records) {
    const gameSet = baseRecord.gameSet
    const srcRecordFile = gameSet
      ? getDataPath(`boxpresets/${gameSet}/${baseRecord.id}.json`)
      : getDataPath(`boxpresets/${baseRecord.id}.json`)

    if (!existsSync(srcRecordFile)) {
      throw new Error(`Record file does not exist: ${srcRecordFile}`)
    }
    const record = readFileAsJson<BoxPreset>(srcRecordFile)
    const _recordTemplate = JSON.stringify(
      {
        ...record,
        boxes: '%{{slot}}',
      },
      null,
      2,
    )

    let jsonlDoc = '[\n'
    for (const box of record.boxes) {
      jsonlDoc += `    ${JSON.stringify(box)},\n`
    }

    jsonlDoc = jsonlDoc.replace(/,\n$/, '\n    \n')
    jsonlDoc += '  ]'

    const finalCode = _recordTemplate.replace('"%{{slot}}"', jsonlDoc)

    writeFile(srcRecordFile, finalCode)
  }
}

function formatPokedexes(): void {
  const srcFile = getDataPath('pokedexes-index.json')
  const records = readFileAsJson<Pick<Pokedex, 'id' | 'name' | 'region'>[]>(srcFile)

  for (const baseRecord of records) {
    const region = baseRecord.region
    const srcRecordFile = region
      ? getDataPath(`pokedexes/${region}/${baseRecord.id}.json`)
      : getDataPath(`pokedexes/${baseRecord.id}.json`)

    if (!existsSync(srcRecordFile)) {
      throw new Error(`Record file does not exist: ${srcRecordFile}`)
    }
    const record = readFileAsJson<Pokedex>(srcRecordFile)
    const _recordTemplate = JSON.stringify(
      {
        ...record,
        entries: '%{{slot}}',
      },
      null,
      2,
    )

    let jsonlDoc = '[\n'
    for (const entry of record.entries) {
      jsonlDoc += `    ${JSON.stringify(entry)},\n`
    }

    jsonlDoc = jsonlDoc.replace(/,\n$/, '\n    \n')
    jsonlDoc += '  ]'

    const finalCode = _recordTemplate.replace('"%{{slot}}"', jsonlDoc)

    writeFile(srcRecordFile, finalCode)
  }
}

formatBoxPresets()
formatPokedexes()
