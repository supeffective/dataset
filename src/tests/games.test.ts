import { z } from 'zod'
import { localDataLoader } from '../maintenance/loader'
import { validate } from '../maintenance/validation'
import { gameSchema } from '../schemas'

describe('Validate games.json data', () => {
  const recordList = localDataLoader.games()

  it('should be valid', () => {
    const listSchema = z.array(gameSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})
