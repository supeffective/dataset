import { importPokedexes } from '../importers/pokeapi/pokedexes'

// You have to enable this manually, to not overload the PokeAPI's servers every time we run the build:
importPokedexes()
