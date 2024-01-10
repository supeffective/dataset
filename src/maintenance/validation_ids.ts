import {
  gameFeaturesMap,
  pokedexesIndexMap,
  pokemonColorsMap,
  pokemonGamesMap,
  pokemonIndexMap,
  pokemonOriginMarksMap,
  pokemonRegionsMap,
  pokemonTypesMap,
} from '../client'

import { pokemonAbilitiesMap, pokemonMovesMap } from './loader'

export function isValidGameId(id: string): boolean {
  return pokemonGamesMap.has(id) && pokemonGamesMap.get(id)?.type === 'game'
}

export function isValidGameSetId(id: string): boolean {
  return pokemonGamesMap.has(id) && pokemonGamesMap.get(id)?.type === 'set'
}

export function isValidGameSupersetId(id: string): boolean {
  return pokemonGamesMap.has(id) && pokemonGamesMap.get(id)?.type === 'superset'
}

export function isValidPokemonId(id: string): boolean {
  return pokemonIndexMap.has(id)
}

export function isValidPokedexId(id: string): boolean {
  return pokedexesIndexMap.has(id)
}

export function isValidRegionId(id: string): boolean {
  return pokemonRegionsMap.has(id)
}

export function isValidColorId(id: string): boolean {
  return pokemonColorsMap.has(id)
}

export function isValidPokemonTypeId(id: string): boolean {
  return pokemonTypesMap.has(id)
}

export function isValidAbilitiyId(id: string): boolean {
  return pokemonAbilitiesMap.has(id)
}

export function isValidMoveId(id: string): boolean {
  return pokemonMovesMap.has(id)
}

export function isValidOriginMarkId(id: string): boolean {
  return pokemonOriginMarksMap.has(id)
}

export function isValidFeatureId(id: string): boolean {
  return gameFeaturesMap.has(id)
}
