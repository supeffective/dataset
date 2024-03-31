import { pokemonLanguagesMap } from './provider'
import type { PokeLanguageAlpha3, PokeLanguageId } from './schemas'

export function getPokemonTextDataPath(pokemonId?: string): string {
  if (!pokemonId) {
    return 'texts/pokemon.min.json'
  }
  return `texts/pokemon/${pokemonId}.min.json`
}

export function getPokemonDataPath(pokemonId: string, regionId: string): string {
  return `pokemon/${regionId}/${pokemonId}.min.json`
}

export function getPokedexDataPath(pokedexId: string, regionId: string | null | undefined): string {
  if (!regionId) {
    return `pokedexes/${pokedexId}.min.json`
  }
  return `pokedexes/${regionId}/${pokedexId}.min.json`
}

export function pokeLangToAlpha3(lang: PokeLanguageId): PokeLanguageAlpha3 {
  const found = pokemonLanguagesMap.get(lang)
  if (!found) {
    throw new Error(`Invalid Pokemon language ID: ${lang}`)
  }

  return found.alpha3
}

export function alpha3ToPokeLang(alpha3: PokeLanguageAlpha3): PokeLanguageId {
  for (const [lang, data] of pokemonLanguagesMap) {
    if (data.alpha3 === alpha3) {
      return lang
    }
  }

  throw new Error(`Invalid Pokemon alpha3 language code: ${alpha3}`)
}

export function getSourceCodeUrl(path: string, branch = 'main', project: 'dataset' | 'assets' = 'dataset') {
  return `https://github.com/supeffective/${project}/blob/${branch}/${path}`
}
