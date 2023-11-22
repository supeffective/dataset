import z from 'zod'

import { hexColorSchema, nameSchema, slugSchema } from './common'

export const colorSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  color: hexColorSchema,
})

export type Color = z.infer<typeof colorSchema>
