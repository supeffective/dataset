import { Dex, Item as DexItem } from '@pkmn/dex'

import { type Item, type ItemCategory, itemSchema } from '../../../schemas'
import { type DataOverrideDefinition, getDataPath, writeEntitiesFileAsJson } from '../../utils/fs'
import overridesRaw from './_overrides/items.json'

const overrides: DataOverrideDefinition = overridesRaw

function getItemCategory(item: DexItem): ItemCategory {
  if (item.isBerry) {
    return 'berry'
  }
  if (item.isGem || item.isChoice) {
    return 'holdable'
  }
  if (item.isPokeball) {
    return 'ball'
  }

  return 'other'
}
export const importShowdownItems = function (): void {
  const outFile = getDataPath('items.json')
  const transformedRows: Item[] = []

  const rawRows = Array.from(Dex.items.all())

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

    if (overrides.exclude.includes(row.id)) {
      continue
    }

    const record: Item = {
      id: row.id,
      name: row.name,
      psName: row.name,
      generation: row.gen,
      desc: row.desc.length > 0 ? row.desc : null,
      shortDesc: row.shortDesc,
      category: getItemCategory(row),
    }

    itemSchema.parse(record)

    transformedRows.push(record)
  }

  writeEntitiesFileAsJson(outFile, transformedRows)
}
