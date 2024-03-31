import type { Ability } from '@pkmn/dex'
import type {
  BoxPreset,
  Character,
  Item,
  Location,
  Mark,
  Move,
  PokeTypeId,
  Pokedex,
  Pokemon,
  PokemonTextByLang,
  PokemonTextIndex,
  Ribbon,
} from '../schemas'

const pokeImgVariantFolder = {
  '2d': 'home2d-icon',
  '3d': 'home3d-icon',
  '3d-stroke': 'home3d-icon-bordered',
  pixelart: 'gen8-icon',
}

export class SuperEffectiveCdnClient {
  constructor(
    public readonly datasetBaseUrl = 'https://cdn.supeffective.com/dataset',
    public readonly assetsBaseUrl = 'https://cdn.supeffective.com/assets',
  ) {}

  public getDataUrl(resourceName: string, ext = '.min.json'): string {
    return `${this.datasetBaseUrl}/${resourceName}${ext}`
  }

  public getAssetUrl(relativePath: string): string {
    return `${this.assetsBaseUrl}/${relativePath.replace(/^\//, '')}`
  }

  public async fetchData<T>(resourceName: string, init?: NextCompatibleRequestInit): Promise<T> {
    return fetchJson<T>(this.getDataUrl(resourceName), init)
  }

  // POKEMON

  public async fetchAllPokemon(init?: NextCompatibleRequestInit): Promise<Pokemon[]> {
    return this.fetchData<Pokemon[]>('pokemon', init)
  }

  public async fetchAllPokemonI18n(init?: NextCompatibleRequestInit): Promise<PokemonTextIndex> {
    return this.fetchData<PokemonTextIndex>('texts/pokemon', init)
  }

  public async fetchPokemon(id: string, init?: NextCompatibleRequestInit): Promise<Pokemon> {
    return this.fetchData<Pokemon>(`pokemon/${id}`, init)
  }

  public async fetchPokemonI18n(id: string, init?: NextCompatibleRequestInit): Promise<PokemonTextByLang> {
    return this.fetchData<PokemonTextByLang>(`texts/pokemon/${id}`, init)
  }

  // POKEDEXES

  public async fetchAllPokedexes(init?: NextCompatibleRequestInit): Promise<Pokedex[]> {
    return this.fetchData<Pokedex[]>('pokedexes', init)
  }

  public async fetchPokedex(region: string, id: string, init?: NextCompatibleRequestInit): Promise<Pokedex> {
    return this.fetchData<Pokedex>(`pokedexes/${region}/${id}`, init)
  }

  // BOX PRESETS

  public async fetchAllBoxPresets(init?: NextCompatibleRequestInit): Promise<BoxPreset[]> {
    return this.fetchData<BoxPreset[]>('boxpresets', init)
  }

  public async fetchBoxPreset(gameSet: string, id: string, init?: NextCompatibleRequestInit): Promise<BoxPreset> {
    return this.fetchData<BoxPreset>(`boxpresets/${gameSet}/${id}`, init)
  }

  // SINGLETON FILES

  public async fetchAbilities(init?: NextCompatibleRequestInit): Promise<Ability[]> {
    return this.fetchData<Ability[]>('abilities', init)
  }

  public async fetchCharacters(init?: NextCompatibleRequestInit): Promise<Character[]> {
    return this.fetchData<Character[]>('characters', init)
  }

  public async fetchItems(init?: NextCompatibleRequestInit): Promise<Item[]> {
    return this.fetchData<Item[]>('items', init)
  }

  public async fetchLocations(init?: NextCompatibleRequestInit): Promise<Location[]> {
    return this.fetchData<Location[]>('locations', init)
  }

  public async fetchMoves(init?: NextCompatibleRequestInit): Promise<Move[]> {
    return this.fetchData<Move[]>('moves', init)
  }

  public async fetchMarks(init?: NextCompatibleRequestInit): Promise<Mark[]> {
    return this.fetchData<Mark[]>('marks', init)
  }

  public async fetchRibbons(init?: NextCompatibleRequestInit): Promise<Ribbon[]> {
    return this.fetchData<Ribbon[]>('ribbons', init)
  }

  // IMAGERY
  getPokemonImgUrl(nid: string, variant: keyof typeof pokeImgVariantFolder = '3d', shiny = false) {
    if (
      [
        'egg',
        'egg-manaphy',
        'substitute',
        'placeholder',
        'unknown',
        'unknown-opaque',
        'unknown-black',
        'unknown-white',
        'unknown-sv',
      ].includes(nid)
    ) {
      const filename = nid === 'placeholder' ? 'unknown' : nid
      const folder = pokeImgVariantFolder[variant]
      return this.getAssetUrl(`/images/pokemon/${folder}/${filename}.png`)
    }
    const folder = pokeImgVariantFolder[variant] + (shiny ? '/shiny' : '/regular')
    return this.getAssetUrl(`/images/pokemon/${folder}/${nid}.png`)
  }
  getGameImgUrl(id: string, variant: 'logos' | 'symbols' | 'avatars' | 'tiles' = 'tiles') {
    const ext = variant === 'tiles' ? 'jpg' : 'png'
    return this.getAssetUrl(`/images/games/${variant}/${id}.${ext}`)
  }
  getItemImgUrl(id: string) {
    const variant = 'gen9-style'
    return this.getAssetUrl(`/images/items/${variant}/${id}.png`)
  }
  getMarkImgUrl(id: string) {
    const variant = 'gen9-style'
    return this.getAssetUrl(`/images/marks/${variant}/${id}.png`)
  }
  getRibbonImgUrl(id: string) {
    const variant = 'gen9-style'
    return this.getAssetUrl(`/images/ribbons/${variant}/${id}.png`)
  }
  getCharacterImgUrl(id: string) {
    const variant = 'masters-icons'
    return this.getAssetUrl(`/images/characters/${variant}/${id}.png`)
  }
  getTypeImgUrl(id: PokeTypeId | 'stellar' | string, variant: 'gen8-style' | 'gen9-style' = 'gen9-style') {
    if (id === 'stellar') {
      return this.getAssetUrl('/images/types/stellar.png')
    }
    return this.getAssetUrl(`/images/characters/${variant}/${id}.svg`)
  }
}

/**
 * Native RequestInit, compatible with Next.js revalidate tags.
 *
 * @see https://nextjs.org/docs/api-reference/next.config.js/headers
 */
type NextCompatibleRequestInit = RequestInit & {
  next?: {
    tags?: Array<string>
    revalidate?: number
  }
}

async function fetchJson<T>(input: string | URL | globalThis.Request, init?: NextCompatibleRequestInit): Promise<T> {
  try {
    const data = await fetch(input, init).then((res) => {
      if (!res.ok) {
        return Promise.reject(new Error(`[dataset.fetchJson] Failed with HTTP error ${res.status} on GET ${input}`))
      }

      return res.text()
    })

    const parsedData = JSON.parse(data)

    return parsedData
  } catch (error) {
    return Promise.reject(new Error(`[dataset.fetchJson] Failed with uncaught error ${error} on GET ${input}`))
  }
}
