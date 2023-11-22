import { z } from 'zod'

import { PKM_LATEST_GENERATION } from '../constants'

export const nameSchema = z.string().max(50)
export const slugSchema = z
  .string()
  .max(50)
  .regex(/^[a-z0-9-]+$/)
export const generationSchema = z.coerce.number().min(0).max(PKM_LATEST_GENERATION)
export const descriptionSchema = z.string().max(200)
export const detailSchema = z.string().max(2000).nullable()

export const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i)

export const statIdSchema = z.enum(['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva'])

export type IDType = string

export const baseEntitySchema = z.object({
  id: slugSchema,
  name: nameSchema,
})

export type BaseEntity = z.infer<typeof baseEntitySchema>
