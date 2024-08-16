import type { Pokemon, PokemonIndexItem } from '../..'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function runUpdateIndexFile() {
  // Get the data file contents
  const dataFile = getDataPath('pokemon-index.json')
  const records = readFileAsJson<PokemonIndexItem[]>(dataFile)

  for (const record of records) {
    const pokeFile = getDataPath(`pokemon/${record.id}.json`)
    const srcPoke = readFileAsJson<Pokemon>(pokeFile)
    const isGenGte7Mythical = srcPoke.generation >= 7 && srcPoke.isMythical
    const isGenGte8Legend = srcPoke.generation >= 8 && (srcPoke.isLegendary || srcPoke.isMythical)

    if (isGenGte7Mythical || isGenGte8Legend) {
      continue
    }

    if (!srcPoke.obtainableIn.includes('go')) {
      srcPoke.obtainableIn.push('go')
    }

    if (srcPoke.obtainableIn.includes('go') && !srcPoke.storableIn.includes('go')) {
      srcPoke.storableIn.push('go')
    }

    if (srcPoke.obtainableIn.includes('go') && !srcPoke.registrableIn.includes('go')) {
      srcPoke.registrableIn.push('go')
    }

    writeFile(pokeFile, JSON.stringify(srcPoke, null, 2))
  }
}

runUpdateIndexFile()
