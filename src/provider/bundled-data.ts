// IMPORTANT: only import single-file data that doesn't change much in every new game, or indices.

import _characteristics from '../../data/characteristics.json'
import _characters from '../../data/characters.json'
import _pokemonColors from '../../data/colors.json'
import _gameFeatures from '../../data/features.json'
import _pokemonGamesIndex from '../../data/games-index.json'
import _pokemonGenerations from '../../data/generations.json'
import _pokemonLanguages from '../../data/languages.json'
import _pokemonNatures from '../../data/natures.json'
import _pokemonOriginMarks from '../../data/originmarks.json'
import _pokedexesIndex from '../../data/pokedexes-index.json'
import _pokemonIndex from '../../data/pokemon-index.json'
import _pokemonRegions from '../../data/regions.json'
import _pokemonTypes from '../../data/types.json'

import {
  type Character,
  type Characteristic,
  type Color,
  type GameFeature,
  type GameIndexItem,
  type Generation,
  type Nature,
  type OriginMark,
  type PokeLanguage,
  type PokeLanguageId,
  type PokeType,
  type PokedexIndexItem,
  type PokemonIndexItem,
  type Region,
  characterSchema,
  characteristicSchema,
  colorSchema,
  gameFeatureSchema,
  gameIndexItemSchema,
  generationSchema,
  languageSchema,
  natureSchema,
  originMarkSchema,
  pokeTypeSchema,
  pokedexItemIndexSchema,
  pokemonIndexItemSchema,
  regionSchema,
} from '../schemas'

// This file only contains Pokémon static data that almost never changes (types, natures, etc.).
// It should only import lightweight JSON files (< 60KB) that do not contain description fields.

// validate and cast data
const pokemonColors: Color[] = colorSchema.array().parse(_pokemonColors)
const pokemonLanguages: PokeLanguage[] = languageSchema.array().parse(_pokemonLanguages)
const pokemonNatures: Nature[] = natureSchema.array().parse(_pokemonNatures)
const pokemonOriginMarks: OriginMark[] = originMarkSchema.array().parse(_pokemonOriginMarks)
const pokemonRegions: Region[] = regionSchema.array().parse(_pokemonRegions)
const pokemonTypes: PokeType[] = pokeTypeSchema.array().parse(_pokemonTypes)
const pokemonGamesIndex: GameIndexItem[] = gameIndexItemSchema.array().parse(_pokemonGamesIndex)
const pokedexesIndex: PokedexIndexItem[] = pokedexItemIndexSchema.array().parse(_pokedexesIndex)
const pokemonIndex: PokemonIndexItem[] = pokemonIndexItemSchema.array().parse(_pokemonIndex)
const pokemonGameFeatures: GameFeature[] = gameFeatureSchema.array().parse(_gameFeatures)
const pokemonCharacteristics: Characteristic[] = characteristicSchema.array().parse(_characteristics)
const pokemonCharacters: Character[] = characterSchema.array().parse(_characters)
const pokemonGenerations: Generation[] = generationSchema.array().parse(_pokemonGenerations)

// convert to maps (by ID)
const pokemonColorsMap = new Map<string, Color>(pokemonColors.map((color) => [color.id, color]))
const pokemonLanguagesMap = new Map<PokeLanguageId, PokeLanguage>(
  pokemonLanguages.map((language) => [language.id, language]),
)
const pokemonLanguagesById: Record<PokeLanguageId, PokeLanguage> = Object.fromEntries(
  pokemonLanguages.map((language) => [language.id, language]),
) as Record<PokeLanguageId, PokeLanguage>

const pokemonNaturesMap = new Map<string, Nature>(pokemonNatures.map((nature) => [nature.id, nature]))
const pokemonOriginMarksMap = new Map<string, OriginMark>(pokemonOriginMarks.map((mark) => [mark.id, mark]))
const pokemonRegionsMap = new Map<string, Region>(pokemonRegions.map((region) => [region.id, region]))
const pokemonTypesMap = new Map<string, PokeType>(pokemonTypes.map((type) => [type.id, type]))
const pokemonGamesIndexMap = new Map<string, GameIndexItem>(pokemonGamesIndex.map((game) => [game.id, game]))
const pokedexesIndexMap = new Map<string, PokedexIndexItem>(pokedexesIndex.map((item) => [item.id, item]))
const pokemonIndexMap = new Map<string, PokemonIndexItem>(pokemonIndex.map((item) => [item.id, item]))
const pokemonGameFeaturesMap = new Map<string, GameFeature>(pokemonGameFeatures.map((item) => [item.id, item]))
const pokemonCharacteristicsMap = new Map<string, Characteristic>(pokemonCharacteristics.map((item) => [item.id, item]))
const pokemonCharactersMap = new Map<string, Character>(pokemonCharacters.map((item) => [item.id, item]))
const pokemonGenerationsMap = new Map<number, Generation>(pokemonGenerations.map((item) => [item.id, item]))

export {
  pokedexesIndex,
  pokedexesIndexMap,
  pokemonCharacteristics,
  pokemonCharacteristicsMap,
  pokemonCharacters,
  pokemonCharactersMap,
  pokemonColors,
  pokemonColorsMap,
  pokemonGameFeatures,
  pokemonGameFeaturesMap,
  pokemonGamesIndex,
  pokemonGamesIndexMap,
  pokemonGenerations,
  pokemonGenerationsMap,
  pokemonIndex,
  pokemonIndexMap,
  pokemonLanguages,
  pokemonLanguagesById,
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
