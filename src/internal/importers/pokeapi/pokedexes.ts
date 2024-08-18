import fs from 'node:fs'
import { pokedexesIndex } from '../../../provider'
import type { Pokedex, Pokemon } from '../../../schemas'
import { localDataLoader } from '../../loader'
import { getDataPath } from '../../utils/fs'
import { sleepMs } from '../../utils/misc'
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

// The following dexes are wrong in the PokeAPI and need to be skipped, therefore manually filled.
const skippedDexes = [
  'hisui', // Reason: the Pokeapi dex entries don't specify the hisuian forms, just the species.
  'paldea', // Reason: the Pokeapi dex entries don't specify regional forms
  'paldea-kitakami', // Reason: the Pokeapi dex entries don't specify regional forms
  'paldea-blueberry', // Reason: the Pokeapi dex entries don't specify regional forms
]

export async function importPokedexes() {
  const pokemonMap = localDataLoader.pokemon()

  for (let i = 0; i < pokedexesIndex.length; i++) {
    const pokedex = pokedexesIndex[i]
    if (!pokedex || !pokedex.pokeApiId) {
      continue
    }

    if (skippedDexes.includes(pokedex.id)) {
      console.log(`Skipping dex ${pokedex.id}`)
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
        dexNum: entry.entry_number,
        isForm: pkmData.isForm ?? false,
      })

      // Add all forms available in this gamesets
      const obtainableForms: Pokemon[] = (pkmData.forms ?? [])
        .map((form) => {
          const formData = pokemonMap.get(form)
          if (!formData) {
            throw new Error(`Wrong from ID for pokemon: '${pkmData.id}' : '${form}'`)
          }
          return formData
        })
        .filter((form) => form.registrableIn.some((gameId) => pokedexData.gameIds.includes(gameId)))

      if (obtainableForms.length > 0) {
        console.log(`Adding ${obtainableForms.length} forms for ${pkmData.id} and dex: ${pokedex.id}`)
      }

      for (const form of obtainableForms) {
        pokedexData.entries.push({
          id: form.id,
          dexNum: entry.entry_number,
          isForm: true,
        })
      }
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
