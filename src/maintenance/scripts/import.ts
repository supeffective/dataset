// import { importPokedexes } from '../importers/pokeapi/pokedexes'
import { importShowdownAbilities } from '../importers/showdown/abilities'
import { importShowdownItems } from '../importers/showdown/items'
import { importShowdownMoves } from '../importers/showdown/moves'
import { importShowdownPokemon } from '../importers/showdown/pokemon'

importShowdownMoves()
importShowdownAbilities()
importShowdownItems()
importShowdownPokemon()

// You have to enable this manually, to not overload the PokeAPI's servers every time we run the build:
// importPokedexes()
