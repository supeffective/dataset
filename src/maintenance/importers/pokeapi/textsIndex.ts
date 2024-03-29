import fs from 'node:fs'
import type { PokemonTextByLang, PokemonTextIndex } from '../../../schemas'
import { localDataLoader } from '../../loader'
import { getDataPath } from '../../utils/fs'

export async function createPokemonTextIndex() {
  const pokemonMap = localDataLoader.pokemon()
  const pokemonList = Array.from(pokemonMap.values())
  const textIndex: PokemonTextIndex = {}

  for (const pkm of pokemonList) {
    const filename = getDataPath(`texts/pokemon/${pkm.id}.json`)
    const data = fs.readFileSync(filename, 'utf-8')
    const texts: PokemonTextByLang = JSON.parse(data)
    const pkmTexts: Record<string, PokemonTextIndex[string][string]> = {}

    for (const [lang, text] of Object.entries(texts)) {
      pkmTexts[lang] = text.name
    }

    textIndex[pkm.id] = pkmTexts
  }

  fs.writeFileSync(getDataPath('texts/pokemon.json'), JSON.stringify(textIndex, null, 2))
}
