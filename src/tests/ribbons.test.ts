import { z } from 'zod'
import { localDataLoader } from '../maintenance/loader'
import { validate } from '../maintenance/validation'
import { ribbonSchema } from '../schemas'
import { fetchImagesIndexMap } from './utils'

describe('Validate ribbons.json data', () => {
  const recordList = localDataLoader.ribbons()

  it('should be valid', () => {
    const listSchema = z.array(ribbonSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})

describe('Validate CDN images', () => {
  const recordList = localDataLoader.ribbons()

  it('has all ribbon images', async () => {
    const images = await fetchImagesIndexMap('ribbons')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing image for ribbon ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })
})
