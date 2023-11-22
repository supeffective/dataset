import z from 'zod'

import { hexColorSchema, nameSchema } from './common'

export const pokeTypeIdSchema = z.enum([
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
])

export const pokeTypeSchema = z.object({
  id: pokeTypeIdSchema,
  name: nameSchema,
  color: hexColorSchema,
})

export type PokeType = z.infer<typeof pokeTypeSchema>
export type PokeTypeId = z.infer<typeof pokeTypeIdSchema>
