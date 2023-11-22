import z from 'zod'

import { nameSchema, slugSchema, statIdSchema } from './common'

export const natureSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  raises: statIdSchema.nullable(),
  lowers: statIdSchema.nullable(),
  berry: slugSchema.nullable(),
})

export type Nature = z.infer<typeof natureSchema>
