import fs from 'node:fs'
import { pokemonGamesIndex } from '../../../provider'
import type { PokemonTextByLang } from '../../../schemas'
import { localDataLoader } from '../../loader'
import { getDataPath } from '../../utils/fs'
import { sleepMs } from '../../utils/misc'

const POKEAPI_ENDPOINT_URL = 'https://pokeapi.co/api/v2/pokemon-species'

type PokeapiPokemonSpeciesResponse = {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
    version: {
      name: string
    }
  }>
  names: Array<{
    language: {
      name: string
    }
    name: string
  }>
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
}

const gameIdMap: Record<string, string> = {
  red: 'rb-r',
  blue: 'rb-b',
  yellow: 'y',
  gold: 'gs-g',
  silver: 'gs-s',
  crystal: 'c',
  ruby: 'rs-r',
  sapphire: 'rs-s',
  emerald: 'e',
  firered: 'frlg-fr',
  leafgreen: 'frlg-lg',
  diamond: 'dp-d',
  pearl: 'dp-p',
  platinum: 'pt',
  heartgold: 'hgss-hg',
  soulsilver: 'hgss-ss',
  black: 'bw-b',
  white: 'bw-w',
  'black-2': 'b2w2-b2',
  'white-2': 'b2w2-w2',
  x: 'xy-x',
  y: 'xy-y',
  'omega-ruby': 'oras-or',
  'alpha-sapphire': 'oras-as',
  sun: 'sm-s',
  moon: 'sm-m',
  'ultra-sun': 'usum-us',
  'ultra-moon': 'usum-um',
  'lets-go-pikachu': 'lgpe-lgp',
  'lets-go-eevee': 'lgpe-lge',
  sword: 'swsh-sw',
  shield: 'swsh-sh',
  'brilliant-diamond': 'bdsp-bd',
  'shining-pearl': 'bdsp-sp',
  scarlet: 'sv-s',
  violet: 'sv-v',
  'legends-arceus': 'la',
  'legends-za': 'lza',
}

const langIdMap: Record<string, string> = {
  en: 'eng',
  ja: 'jap',
  'ja-Hrkt': 'jap',
  ko: 'kor',
  fr: 'fra',
  de: 'deu',
  es: 'esp',
  it: 'ita',
  'zh-Hans': 'chs',
  'zh-Hant': 'cht',
  roomaji: 'jap_ro',
  // 'pt-BR': 'por',
}

export async function importPokemonTexts() {
  const pokemonMap = localDataLoader.pokemon()
  const pokemonList = Array.from(pokemonMap.values())
  const gameIds = pokemonGamesIndex.filter((game) => game.type === 'game').map((game) => game.id)

  const langIds = new Set(Object.values(langIdMap))

  for (const pkm of pokemonList) {
    const dataShell: PokemonTextByLang = {}
    // Ensure the file exists for every pokemon and different language:
    for (const lang of langIds) {
      dataShell[lang] = {
        name: pkm.name,
        genus: '',
        flavorText: [],
      }
    }
    const dirname = getDataPath('texts/pokemon')
    const filename = `${dirname}/${pkm.id}.json`

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true })
    }

    fs.writeFileSync(filename, JSON.stringify(dataShell, null, 2))
  }

  for (const pkm of pokemonList) {
    // const pokemonFilename = getDataPath(`pokemon/${pokemon.id}.json`)
    // const pokemonData = JSON.parse(fs.readFileSync(pokemonFilename, 'utf8')) as Pokemon

    let speciesPkm = pkm
    if (pkm.baseSpecies) {
      const baseSpecies = pokemonMap.get(pkm.baseSpecies)
      if (!baseSpecies) {
        throw new Error(`Base species ${pkm.baseSpecies} not found for ${pkm.id}`)
      }
      speciesPkm = baseSpecies
    }

    if (speciesPkm.isForm) {
      throw new Error(`Form ${speciesPkm.id} does not have a base species`)
    }

    const randomMs = Math.floor(Math.random() * 300) + 300 // 300-600ms
    await sleepMs(randomMs)
    if (pkm.id === speciesPkm.id) {
      console.log(`Fetching texts for ${speciesPkm.id} (${randomMs}ms)`)
    } else {
      console.log(`Fetching texts for ${pkm.id} * (${randomMs}ms)`)
    }
    const response = await fetch(`${POKEAPI_ENDPOINT_URL}/${speciesPkm.dexNum}`)
    if (!response.ok) {
      console.error(`Failed to fetch PokeAPI species ${speciesPkm.dexNum}`)
      continue
    }

    const data = (await response.json()) as PokeapiPokemonSpeciesResponse
    if (!data.names) {
      console.error(`Pokemon ${speciesPkm.id} has no names in PokeApi`)
      continue
    }
    if (!data.genera) {
      console.error(`Pokemon ${speciesPkm.id} has no genus data in PokeApi`)
      continue
    }
    if (!data.flavor_text_entries) {
      console.error(`Pokemon ${speciesPkm.id} has no flavor_text_entries in PokeApi`)
      continue
    }

    const entry: PokemonTextByLang = {}

    for (const info of data.names) {
      const langId = langIdMap[info.language.name]
      if (!langId) {
        throw new Error(`Unknown language ID found in pokeAPI: '${info.language.name}'`)
      }
      const _entry = entry[langId] ?? {
        name: '',
        genus: '',
        flavorText: [],
      }
      _entry.name = _entry.name.length > info.name.length ? _entry.name : info.name
      entry[langId] = _entry
    }

    for (const info of data.genera) {
      const langId = langIdMap[info.language.name]
      if (!langId) {
        throw new Error(`Unknown language ID found in pokeAPI: '${info.language.name}'`)
      }
      const _entry = entry[langId] ?? {
        name: '',
        genus: '',
        flavorText: [],
      }
      _entry.genus = _entry.genus.length > info.genus.length ? _entry.genus : info.genus
      entry[langId] = _entry
    }

    for (const info of data.flavor_text_entries) {
      const langId = langIdMap[info.language.name]
      if (!langId) {
        throw new Error(`Unknown language ID found in pokeAPI: '${info.language.name}'`)
      }
      const _entry = entry[langId] ?? {
        name: '',
        genus: '',
        flavorText: [],
      }

      if (gameIdMap[info.version.name] === undefined) {
        throw new Error(`Unknown game ID found in pokeAPI: '${info.version.name}'`)
      }

      const gameId = gameIdMap[info.version.name]
      if (!gameId || !gameIds.includes(gameId)) {
        throw new Error(`Invalid game ID: '${gameId}'`)
      }

      const existing = _entry.flavorText.find((ft) => ft.game === gameId)
      if (!existing) {
        _entry.flavorText.push({
          game: gameId,
          text: info.flavor_text,
        })
      } else {
        existing.text = existing.text.length > info.flavor_text.length ? existing.text : info.flavor_text
      }

      entry[langId] = _entry
    }

    // console.log(JSON.stringify(entry, null, 2))
    const filename = getDataPath(`texts/pokemon/${pkm.id}.json`)
    fs.writeFileSync(filename, JSON.stringify(entry, null, 2))
  }
}
