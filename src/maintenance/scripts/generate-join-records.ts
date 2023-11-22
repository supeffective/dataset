import { existsSync } from 'node:fs'
import type { BaseEntity } from '../../schemas'
import { localDataLoader } from '../loader'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function updatePokemonIndex(): void {
  const pokemon = localDataLoader.pokemon()
  const indexFile = getDataPath('pokemon-index.json')

  const records = readFileAsJson<Array<BaseEntity>>(indexFile)

  let indexDoc = '[\n'

  for (const record of records) {
    const fullRecord = pokemon.get(record.id)
    if (!fullRecord) {
      throw new Error(`Pokemon not found: ${record.id}`)
    }

    const indexPayload = {
      id: record.id,
      region: fullRecord.region,
      name: record.name,
      nid: fullRecord.nid,
      isForm: fullRecord.isForm,
    }
    indexDoc += `  ${JSON.stringify(indexPayload)},\n`
  }

  indexDoc = indexDoc.replace(/,\n$/, '\n')
  indexDoc += ']\n'

  writeFile(indexFile, indexDoc)
}

function joinIndexFile(filename: string, subdirProp?: string): void {
  const baseFileName = filename.replace('-index.json', '')
  const srcFile = getDataPath(`${filename}`)
  const destFile = getDataPath(`${baseFileName}.json`)
  const records = readFileAsJson<BaseEntity[]>(srcFile)
  const recordMap = new Map<string, BaseEntity>()

  // Detect duplicate IDs
  for (const record of records) {
    if (recordMap.has(record.id)) {
      throw new Error(`Duplicate record ID: ${record.id}`)
    }

    recordMap.set(record.id, record)
  }

  let jsonlDoc = '[\n'

  for (const baseRecord of records) {
    const destRecordFile =
      subdirProp && (baseRecord as any)[subdirProp]
        ? getDataPath(`${baseFileName}/${(baseRecord as any)[subdirProp]}/${baseRecord.id}.json`)
        : getDataPath(`${baseFileName}/${baseRecord.id}.json`)

    if (!existsSync(destRecordFile)) {
      throw new Error(`Record file does not exist: ${destRecordFile}`)
    }
    const record = readFileAsJson<BaseEntity>(destRecordFile)

    jsonlDoc += `  ${JSON.stringify(record)},\n`
  }

  jsonlDoc = jsonlDoc.replace(/,\n$/, '\n')
  jsonlDoc += ']\n'

  writeFile(destFile, jsonlDoc)
}

function joinPokeGamesFile(): void {
  const pokemon = localDataLoader.pokemon()
  const records = pokemon.values()

  let jsonDoc = '[\n'

  for (const record of records) {
    const payload = {
      id: record.id,
      debutIn: record.debutIn,
      obtainableIn: record.obtainableIn,
      storableIn: record.storableIn,
      eventOnlyIn: record.eventOnlyIn,
      versionExclusiveIn: record.versionExclusiveIn,
      shinyBase: record.shinyBase,
    }
    jsonDoc += `  ${JSON.stringify(payload)},\n`
  }

  jsonDoc = jsonDoc.replace(/,\n$/, '\n')
  jsonDoc += ']\n'

  // const destFile = getDataPath('pokemon_games.json')
  // writeFile(destFile, jsonDoc)
}

joinIndexFile('boxpresets-index.json', 'gameSet')
joinIndexFile('pokedexes-index.json', 'region')
joinIndexFile('pokemon-index.json', 'region')

joinPokeGamesFile()

updatePokemonIndex()
