import { z } from 'zod'
import { localDataLoader } from '../internal/loader'
import { validate } from '../internal/validation'
import { pokemonGamesIndexMap, pokemonRegionsMap } from '../provider'
import { gameSchema } from '../schemas'
import { fetchImagesIndexMap } from './utils'

describe('Validate games.json data', () => {
  const recordList = localDataLoader.games()

  it('should be valid', () => {
    const listSchema = z.array(gameSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })
})

describe('Validate games.json pokemon references', () => {
  const pokemonMap = localDataLoader.pokemon()
  const recordList = localDataLoader.games()

  for (const record of recordList) {
    describe(`Game '${record.id}'`, () => {
      const obtainablePokemon = record.obtainablePokemon
      const storablePokemon = record.storablePokemon
      const eventOnlyPokemon = record.eventPokemon

      it('should have valid obtainable Pokemon IDs', () => {
        for (const id of obtainablePokemon) {
          if (!pokemonMap.has(id)) {
            console.warn(`Unknown ID for obtainable Pokemon '${id}' for game '${record.id}'`)
          }
          expect(pokemonMap.has(id)).toBe(true)
        }
      })

      it('should have valid storable Pokemon IDs', () => {
        for (const id of storablePokemon) {
          if (!pokemonMap.has(id)) {
            console.warn(`Unknown ID for storable Pokemon '${id}' for game '${record.id}'`)
          }
          expect(pokemonMap.has(id)).toBe(true)
        }
      })

      it('should have valid event Pokemon IDs', () => {
        for (const id of eventOnlyPokemon) {
          if (!pokemonMap.has(id)) {
            console.warn(`Unknown ID for event Pokemon '${id}' for game '${record.id}'`)
          }
          expect(pokemonMap.has(id)).toBe(true)
        }
      })
    })
  }
})

describe('Validate games.json pokedex references', () => {
  const recordList = localDataLoader.games()

  for (const record of recordList) {
    describe(`Game '${record.id}'`, () => {
      const dexIds = record.pokedexes

      it('should have at least one pokedexe if game type is other than "superset"', () => {
        if (record.type !== 'superset') {
          expect(record.pokedexes.length).toBeGreaterThan(0)
        }
      })

      it('should not have any pokedexes if game type is "superset"', () => {
        if (record.type === 'superset') {
          expect(record.pokedexes).toHaveLength(0)
        }
      })

      it('should have valid pokedex IDs', () => {
        expect(dexIds.every((id) => localDataLoader.pokedexes().has(id))).toBe(true)
      })

      it('should not have duplicate pokedex IDs', () => {
        expect(dexIds).toHaveLength(new Set(dexIds).size)
      })

      it('should have valid gameset ID', () => {
        expect(record.gameSuperSet === null || pokemonGamesIndexMap.has(record.gameSuperSet)).toBe(true)
      })

      it('should have valid game superset ID', () => {
        expect(record.gameSet === null || pokemonGamesIndexMap.has(record.gameSet)).toBe(true)
      })

      it('should have valid region ID', () => {
        expect(record.region === null || pokemonRegionsMap.has(record.region)).toBe(true)
      })
    })
  }
})

describe('Validate CDN images', () => {
  const recordList = localDataLoader.games()

  it('has all game tile images', async () => {
    const images = await fetchImagesIndexMap('gameTiles')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing tile for game ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })

  it('has all game avatar images', async () => {
    const images = await fetchImagesIndexMap('gameAvatars')
    for (const record of recordList) {
      if (!images.has(record.id)) {
        console.warn(`Missing avatar for game ${record.id}`)
      }
      expect(images.has(record.id)).toBe(true)
    }
  })
})
