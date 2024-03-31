import _pokemonAbilities from '../../data/abilities.json'
import _pokemonMoves from '../../data/moves.json'
import type { Ability, BoxPreset, Game, Item, Mark, Move, Pokedex, Pokemon, Ribbon } from '../schemas'
import { abilitySchema, moveSchema } from '../schemas'
import { getDataPath, readFileAsJson } from './utils/fs'
import { mergeEntityIndex } from './utils/merge'

export const pokemonAbilities: Ability[] = abilitySchema.array().parse(_pokemonAbilities)
export const pokemonMoves: Move[] = moveSchema.array().parse(_pokemonMoves)

export const pokemonAbilitiesMap = new Map<string, Ability>(pokemonAbilities.map((ability) => [ability.id, ability]))
export const pokemonMovesMap = new Map<string, Move>(pokemonMoves.map((move) => [move.id, move]))

type LocalDataCache = {
  abilitiesByShowdownId?: Map<string, Ability>
  movesByShowdownId?: Map<string, Move>
  itemsByShowdownId?: Map<string, Item>
  boxPresets?: BoxPreset[]
  games?: Game[]
  ribbons?: Ribbon[]
  marks?: Mark[]
  pokemon?: Map<string, Pokemon>
  pokedexes?: Map<string, Pokedex>
}

type RequiredLocalDataCache = Required<LocalDataCache>

type LocalDataLoader = Required<{
  [key in keyof RequiredLocalDataCache]: () => RequiredLocalDataCache[key]
}>

const _dataCache: LocalDataCache = {}

export const localDataLoader: LocalDataLoader = {
  abilitiesByShowdownId: () => {
    if (!_dataCache.abilitiesByShowdownId) {
      _dataCache.abilitiesByShowdownId = new Map<string, Ability>(
        readFileAsJson<Ability[]>(getDataPath('abilities.json')).map((record) => [record.psName, record]),
      )
    }

    return _dataCache.abilitiesByShowdownId
  },
  movesByShowdownId: () => {
    if (!_dataCache.movesByShowdownId) {
      _dataCache.movesByShowdownId = new Map<string, Move>(
        readFileAsJson<Move[]>(getDataPath('moves.json')).map((record) => [record.psName, record]),
      )
    }

    return _dataCache.movesByShowdownId
  },
  itemsByShowdownId: () => {
    if (!_dataCache.itemsByShowdownId) {
      _dataCache.itemsByShowdownId = new Map<string, Item>(
        readFileAsJson<Item[]>(getDataPath('items.json')).map((record) => [record.psName, record]),
      )
    }

    return _dataCache.itemsByShowdownId
  },
  boxPresets: () => {
    if (!_dataCache.boxPresets) {
      const boxPresetsById = mergeEntityIndex<BoxPreset>('boxpresets-index.json', 'gameSet')
      _dataCache.boxPresets = Array.from(boxPresetsById.values())
    }
    return _dataCache.boxPresets
  },
  games: () => {
    if (!_dataCache.games) {
      _dataCache.games = readFileAsJson<Game[]>(getDataPath('games.json'))
    }
    return _dataCache.games
  },
  ribbons: () => {
    if (!_dataCache.ribbons) {
      _dataCache.ribbons = readFileAsJson<Ribbon[]>(getDataPath('ribbons.json'))
    }
    return _dataCache.ribbons
  },
  marks: () => {
    if (!_dataCache.marks) {
      _dataCache.marks = readFileAsJson<Mark[]>(getDataPath('marks.json'))
    }
    return _dataCache.marks
  },
  pokemon: () => {
    if (!_dataCache.pokemon) {
      _dataCache.pokemon = mergeEntityIndex<Pokemon>('pokemon-index.json')
    }
    return _dataCache.pokemon
  },
  pokedexes: () => {
    if (!_dataCache.pokedexes) {
      _dataCache.pokedexes = mergeEntityIndex<Pokedex>('pokedexes-index.json', 'region')
    }
    return _dataCache.pokedexes
  },
}
