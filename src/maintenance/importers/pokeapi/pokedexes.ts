import fs from 'fs'
import { pokedexesIndex } from '../../../client'
import type { Pokedex } from '../../../schemas'
import { sleepMs } from '../../../utils'
import { localDataLoader } from '../../loader'
import { getDataPath } from '../../utils/fs'
import { pokeapiPokemonIdHashMap } from './pokeapiPokemonMap'

const POKEAPI_POKEDEXES_URL = 'https://pokeapi.co/api/v2/pokedex'

type PokeapiPokedexResponse = {
  id: number
  name: string
  is_main_series: boolean
  pokemon_entries: Array<{
    entry_number: number
    pokemon_species: {
      name: string
      url: string
    }
  }>
}

export async function importPokedexes() {
  const pokemonMap = localDataLoader.pokemon()

  for (let i = 0; i < pokedexesIndex.length; i++) {
    const pokedex = pokedexesIndex[i]
    if (!pokedex || !pokedex.pokeApiId) {
      continue
    }

    const regionSegment = pokedex.region ? `${pokedex.region}/` : ''
    const pokedexFilename = getDataPath(`pokedexes/${regionSegment}${pokedex.id}.json`)
    const pokedexData = JSON.parse(fs.readFileSync(pokedexFilename, 'utf8')) as Pokedex

    sleepMs(1000)
    const response = await fetch(`${POKEAPI_POKEDEXES_URL}/${pokedex.pokeApiId}`)
    if (!response.ok) {
      console.error(`Failed to fetch PokeAPI pokedex ${pokedex.pokeApiId}`)
      continue
    }

    const data = (await response.json()) as PokeapiPokedexResponse
    if (!Array.isArray(data.pokemon_entries)) {
      console.error(`Pokedex ${pokedex.id} has no pokemon_entries`)
      continue
    }

    pokedexData.entries = []
    for (const entry of data.pokemon_entries) {
      const _pokemonId = entry.pokemon_species.name
      const pokemonId = pokeapiPokemonIdHashMap[_pokemonId] ?? _pokemonId
      const pkmData = pokemonMap.get(pokemonId)

      if (!pkmData) {
        throw new Error(`Unknown pokemon ID found in pokeAPI: '${pokemonId}'`)
      }

      pokedexData.entries.push({
        id: pokemonId,
        isForm: pkmData.isForm,
        dexNum: entry.entry_number,
      })
    }

    fs.writeFileSync(pokedexFilename, JSON.stringify(pokedexData, null, 2))
  }

  // axios.defaults.headers.common['Accept-Encoding'] = 'gzip' // TODO: remove when Bun supports Brotli compression
  // const api = new MainClient()
  // const regionIds = Array(MAX_REGION_ID)
  //   .fill(0)
  //   .map((_, i) => i + 1)
  // for (const regionId of regionIds) {
  //   const regionData = await api.location.getRegionById(regionId)
  //   const dexes = regionData.pokedexes
  //   for (const pokedex of dexes) {
  //     const pokedexData = await api.game.getPokedexByName(pokedex.name)
  //     console.log({
  //       id: pokedexData.id,
  //       name: pokedexData.name,
  //       isMain: pokedexData.is_main_series,
  //     })
  //     sleepMs(1000)
  //   }
  //   sleepMs(1000)
  // }
}
