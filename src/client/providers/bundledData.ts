import _pokemonColors from '../../../data/colors.json'
import _gameFeatures from '../../../data/features.json'
import _pokemonGames from '../../../data/games.json'
import _pokemonLanguages from '../../../data/languages.json'
import _pokemonNatures from '../../../data/natures.json'
import _pokemonOriginMarks from '../../../data/originmarks.json'
import _pokedexesIndex from '../../../data/pokedexes-index.json'
import _pokemonIndex from '../../../data/pokemon-index.json'
import _pokemonRegions from '../../../data/regions.json'
import _pokemonTypes from '../../../data/types.json'

import {
  type Color,
  type Game,
  type GameFeature,
  type Language,
  type Nature,
  type OriginMark,
  type PokeType,
  type PokedexIndexItem,
  type PokemonIndexItem,
  type Region,
  colorSchema,
  gameFeatureSchema,
  gameSchema,
  languageSchema,
  natureSchema,
  originMarkSchema,
  pokeTypeSchema,
  pokedexItemIndexSchema,
  pokemonIndexItemSchema,
  regionSchema,
} from '../../schemas'

// This file only contains Pokémon static data that almost never changes (types, natures, etc.).
// It should only import lightweight JSON files (< 60KB) that do not contain description fields.

// validate and cast data
const pokemonColors: Color[] = colorSchema.array().parse(_pokemonColors)
const pokemonLanguages: Language[] = languageSchema.array().parse(_pokemonLanguages)
const pokemonNatures: Nature[] = natureSchema.array().parse(_pokemonNatures)
const pokemonOriginMarks: OriginMark[] = originMarkSchema.array().parse(_pokemonOriginMarks)
const pokemonRegions: Region[] = regionSchema.array().parse(_pokemonRegions)
const pokemonTypes: PokeType[] = pokeTypeSchema.array().parse(_pokemonTypes)
const pokemonGames: Game[] = gameSchema.array().parse(_pokemonGames)
const pokedexesIndex: PokedexIndexItem[] = pokedexItemIndexSchema.array().parse(_pokedexesIndex)
const pokemonIndex: PokemonIndexItem[] = pokemonIndexItemSchema.array().parse(_pokemonIndex)
const gameFeatures: GameFeature[] = gameFeatureSchema.array().parse(_gameFeatures)

// convert to maps
const pokemonColorsMap = new Map<string, Color>(pokemonColors.map((color) => [color.id, color]))
const pokemonLanguagesMap = new Map<string, Language>(pokemonLanguages.map((language) => [language.id, language]))
const pokemonNaturesMap = new Map<string, Nature>(pokemonNatures.map((nature) => [nature.id, nature]))
const pokemonOriginMarksMap = new Map<string, OriginMark>(pokemonOriginMarks.map((mark) => [mark.id, mark]))
const pokemonRegionsMap = new Map<string, Region>(pokemonRegions.map((region) => [region.id, region]))
const pokemonTypesMap = new Map<string, PokeType>(pokemonTypes.map((type) => [type.id, type]))
const pokemonGamesMap = new Map<string, Game>(pokemonGames.map((game) => [game.id, game]))
const pokedexesIndexMap = new Map<string, PokedexIndexItem>(pokedexesIndex.map((item) => [item.id, item]))
const pokemonIndexMap = new Map<string, PokemonIndexItem>(pokemonIndex.map((item) => [item.id, item]))
const gameFeaturesMap = new Map<string, GameFeature>(gameFeatures.map((item) => [item.id, item]))

export {
  gameFeatures,
  gameFeaturesMap,
  pokedexesIndex,
  pokedexesIndexMap,
  pokemonColors,
  pokemonColorsMap,
  pokemonGames,
  pokemonGamesMap,
  pokemonIndex,
  pokemonIndexMap,
  pokemonLanguages,
  pokemonLanguagesMap,
  pokemonNatures,
  pokemonNaturesMap,
  pokemonOriginMarks,
  pokemonOriginMarksMap,
  pokemonRegions,
  pokemonRegionsMap,
  pokemonTypes,
  pokemonTypesMap,
}
