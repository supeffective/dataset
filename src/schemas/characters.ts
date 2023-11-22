import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const characterSchema = z.object({
  id: slugSchema,
  name: nameSchema,
})

export type Character = z.infer<typeof characterSchema>
