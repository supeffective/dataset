import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const regionSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  generations: z.array(z.coerce.number().min(1)),
})

export type Region = z.infer<typeof regionSchema>
