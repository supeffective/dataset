import type { Pokedex, PokedexEntry } from '../../schemas'
import { getPokemonList } from '../queries'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function generateNationalDex(): void {
  const allPokemon = getPokemonList()
  const dataFile = getDataPath('pokedexes/national.json')
  const dex = readFileAsJson<Pokedex>(dataFile)
  dex.entries = []

  for (const pkm of allPokemon) {
    const entry: PokedexEntry = {
      id: pkm.id,
      dexNum: pkm.dexNum,
      isForm: pkm.isForm,
    }
    dex.entries.push(entry)
  }

  writeFile(dataFile, JSON.stringify(dex))
}

generateNationalDex()
