import z from 'zod'

import { descriptionSchema, detailSchema, generationSchema, nameSchema, slugSchema } from './common'

export const itemCategorySchema = z.enum([
  'ball',
  'medicine',
  'battle',
  'berry',
  'holdable',
  'evolution',
  'machine',
  'treasure',
  'ingredient',
  'key',
  'other',
])

export type ItemCategory = z.infer<typeof itemCategorySchema>

export const itemSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  psName: nameSchema,
  generation: generationSchema,
  desc: detailSchema,
  shortDesc: descriptionSchema,
  category: itemCategorySchema,
})

export type Item = z.infer<typeof itemSchema>
