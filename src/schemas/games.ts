import z from 'zod'

import { generationSchema, nameSchema, slugSchema } from './common'

export const gameSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  fullName: nameSchema.optional(),
  generation: generationSchema,
  type: z.enum(['superset', 'set', 'game', 'dlc']), //.or(z.string()),
  gameSet: slugSchema.nullable(),
  gameSuperSet: slugSchema.nullable(),
  codename: nameSchema.nullable(),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  platforms: z
    .array(
      z.enum(['gb', 'gbc', 'gba', 'nds', '3ds', 'switch', 'mobile']),
      //.or(z.string())
    )
    .min(1),
  region: slugSchema.nullable(),
  originMark: slugSchema.nullable(),
  pokedexes: z.array(slugSchema),
  features: z.object({
    training: z.boolean(), // when true, the Pokemon are trainable with traditional methods (evs, ivs, hyper training, etc)
    shiny: z.boolean(),
    items: z.boolean(),
    gender: z.boolean(),
    // pokerus: z.boolean(), // All except Gen 1, GO and S/V
    nature: z.boolean(),
    // shadow: z.boolean(), // Colosseum, XD and GO
    ball: z.boolean(),
    mega: z.boolean(),
    zmove: z.boolean(),
    gmax: z.boolean(),
    alpha: z.boolean(),
    tera: z.boolean(),
    ribbons: z.boolean(),
    marks: z.boolean(),
  }),
  storage: z.object({
    numBoxes: z.coerce.number(),
    boxCapacity: z.coerce.number(),
  }),
})

export type Game = z.infer<typeof gameSchema>
