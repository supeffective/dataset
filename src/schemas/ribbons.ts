import z from 'zod'

import { descriptionSchema, generationNumSchema, nameSchema, slugSchema } from './common'

export const ribbonSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  title: descriptionSchema,
  generation: generationNumSchema,
  desc: descriptionSchema,
  category: z.enum(['league', 'contest', 'tower', 'memory', 'gift']),
})

export type Ribbon = z.infer<typeof ribbonSchema>
