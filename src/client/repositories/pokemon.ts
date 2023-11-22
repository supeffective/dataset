import { PKM_LATEST_GAMESET, PKM_LATEST_GENERATION, PKM_LATEST_REGION } from '../../constants'
import type { CompactPokemon, Pokemon, PokemonIndexItem } from '../../schemas'
import { type NextCompatibleRequestInit, fetchCollection, fetchCollectionWithCache } from '../providers'
import type { SearchEngineIndex } from '../search'
import { findResourceById, findResourcesByIds, getResource, getResourceById } from './_base'

// -------------------------------- Functional API -----------------------------------------------
const _memCache: {
  collection: Map<string, Pokemon[]>
} = {
  collection: new Map(),
}

export async function getAllPokemon(baseUrl: string, params?: NextCompatibleRequestInit): Promise<Pokemon[]> {
  return fetchCollectionWithCache<Pokemon>(_memCache, 'pokemon.min.json', baseUrl, params)
}

export async function getPokemonById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokemon> {
  return getAllPokemon(baseUrl, params).then((records) => getResourceById(records, id, 'Pokemon'))
}

export async function findPokemonById(
  id: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokemon | undefined> {
  return getAllPokemon(baseUrl, params).then((records) => findResourceById(records, id))
}

export async function findPokemonByIds(
  ids: Array<string>,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokemon[]> {
  return getAllPokemon(baseUrl, params).then((records) => findResourcesByIds(records, ids))
}

// Memory-optimized functions (avoids fetching the whole collection):
export async function fetchPokemonIndex(
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<PokemonIndexItem[]> {
  return fetchCollection<PokemonIndexItem>('pokemon-index.min.json', baseUrl, params)
}

export async function fetchPokemon(
  id: string,
  regionId: string,
  baseUrl: string,
  params?: NextCompatibleRequestInit,
): Promise<Pokemon> {
  return getResource<Pokemon>('pokemon', regionId, id, baseUrl, 'Pokemon', params)
}

// --------------------------------  Placeholder Pokemon --------------------------------

export function createPlaceholderPokemon(): Pokemon {
  return {
    id: 'unknown',
    nid: '0000-unknown',
    dexNum: 0,
    formId: null,
    name: 'Untitled',
    psName: 'unknown',
    formName: null,
    region: PKM_LATEST_REGION,
    generation: PKM_LATEST_GENERATION,
    type1: 'normal',
    type2: null,
    color: 'white',
    abilities: {
      primary: 'pressure',
      secondary: null,
      hidden: null,
    },
    isDefault: true,
    isForm: false,
    isLegendary: false,
    isMythical: false,
    isUltraBeast: false,
    ultraBeastCode: null,
    isSpecialAbilityForm: false,
    isCosmeticForm: false,
    isFemaleForm: false,
    hasGenderDifferences: false,
    isBattleOnlyForm: false,
    isSwitchableForm: false,
    isFusion: false,
    fusedWith: null,
    isMega: false,
    isPrimal: false,
    isGmax: false,
    isRegional: false,
    canGmax: false,
    canDynamax: false,
    canBeAlpha: false,
    debutIn: PKM_LATEST_GAMESET,
    obtainableIn: [],
    versionExclusiveIn: [],
    eventOnlyIn: [],
    storableIn: [],
    shinyReleased: false,
    shinyBase: null,
    baseStats: {
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    },
    weight: 0,
    height: 0,
    baseSpecies: null,
    baseForms: [],
    forms: [],
    evolvesFrom: null,
    family: null,
    refs: {
      smogon: 'unknown',
      showdown: 'unknown',
      serebii: 'unknown',
      bulbapedia: 'unknown',
    },
  }
}

export function isPlaceholderPokemon(pkm: Pokemon | CompactPokemon): boolean {
  return pkm.id === 'unknown'
}

// --------------------------------  Search --------------------------------
export async function hydratePokemonSearchIndex<K extends CompactPokemon | Pokemon>(
  entities: K[],
  searchIndex: SearchEngineIndex<K>,
): Promise<void> {
  await searchIndex.index(entities, [
    [
      'num',
      (pk) => {
        const dexNum = (pk.dexNum >= 5000 ? 0 : pk.dexNum).toString()

        return [dexNum, dexNum.padStart(3, '0'), dexNum.padStart(4, '0')]
      },
    ],
    ['name', (pk) => [pk.id, pk.name, pk.name.replace(/ /g, '').replace(/\s/g, '')]],
    ['type', (pk) => [pk.type1, pk.type2].filter(Boolean) as string[]],
    ['base', (pk) => pk.baseSpecies || pk.id],
    ['color', (pk) => pk.color || null],
    ['id', (pk) => pk.id || null],
    ['storable', (pk) => (pk.storableIn.length > 0 ? pk.storableIn : null)],
    [
      'obtainable',
      (pk) => {
        if ('obtainableIn' in pk) {
          return pk.obtainableIn.length > 0 ? pk.obtainableIn : null
        }

        return null
      },
    ],
  ])
}
