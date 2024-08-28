import z from 'zod'

import { generationNumSchema, nameSchema, slugSchema } from './common'

export const gameIndexItemSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  fullName: z.string().max(80).optional(),
  type: z.enum(['superset', 'set', 'game', 'dlc']), //.or(z.string()),
  gameSet: slugSchema.nullable(),
  gameSuperSet: slugSchema.nullable(),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generation: generationNumSchema,
  region: slugSchema.nullable(),
  originMark: slugSchema.nullable(),
  pokedexes: z.array(slugSchema),
  storage: z.object({
    numBoxes: z.coerce.number(),
    boxCapacity: z.coerce.number(),
  }),
})

export const gameSchema = gameIndexItemSchema.extend({
  codename: nameSchema.nullable(),
  platforms: z
    .array(
      z.enum(['gb', 'gbc', 'ngc', 'gba', 'nds', '3ds', 'switch', 'mobile']),
      //.or(z.string())
    )
    .min(1),
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
  obtainablePokemon: z.array(slugSchema),
  storablePokemon: z.array(slugSchema),
  eventPokemon: z.array(slugSchema),
})

export type GameIndexItem = z.infer<typeof gameIndexItemSchema>
export type Game = z.infer<typeof gameSchema>
