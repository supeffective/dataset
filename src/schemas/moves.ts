import z from 'zod'

import { descriptionSchema, detailSchema, generationSchema, nameSchema, slugSchema } from './common'

export const moveSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  psName: nameSchema,
  generation: generationSchema,
  desc: detailSchema,
  shortDesc: descriptionSchema,
  type: slugSchema,
  power: z.coerce.number().min(0).max(999),
  accuracy: z.coerce.number().min(0).max(101),
  pp: z.coerce.number().min(0).max(100),
  category: z.enum(['physical', 'special', 'status']),
  priority: z.coerce.number().min(-10).max(10),
  isZ: z.boolean(),
  isGmax: z.boolean(),
})

export type Move = z.infer<typeof moveSchema>
