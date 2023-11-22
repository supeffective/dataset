import z from 'zod'

import { descriptionSchema, generationSchema, nameSchema, slugSchema } from './common'

export const markSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  title: descriptionSchema,
  generation: generationSchema,
  desc: descriptionSchema,
  conditions: descriptionSchema,
})

export type Mark = z.infer<typeof markSchema>
