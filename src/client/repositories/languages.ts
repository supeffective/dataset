import type { PokeLanguageAlpha3, PokeLanguageId } from '../../schemas'
import { pokemonLanguages, pokemonLanguagesMap } from '../providers'

export function pokeLangToAlpha3(lang: PokeLanguageId): PokeLanguageAlpha3 {
  const data = pokemonLanguagesMap.get(lang)
  if (!data) {
    throw new Error(`Language data not found for ID: ${lang}`)
  }
  return data.alpha3
}

export function alpha3ToPokeLang(alpha3: PokeLanguageAlpha3): PokeLanguageId {
  for (const lang of pokemonLanguages) {
    if (lang.alpha3 === alpha3) {
      return lang.id
    }
  }

  throw new Error(`Unsupported alpha3 language code: ${alpha3}`)
}
