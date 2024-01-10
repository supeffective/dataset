import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const gameFeatureSchema = z.object({
  id: slugSchema,
  name: nameSchema,
})

export type GameFeature = z.infer<typeof gameFeatureSchema>
