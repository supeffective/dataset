import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const originMarkSchema = z.object({
  id: slugSchema,
  name: nameSchema,
})

export type OriginMark = z.infer<typeof originMarkSchema>
