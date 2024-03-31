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
