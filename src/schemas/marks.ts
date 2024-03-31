import z from 'zod'

import { descriptionSchema, generationNumSchema, nameSchema, slugSchema } from './common'

export const markSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  title: descriptionSchema,
  generation: generationNumSchema,
  desc: descriptionSchema,
  conditions: descriptionSchema,
  chance: z.string(),
  chanceCharm: z.string(),
})

export type Mark = z.infer<typeof markSchema>
