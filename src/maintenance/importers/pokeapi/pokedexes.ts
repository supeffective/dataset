import axios from 'axios'
import { MainClient } from 'pokenode-ts'
import { sleepMs } from '../../../utils'

export async function importPokedexes() {
  axios.defaults.headers.common['Accept-Encoding'] = 'gzip' // TODO: remove when Bun supports Brotli compression
  const api = new MainClient()

  const regionIds = Array(10)
    .fill(0)
    .map((_, i) => i + 1)

  for (const regionId of regionIds) {
    const regionData = await api.location.getRegionById(regionId)
    const dexes = regionData.pokedexes

    for (const pokedex of dexes) {
      const pokedexData = await api.game.getPokedexByName(pokedex.name)

      console.log({
        id: pokedexData.id,
        name: pokedexData.name,
        isMain: pokedexData.is_main_series,
      })
      sleepMs(1000)
    }

    sleepMs(1000)
  }
}
