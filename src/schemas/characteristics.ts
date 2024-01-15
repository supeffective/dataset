import z from 'zod'

import { slugSchema, statIdSchema } from './common'

export const characteristicSchema = z.object({
  id: slugSchema,
  description: z.string(),
  highestStat: statIdSchema,
  ivs: z.array(z.number().int().min(0).max(31)).min(5).max(7),
})

export type Characteristic = z.infer<typeof characteristicSchema>
