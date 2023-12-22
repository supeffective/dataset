import { z } from 'zod'
import { getPokemonList } from '../maintenance/queries'
import { validate } from '../maintenance/validation'
import { pokemonSchema } from '../schemas'
import { fetchImagesIndexMap } from './utils'

describe('Validate pokemon/*.json data', () => {
  const recordList = getPokemonList()

  it('should be valid', () => {
    const listSchema = z.array(pokemonSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})

describe('Validate CDN images', () => {
  const recordList = getPokemonList()

  it('has all pokemon home3d-bordered images (regular)', async () => {
    const images = await fetchImagesIndexMap('pokemon')
    for (const record of recordList) {
      if (!images.has(record.nid)) {
        console.warn(`Missing image for pokemon ${record.nid}`)
      }
      expect(images.has(record.nid)).toBe(true)
    }
  })

  it('has all pokemon home3d-bordered images (shiny)', async () => {
    const images = await fetchImagesIndexMap('pokemonShiny')
    for (const record of recordList) {
      if (!images.has(record.nid)) {
        console.warn(`Missing image for pokemon ${record.nid}`)
      }
      expect(images.has(record.nid)).toBe(true)
    }
  })
})
