import { existsSync } from 'node:fs'
import type { BaseEntity, BoxPreset, Game, Pokedex, Pokemon, PokemonIndexItem } from '../../schemas'
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

    const indexPayload: PokemonIndexItem = {
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

function joinIndexFile<T extends BaseEntity>(
  filename: string,
  indexFields: (keyof T)[],
  subdirProp?: keyof T,
  excludedFields?: (keyof T)[],
  excludeFalsyFields?: boolean,
  destBaseFileName?: string,
): void {
  const baseFileName = filename.replace('-index.json', '')
  const srcFile = getDataPath(`${filename}`)
  const destFile = getDataPath(`${destBaseFileName ?? baseFileName}.json`)
  const records = readFileAsJson<BaseEntity[]>(srcFile)
  const recordMap = new Map<string, BaseEntity>()
  const subdirPropStr = subdirProp as string
  const indexFieldsStr = indexFields as string[]

  // Detect duplicate IDs
  for (const record of records) {
    if (recordMap.has(record.id)) {
      throw new Error(`Duplicate record ID: ${record.id}`)
    }

    recordMap.set(record.id, record)
  }

  let indexJsonDoc = '[\n'
  let jsonlDoc = '[\n'

  for (const baseRecord of records) {
    const baseRecordCasted = baseRecord as Record<string, string>
    const destRecordFile =
      subdirProp && baseRecordCasted[subdirPropStr]
        ? getDataPath(`${baseFileName}/${baseRecordCasted[subdirPropStr]}/${baseRecord.id}.json`)
        : getDataPath(`${baseFileName}/${baseRecord.id}.json`)

    if (!existsSync(destRecordFile)) {
      throw new Error(`Record file does not exist: ${destRecordFile}`)
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const record = readFileAsJson<Record<keyof T, any>>(destRecordFile)

    if (excludedFields) {
      for (const field of excludedFields) {
        delete record[field]
      }
    }

    // delete fields that are false, '', null or undefined:
    if (excludeFalsyFields) {
      for (const [key, value] of Object.entries(record)) {
        if (value === null || value === undefined || value === '' || value === false) {
          delete record[key as keyof T]
        }
      }
    }

    jsonlDoc += `  ${JSON.stringify(record)},\n`

    const indexPayload: Record<string, string> = {
      id: record.id,
    }
    for (const field of indexFieldsStr) {
      indexPayload[field] = record[field as keyof T] as string
    }

    indexJsonDoc += `  ${JSON.stringify(indexPayload)},\n`
  }

  jsonlDoc = jsonlDoc.replace(/,\n$/, '\n')
  jsonlDoc += ']\n'

  indexJsonDoc = indexJsonDoc.replace(/,\n$/, '\n')
  indexJsonDoc += ']\n'

  writeFile(destFile, jsonlDoc)
  writeFile(srcFile, indexJsonDoc)
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
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

joinIndexFile<Game>('games-index.json', [
  'id',
  'name',
  'fullName',
  'type',
  'gameSet',
  'gameSuperSet',
  'releaseDate',
  'generation',
  'region',
  'originMark',
  'pokedexes',
  'storage',
])
joinIndexFile<BoxPreset>('boxpresets-index.json', ['id', 'gameSet', 'legacyId', 'name', 'isHidden'], 'gameSet')
joinIndexFile<Pokedex>('pokedexes-index.json', ['id', 'region', 'name', 'baseDex', 'pokeApiId'], 'region')
joinIndexFile<Pokemon>(
  'pokemon-index.json',
  ['id', 'region', 'name', 'nid', 'isForm'],
  undefined,
  [],
  //['storableIn', 'registrableIn', 'eventOnlyIn', 'versionExclusiveIn', 'ultraBeastCode'],
  true,
)

// compact pokemon
// joinIndexFile<Pokemon>(
//   'pokemon-index.json',
//   ['id', 'region', 'name', 'nid', 'isForm'],
//   undefined,
//   [
//     'debutIn',
//     'evolvesFrom',
//     'refs',
//     'obtainableIn',
//     'versionExclusiveIn',
//     'eventOnlyIn',
//     'storableIn',
//     'registrableIn',
//     'ultraBeastCode',
//   ],
//   true,
//   'pokemon-compact',
// )

// joinPokeGamesFile()
updatePokemonIndex()
