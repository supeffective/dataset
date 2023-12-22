import { z } from 'zod'
import { localDataLoader } from '../maintenance/loader'
import { validate } from '../maintenance/validation'
import { gameSchema } from '../schemas'
import { fetchImagesIndexMap } from './utils'

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

describe('Validate CDN images', () => {
  const recordList = localDataLoader.games()

  it('has all game tile images', async () => {
    const images = await fetchImagesIndexMap('gameTiles')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing tile for game ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })

  it('has all game avatar images', async () => {
    const images = await fetchImagesIndexMap('gameAvatars')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing avatar for game ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })
})
