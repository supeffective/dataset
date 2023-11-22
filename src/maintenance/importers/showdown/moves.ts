import { Dex } from '@pkmn/dex'

import { type Move, moveSchema } from '../../../schemas'
import { getDataPath, writeEntitiesFileAsJson } from '../../utils/fs'

export const importShowdownMoves = function (): void {
  const outFile = getDataPath('moves.json')
  const transformedRows: Move[] = []

  const rawRows = Array.from(Dex.moves.all())

  const rawRowsSorted = rawRows
    .filter((row) => Number(row.num) > 0)
    .sort(function (a, b) {
      return Number(a.num) - Number(b.num)
    })

  rawRowsSorted.forEach((row) => {
    const num: number | undefined = row.num
    let gen = 1

    if (num === undefined || isNaN(num) || num <= 0) {
      return
    }

    if (num >= 166 && num <= 252) {
      gen = 2
    } else if (num >= 253 && num <= 354) {
      gen = 3
    } else if (num >= 355 && num <= 467) {
      gen = 4
    } else if (num >= 468 && num <= 559) {
      gen = 5
    } else if (num >= 560 && num <= 621) {
      gen = 6
    } else if (num >= 622 && num <= 742) {
      gen = 7
    } else if (num >= 743 && num <= 850) {
      gen = 8
    } else if (num >= 10001 && num <= 10033) {
      // gmax moves
      gen = 8
    } else if (num >= 851 && num <= 2000) {
      // TODO: narrow down max num for gen 9
      gen = 9
    }

    const record: Move = {
      id: row.id,
      name: row.name,
      psName: row.name,
      generation: gen,
      desc: row.desc.length > 0 ? row.desc : null,
      shortDesc: row.shortDesc,
      type: (row.type || '?').toLowerCase(),
      power: row.basePower || 0,
      accuracy: row.accuracy === true ? 101 : row.accuracy || 0,
      pp: row.pp || 0,
      category: (row.category || '-').toLowerCase() as any,
      priority: row.priority || 0,
      isZ: !!row.isZ,
      isGmax: !!row.isMax,
    }

    moveSchema.parse(record)

    transformedRows.push(record)
  })

  writeEntitiesFileAsJson(outFile, transformedRows)
}
