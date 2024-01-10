import type { Pokedex, Pokemon } from '../../schemas'
import { updateManyPokemon } from '../commands'
import { getPokemonList } from '../queries'
import { getDataPath, pathExists, readFileAsJson } from '../utils/fs'

const dexFileArg = process.argv[2]
if (!dexFileArg) {
  throw new Error('Missing dex-file argument')
}

const dexFile = getDataPath(dexFileArg)
if (!pathExists(dexFile)) {
  throw new Error(`File not found: ${dexFile}`)
}

const dex = readFileAsJson<Pokedex>(dexFile)

const allPokemon = getPokemonList()
const pokemonMap = new Map<string, Pokemon>(allPokemon.map((pkm) => [pkm.id, pkm]))

// update availability of each pokemon
for (const entry of dex.entries) {
  const pkm = pokemonMap.get(entry.id)
  if (!pkm) {
    throw new Error(`Pokemon file not found for entry '${entry.id}'`)
  }

  for (const gameSetId of dex.gameIds) {
    if (!pkm.obtainableIn.includes(gameSetId)) {
      pkm.obtainableIn.push(gameSetId)
    }

    if (!pkm.isBattleOnlyForm && !pkm.storableIn.includes(gameSetId)) {
      pkm.storableIn.push(gameSetId)
    }
  }

  updateManyPokemon([pkm])
}
