import z from 'zod'

import { generationNumSchema, nameSchema, slugSchema } from './common'

export const pokemonIndexItemSchema = z
  .object({
    id: slugSchema,
    nid: slugSchema,
    name: nameSchema,
    region: slugSchema,
    isForm: z.coerce.boolean().optional(),
  })
  .strict()

export type PokemonIndexItem = z.infer<typeof pokemonIndexItemSchema>

export const pokemonTextSchema = z.object({
  name: z.string(),
  genus: z.string(),
  flavorText: z.array(
    z.object({
      game: slugSchema,
      text: z.string(),
    }),
  ),
})

export type PokemonText = z.infer<typeof pokemonTextSchema>

export const pokemonTextIndexSchema = z.record(z.record(z.string(), { description: 'Language' }), {
  description: 'PokemonId',
})

export type PokemonTextIndex = z.infer<typeof pokemonTextIndexSchema>

export const pokemonTextByLangSchema = z.record(pokemonTextSchema)

export type PokemonTextByLang = z.infer<typeof pokemonTextByLangSchema>

export const pokemonSchema = z
  .object({
    id: slugSchema,
    nid: slugSchema,
    dexNum: z.coerce.number().int().min(0),
    formId: slugSchema.nullable().optional(),
    name: nameSchema,
    formName: nameSchema.nullable().optional(),
    region: slugSchema,
    generation: generationNumSchema,
    type1: slugSchema,
    type2: slugSchema.nullable().optional(),
    /**
     * Forced tera type (e.g. for Ogerpon and Terapagos)
     * Forced tera type (e.g. for Ogerpon and Terapagos)
     */
    teraType: slugSchema.nullable().optional(),
    color: slugSchema,
    abilities: z
      .object({
        primary: slugSchema,
        secondary: slugSchema.nullable().optional(),
        hidden: slugSchema.nullable().optional(),
      })
      .strict(),
    isDefault: z.coerce.boolean().optional(),
    isForm: z.coerce.boolean().optional(),
    isLegendary: z.coerce.boolean().optional(),
    isMythical: z.coerce.boolean().optional(),
    isUltraBeast: z.coerce.boolean().optional(),
    ultraBeastCode: z.string().nullable().optional(),
    isParadox: z.coerce.boolean().optional(),
    paradoxSpecies: z.array(slugSchema).nullable().optional(),
    isConvergent: z.coerce.boolean().optional(),
    convergentSpecies: z.array(slugSchema).nullable().optional(),
    isSpecialAbilityForm: z.coerce.boolean().optional(),
    isCosmeticForm: z.coerce.boolean().optional(),
    isFemaleForm: z.coerce.boolean().optional(),
    hasGenderDifferences: z.coerce.boolean().optional(),
    isBattleOnlyForm: z.coerce.boolean().optional(),
    isSwitchableForm: z.coerce.boolean().optional(),
    isFusion: z.coerce.boolean().optional(),
    fusedWith: z.array(slugSchema).nullable().optional(),
    isMega: z.coerce.boolean().optional(),
    isPrimal: z.coerce.boolean().optional(),
    isGmax: z.coerce.boolean().optional(),
    isRegional: z.coerce.boolean().optional(),
    canGmax: z.coerce.boolean().optional(),
    canDynamax: z.coerce.boolean().optional(),
    canBeAlpha: z.coerce.boolean().optional(),
    // ---- Obtainability:
    debutIn: slugSchema, // the first game it appeared in
    obtainableIn: z.array(slugSchema).optional(), // if it can be obtained in-game any time, without temporary or online events
    versionExclusiveIn: z.array(slugSchema).optional(), // if it's exclusive to a game version
    eventOnlyIn: z.array(slugSchema).optional(), // if it's exclusive to an event, and not obtainable in-game
    storableIn: z.array(slugSchema).optional(), // if it's storable in the game's boxes
    registrableIn: z.array(slugSchema).optional(), // if it's registrable in the game's dex
    // -------------------
    shinyReleased: z.coerce.boolean().optional(),
    shinyBase: slugSchema.nullable().optional(),
    baseStats: z
      .object({
        hp: z.coerce.number().int().min(-1).max(255),
        atk: z.coerce.number().int().min(-1).max(255),
        def: z.coerce.number().int().min(-1).max(255),
        spa: z.coerce.number().int().min(-1).max(255),
        spd: z.coerce.number().int().min(-1).max(255),
        spe: z.coerce.number().int().min(-1).max(255),
      })
      .strict(),
    weight: z.coerce.number().int().min(-1).max(999999),
    height: z.coerce.number().int().min(-1).max(999999),
    maleRate: z.coerce.number().min(-1).max(100),
    femaleRate: z.coerce.number().min(-1).max(100),
    baseSpecies: slugSchema.nullable().optional(),
    baseForms: z.array(slugSchema),
    forms: z.array(slugSchema),
    family: slugSchema.nullable().optional(),
    evolvesFrom: z
      .object({
        pokemon: slugSchema.nullable().optional(),
        level: z.coerce.number().int().min(1).max(100).optional(),
        item: slugSchema.nullable().optional(),
        move: slugSchema.nullable().optional(),
        type: slugSchema.nullable().optional(),
        region: slugSchema.nullable().optional(),
        ability: slugSchema.nullable().optional(), // not provided by showdown (e.g. needed for rockruff (own tempo))
        condition: z.string().nullable().optional(),
      })
      .strict()
      .nullable()
      .optional(),
    refs: z
      .object({
        smogon: z.string(),
        showdown: z.string(),
        showdownName: z.string(),
        serebii: z.string(),
        bulbapedia: z.string(),
      })
      .strict(),
  })
  .strict()

export type Pokemon = z.infer<typeof pokemonSchema>
