import z from 'zod'

import { descriptionSchema, detailSchema, generationNumSchema, nameSchema, slugSchema } from './common'

export const abilitySchema = z.object({
  id: slugSchema,
  name: nameSchema,
  psName: nameSchema,
  generation: generationNumSchema,
  desc: detailSchema,
  shortDesc: descriptionSchema,
})

export type Ability = z.infer<typeof abilitySchema>
