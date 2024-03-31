import {
  type PokeLanguageAlpha3,
  type PokemonIndexItem,
  type PokemonTextByLang,
  type PokemonTextIndex,
  alpha3ToPokeLang,
} from '../..'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function runUpdateIndexFile() {
  // Get the data file contents
  const dataFile = getDataPath('pokemon-index.json')
  const records = readFileAsJson<PokemonIndexItem[]>(dataFile)

  const indexTextFile = getDataPath('texts/pokemon.json')
  const indexTexts: PokemonTextIndex = {}

  for (const record of records) {
    const pokeTextFile = getDataPath(`texts/pokemon/${record.id}.json`)
    const srcPokeTexts = readFileAsJson<PokemonTextByLang>(pokeTextFile)
    const pokeTexts: PokemonTextByLang = {}
    indexTexts[record.id] = {}

    for (const [lang, texts] of Object.entries(srcPokeTexts)) {
      const langId = alpha3ToPokeLang(lang as PokeLanguageAlpha3)
      pokeTexts[langId] = texts
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      indexTexts[record.id]![langId] = texts.name
    }

    writeFile(pokeTextFile, JSON.stringify(pokeTexts, null, 2))
  }
  // Save the changes to the index file
  writeFile(indexTextFile, JSON.stringify(indexTexts, null, 2))
}

runUpdateIndexFile()
