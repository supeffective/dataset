import z from 'zod'

import { descriptionSchema, generationSchema, nameSchema, slugSchema } from './common'

export const ribbonSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  title: descriptionSchema,
  category: z.enum(['league', 'contest', 'tower', 'memory', 'gift']),
  generation: generationSchema,
  desc: descriptionSchema,
})

export type Ribbon = z.infer<typeof ribbonSchema>
