import { Dex } from '@pkmn/dex'

import { type Ability, abilitySchema } from '../../../schemas'
import { getDataPath, writeEntitiesFileAsJson } from '../../utils/fs'

export const importShowdownAbilities = function (): void {
  const outFile = getDataPath('abilities.json')
  const transformedRows: Ability[] = []

  const rawRows = Array.from(Dex.abilities.all())

  const rawRowsSorted = rawRows
    .filter((row) => Number(row.num) > 0)
    .sort(function (a, b) {
      return Number(a.num) - Number(b.num)
    })

  for (const row of rawRowsSorted) {
    const num: number | undefined = row.num

    if (num === undefined || Number.isNaN(num) || num <= 0) {
      continue
    }

    const record: Ability = {
      id: row.id,
      name: row.name,
      psName: row.name,
      generation: row.gen,
      desc: row.desc.length > 0 ? row.desc : null,
      shortDesc: row.shortDesc,
    }

    abilitySchema.parse(record)

    transformedRows.push(record)
  }

  writeEntitiesFileAsJson(outFile, transformedRows)
}
