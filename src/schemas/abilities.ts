import z from 'zod'

import { descriptionSchema, detailSchema, generationSchema, nameSchema, slugSchema } from './common'

export const abilitySchema = z.object({
  id: slugSchema,
  name: nameSchema,
  psName: nameSchema,
  generation: generationSchema,
  desc: detailSchema,
  shortDesc: descriptionSchema,
})

export type Ability = z.infer<typeof abilitySchema>
