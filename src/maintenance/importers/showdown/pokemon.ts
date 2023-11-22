import { Dex } from '@pkmn/dex'

import type { Pokemon } from '../../../schemas'
import { updateManyPokemon } from '../../commands'
import {
  getAbilityByShowdownNameOrFail,
  getItemByShowdownNameOrFail,
  getMoveByShowdownNameOrFail,
  getPokemonByShowdownNameOrFail,
  getPokemonList,
} from '../../queries'

const ignoredShowdownIds = [
  'pikachucosplay',
  'pikachurockstar',
  'pikachubelle',
  'pikachupopstar',
  'pikachuphd',
  'pikachulibre',
  'pikachustarter',
  'eeveestarter',
  'pichuspikyeared',
  'floetteeternal',
  // Skip these for now:
  'ogerpontealtera',
  'ogerponwellspringtera',
  'ogerponhearthflametera',
  'ogerponcornerstonetera',
]

export const importShowdownPokemon = function (): void {
  const allPokemon = getPokemonList()
  const allPokemonByShowdownId: Map<string, Pokemon[]> = new Map()
  for (const pokemon of allPokemon) {
    if (!pokemon.refs?.showdown) {
      throw new Error(`Pokemon ${pokemon.id} has no showdown ref`)
    }
    if (!pokemon.refs?.bulbapedia) {
      throw new Error(`Pokemon ${pokemon.id} has no bulbapedia ref`)
    }
    if (!pokemon.refs?.serebii) {
      throw new Error(`Pokemon ${pokemon.id} has no serebii ref`)
    }
    if (!pokemon.refs?.smogon) {
      throw new Error(`Pokemon ${pokemon.id} has no smogon ref`)
    }

    const showdownId = pokemon.refs.showdown

    if (!allPokemonByShowdownId.has(showdownId)) {
      allPokemonByShowdownId.set(showdownId, [pokemon])
    } else {
      allPokemonByShowdownId.get(showdownId)?.push(pokemon)
    }
  }
  const transformedRows: Pokemon[] = []

  // ------------------------------------------------
  // VALIDATE & cross-check with showdown
  // ------------------------------------------------
  const showdownRecords = Array.from(Dex.species.all())

  const sortedShowdownRecords = showdownRecords
    .filter((row) => Number(row.num) > 0)
    .filter((row) => {
      if (row.id.endsWith('totem') || ignoredShowdownIds.includes(row.id)) {
        return false
      }

      return true
    })
    .sort(function (a, b) {
      return Number(a.num) - Number(b.num)
    })

  const rowsById: Map<string, typeof showdownRecords[number]> = new Map()
  for (const row of sortedShowdownRecords) {
    if (!allPokemonByShowdownId.has(row.id)) {
      throw new Error(`Missing pokemon.json entry for: ${row.id}`)
    }
    rowsById.set(row.id, row)
  }

  const isInShowdown = (pkm: Pokemon): boolean => {
    if (!pkm.refs?.showdown || pkm.refs?.showdown === 'unknown' || pkm.refs?.showdown === '???') {
      return false
    }
    if (rowsById.has(pkm.refs.showdown)) {
      return true
    }
    if (pkm.dexNum <= 0) {
      // is a brand new discovered pokemon
      return false
    }

    return true
  }

  for (const [showdownId, pokemonSet] of allPokemonByShowdownId) {
    for (const setPkm of pokemonSet) {
      if (setPkm.dexNum <= 0) {
        continue
      }
      if (!isInShowdown(setPkm)) {
        console.log(`Skipping ${showdownId}`)
        continue
      }

      if (!rowsById.has(showdownId)) {
        throw new Error(`Showdown doesnt have data for: ${showdownId}`)
      }
    }
  }

  // ------------------------------------------------
  // SYNC data with showdown
  // ------------------------------------------------

  for (const pkm of allPokemon) {
    const showdownId = pkm.refs?.showdown
    if (!showdownId) {
      throw new Error(`Pokemon ${pkm.id} has no showdown ref`)
    }

    pkm.forms = [...pkm.forms.filter((form: string) => form !== pkm.id)]

    if (!isInShowdown(pkm)) {
      transformedRows.push(pkm)
      continue
    }

    const showdownData = rowsById.get(showdownId)

    if (!showdownData) {
      throw new Error(`Missing showdown data for ${showdownId}`)
    }

    // abilities
    if (pkm.isSpecialAbilityForm) {
      const showdownAbilityName = showdownData.abilities.S ?? showdownData.abilities[0]
      if (!showdownAbilityName) {
        throw new Error(`Missing special ability for ${showdownId}`)
      }
      const ability = getAbilityByShowdownNameOrFail(showdownAbilityName)
      pkm.abilities.primary = ability.id
      pkm.abilities.secondary = null
      pkm.abilities.hidden = null
    } else {
      pkm.abilities.primary = getAbilityByShowdownNameOrFail(showdownData.abilities[0]).id
      if (showdownData.abilities[1]) {
        pkm.abilities.secondary = getAbilityByShowdownNameOrFail(showdownData.abilities[1]).id
      }
      if (showdownData.abilities.H) {
        pkm.abilities.hidden = getAbilityByShowdownNameOrFail(showdownData.abilities.H).id
      }
    }

    // weight
    pkm.weight = Math.round(showdownData.weighthg * 10)

    // type1
    pkm.type1 = showdownData.types[0].toLowerCase()
    pkm.type2 = showdownData.types[1]?.toLowerCase() ?? null

    // stats
    pkm.baseStats.hp = showdownData.baseStats.hp
    pkm.baseStats.atk = showdownData.baseStats.atk
    pkm.baseStats.def = showdownData.baseStats.def
    pkm.baseStats.spa = showdownData.baseStats.spa
    pkm.baseStats.spd = showdownData.baseStats.spd
    pkm.baseStats.spe = showdownData.baseStats.spe

    // update psName
    pkm.psName = showdownData.name

    if (showdownData.prevo) {
      const prevo = getPokemonByShowdownNameOrFail(showdownData.prevo)
      let evoItemId = null

      if (showdownData.evoItem) {
        evoItemId = getItemByShowdownNameOrFail(showdownData.evoItem).id
      }

      let evoMoveId = null
      if (showdownData.evoMove) {
        evoMoveId = getMoveByShowdownNameOrFail(showdownData.evoMove).id
      }

      pkm.evolvesFrom = {
        ...pkm.evolvesFrom,
        pokemon: prevo.id,
        level: showdownData.evoLevel || undefined,
        item: evoItemId || undefined,
        move: evoMoveId || undefined,
        region: showdownData.evoRegion?.toLocaleLowerCase() ?? undefined,
        type: showdownData.evoType?.toLocaleLowerCase() ?? undefined,
        condition: showdownData.evoCondition || undefined,
      }
    }

    transformedRows.push(pkm)
  }

  // ------------------------------------------------
  // REGENERATE legacy data
  // ------------------------------------------------

  updateManyPokemon(transformedRows)
}
