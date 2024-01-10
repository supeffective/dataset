import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const locationSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  gameIds: z.array(slugSchema).or(z.literal('*')),
})

export type Location = z.infer<typeof locationSchema>
