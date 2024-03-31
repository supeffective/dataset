import { z } from 'zod'
import { localDataLoader } from '../internal/loader'
import { validate } from '../internal/validation'
import { markSchema } from '../schemas'
import { fetchImagesIndexMap } from './utils'

describe('Validate marks.json data', () => {
  const recordList = localDataLoader.marks()

  it('should be valid', () => {
    const listSchema = z.array(markSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})

describe('Validate CDN images', () => {
  const recordList = localDataLoader.marks()

  it('has all mark images', async () => {
    const images = await fetchImagesIndexMap('marks')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing image for mark ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })
})
