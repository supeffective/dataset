import { z } from 'zod'
import { localDataLoader } from '../maintenance/loader'
import { validate } from '../maintenance/validation'
import { boxPresetSchema } from '../schemas'

describe('Validate boxpresets.json data', () => {
  const recordList = Array.from(localDataLoader.boxPresets().values())

  it('should have a valid schema', () => {
    const listSchema = z.array(boxPresetSchema)
    const validation = validate(listSchema, recordList)

    if (!validation.success) {
      console.error(validation.errorsSummary.join('\n'))
    }

    expect(validation.success).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  describe('presets should have valid data', () => {
    for (const preset of recordList) {
      it(`preset ${preset.id}`, () => {
        const game = localDataLoader.games().find((g) => g.id === preset.gameSet)

        if (!game) {
          throw new Error(`Gameset "${preset.gameSet}" not found for box preset ${preset.id}`)
        }

        if (preset.boxes.length > game.storage.numBoxes) {
          // console.warn(
          //   ` 💥 Preset ${preset.id} has more boxes than allowed: ${preset.boxes.length}/${game.storage.numBoxes}`
          // );
        }

        // expect(preset.boxes.length).toBeLessThanOrEqual(game.storage.numBoxes);
        for (const i in preset.boxes) {
          const box = preset.boxes[i]
          if (box) {
            expect(box.pokemon.length).toBeLessThanOrEqual(game.storage.boxCapacity)
          }
        }
      })
    }
  })

  describe('boxes should not have trailing nulls', () => {
    for (const preset of recordList) {
      it(`boxes of preset ${preset.id} should not have trailing nulls`, () => {
        for (const box of preset.boxes) {
          const lastItem = box.pokemon[box.pokemon.length - 1]
          if (!lastItem) {
            console.log(preset.id, box.pokemon)
          }
          expect(lastItem).not.toBeNull()
        }
      })
    }
  })
})
