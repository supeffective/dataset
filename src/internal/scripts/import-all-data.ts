// import { importPokedexes } from '../importers/pokeapi/pokedexes'
import { importShowdownAbilities } from '../importers/showdown/abilities'
import { importShowdownItems } from '../importers/showdown/items'
import { importShowdownMoves } from '../importers/showdown/moves'
import { importShowdownPokemon } from '../importers/showdown/pokemon'
import { importMastersEXCharacters } from '../importers/supereffective-assets/characters'

// From PokeAPI:
/////// You have to enable this manually, to not overload the PokeAPI's servers every time we run the build:
// importPokedexes()
// importPokemonTexts()
// createPokemonTextIndex()

// From Showdown @pkm/dex package:
importShowdownMoves()
importShowdownAbilities()
importShowdownItems()
importShowdownPokemon()

// From supereffective-assets:
importMastersEXCharacters()
