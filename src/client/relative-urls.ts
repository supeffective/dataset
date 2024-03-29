export function getPokemonTextDataPath(pokemonId: string): string {
  return `texts/pokemon/${pokemonId}.json`
}

export function getPokemonDataPath(pokemonId: string, regionId: string): string {
  return `pokemon/${regionId}/${pokemonId}.json`
}

export function getPokedexDataPath(pokedexId: string, regionId: string | null | undefined): string {
  if (!regionId) {
    return `pokedexes/${pokedexId}.json`
  }
  return `pokedexes/${regionId}/${pokedexId}.json`
}
