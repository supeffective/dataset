import { z } from 'zod'
import { localDataLoader } from '../maintenance/loader'
import { validate } from '../maintenance/validation'
import { pokedexSchema } from '../schemas'

describe('Validate pokedexes.json data', () => {
  const recordList = Array.from(localDataLoader.pokedexes().values())

  it('should be valid', () => {
    const listSchema = z.array(pokedexSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})
