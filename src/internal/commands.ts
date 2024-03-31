import type { SafeParseReturnType } from 'zod'
import { type Pokemon, pokemonSchema } from '../schemas'
import { localDataLoader } from './loader'
import { ensureDir, getDataPath, writeFileAsJson } from './utils/fs'
import { softMerge } from './utils/merge'

type UpdatePokemon = Partial<Pokemon> & { id: string }

function validatePokemon(record: Pokemon): SafeParseReturnType<Pokemon, Pokemon> {
  return pokemonSchema.safeParse(record)
}

function validatePokemonOrFail(record: Pokemon): Pokemon {
  try {
    return pokemonSchema.parse(record)
  } catch (error) {
    throw new Error(`Invalid Pokémon record for ${record.id}: ${error}`)
  }
}

function getPokemon(id: string): Pokemon | null {
  const pkm = localDataLoader.pokemon().get(id)
  if (!pkm) {
    return null
  }

  return pkm
}

function getPokemonOrFail(id: string): Pokemon {
  const entry = getPokemon(id)

  if (!entry) {
    throw new Error(`No Pokémon entry found for ID ${id}`)
  }

  return validatePokemonOrFail(entry)
}

export function updateManyPokemon(batch: UpdatePokemon[]): void {
  const allPkm = localDataLoader.pokemon()

  for (const data of batch) {
    const isUpdate = allPkm.has(data.id)
    const id = data.id
    const pkm = isUpdate ? getPokemonOrFail(id) : getPokemon(id)
    const newPkm = softMerge<Pokemon>(
      (pkm || {
        evolvesFrom: null,
      }) as Pokemon,
      data,
    )
    const validation = validatePokemon(newPkm)

    if (!validation.success) {
      throw new Error(validation.error.issues.map((issue) => `[${issue.path}]: ${issue.message}`).join(',\n'))
    }
    allPkm.set(id, newPkm)

    const dataFileDir = getDataPath(`pokemon/${data.region}`)
    ensureDir(dataFileDir)

    const dataFile = getDataPath(`pokemon/${data.region}/${data.id}.json`)

    writeFileAsJson(dataFile, newPkm)
  }
}

export function updatePokemon(data: UpdatePokemon): void {
  updateManyPokemon([data])
}
