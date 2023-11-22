import { type BoxPreset, type BoxPresetBox, type Pokedex, type Pokemon, boxPresetSchema } from '../../schemas'
import { getBoxPresets, getPokedexes, getPokemonList } from '../queries'
import { getDataPath, pathExists, writeFile } from '../utils/fs'

const allPokemon = getPokemonList()
const allPokemonMap = new Map(allPokemon.map((p) => [p.id, p]))
const boxPresetsMap = new Map(getBoxPresets().map((p) => [p.id, p]))
const pokedexesMap = getPokedexes()

type BoxPresetMode = 'fully-sorted' | 'sorted-species'

function distributePokemonInBoxes(
  pokemonList: Pokemon[],
  gameSetId: string,
  mode: BoxPresetMode,
  maxBoxSize = 30,
  minimal = false,
  startsNewBox: string[] = [],
  startNewBoxForNewGenStarters = true,
  startNewBoxForForms = true,
): BoxPresetBox[] {
  const boxes: BoxPresetBox[] = [
    {
      pokemon: [],
    },
  ]
  const storableInGame = pokemonList.filter((p) => p.storableIn.includes(gameSetId))

  let currentBoxIndex = 0
  let currentBox = boxes[currentBoxIndex] as BoxPresetBox

  function addNewBox(): void {
    boxes.push({
      pokemon: [],
    })
    currentBoxIndex++
    currentBox = boxes[currentBoxIndex] as BoxPresetBox
  }

  for (const p of storableInGame) {
    const starterNewBox = startNewBoxForNewGenStarters && startsNewBox.includes(p.id) && currentBoxIndex > 0
    if (currentBox.pokemon.length === maxBoxSize || starterNewBox) {
      addNewBox()
    }

    if (!p.isForm) {
      currentBox.pokemon.push(p.id)
      continue
    }

    const skipForm = p.isForm && minimal && (p.isCosmeticForm || p.isLegendary || p.isMythical)

    // mix forms with the species for 'fully-sorted' mode
    if (mode === 'fully-sorted' && p.isForm && !skipForm) {
      currentBox.pokemon.push(p.id)
    }
  }

  // add forms at the end for 'sorted-species' mode
  if (mode === 'sorted-species') {
    // Start a new box for the forms
    if (startNewBoxForForms && currentBox.pokemon.length > 0) {
      addNewBox()
    }

    for (const p of storableInGame) {
      if (currentBox.pokemon.length === maxBoxSize) {
        addNewBox()
      }
      const skipForm = p.isForm && minimal && (p.isCosmeticForm || p.isLegendary || p.isMythical)
      if (p.isForm && !skipForm) {
        currentBox.pokemon.push(p.id)
      }
    }
  }

  if (currentBoxIndex + 1 !== boxes.length) {
    throw new Error(`Box overflow: ${boxes.length}`)
  }

  return boxes
}

function validatePresetBoxes(preset: BoxPreset, minimal = false): string[] {
  const storableInGame = allPokemon.filter((p) => p.storableIn.includes(preset.gameSet))
  const presetPokemon: Map<string, Pokemon> = new Map(
    preset.boxes
      .flatMap((b) => b.pokemon)
      .map((pokeId) => {
        if (pokeId === null) {
          return undefined
        }

        const p = allPokemonMap.get(typeof pokeId === 'object' ? pokeId.pid : pokeId)

        if (!p) {
          throw new Error(`Pokemon ${pokeId} not found`)
        }

        return p
      })
      .filter((p): p is Pokemon => p !== undefined)
      .map((p) => [p.id, p]),
  )

  const processedIds = new Set<string>()
  const errors: string[] = []

  for (const p of storableInGame) {
    if (p.isForm) {
      if (minimal && (p.isCosmeticForm || p.isLegendary || p.isMythical)) {
        // skip cosmetic forms, and forms of legendaries and mythicals
        continue
      }

      if (!presetPokemon.has(p.id)) {
        errors.push(`Missing form ${p.id} in preset ${preset.id}`)
        continue
      }
    }

    if (!p.isForm) {
      if (!presetPokemon.has(p.id)) {
        errors.push(`Missing pokemon ${p.id} in preset ${preset.id}`)
        continue
      }
    }

    if (processedIds.has(p.id)) {
      errors.push(`Duplicate pokemon ${p.id} in preset ${preset.id}`)
      continue
    }

    processedIds.add(p.id)
  }

  return errors
}

function getLastGamePokemonSortedByRegionalDexes(): [Pokemon[], Pokemon[]] {
  const dexes = [pokedexesMap.get('paldea'), pokedexesMap.get('paldea-kitakami'), pokedexesMap.get('paldea-blueberry')]

  if (!dexes.every((d) => d !== undefined)) {
    throw new Error('Some dexes not found')
  }

  const pokemonList: Pokemon[] = dexes
    .filter((d): d is Pokedex => d !== undefined)
    .flatMap((d) => d.entries.map((e) => allPokemonMap.get(e.id)))
    .filter((p): p is Pokemon => p !== undefined)

  const pokemonMap = new Map(pokemonList.map((p) => [p.id, p]))
  const pokemonListNotInDexes = allPokemon.filter((p) => p.storableIn.includes('sv') && !pokemonMap.has(p.id))

  return [pokemonList, pokemonListNotInDexes]
}

function savePreset(preset: BoxPreset): void {
  const presetFile = getDataPath(`boxpresets/${preset.gameSet}/${preset.id}.json`)
  if (!pathExists(presetFile)) {
    throw new Error(`Preset file does not exist: ${presetFile}`)
  }
  // validate preset
  boxPresetSchema.parse(preset)

  writeFile(presetFile, JSON.stringify(preset, null, 2))
}

// --------------------------------------------------------------------------------------------------------
// -------------------------------------      GENERATORS        -------------------------------------------
// --------------------------------------------------------------------------------------------------------

function generateGoBoxPresets(): void {
  const gameSet = 'go'
  const autoPresets: BoxPresetMode[] = ['fully-sorted', 'sorted-species']

  // generate presets
  for (const presetIdSuffix of autoPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}`
    const presetIdMinimal = `${gameSet}-${presetIdSuffix}-minimal`
    const preset = boxPresetsMap.get(presetId)
    const presetMinimal = boxPresetsMap.get(presetIdMinimal)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    if (!presetMinimal) {
      throw new Error(`Preset ${presetIdMinimal} not found`)
    }

    preset.boxes = distributePokemonInBoxes(allPokemon, gameSet, presetIdSuffix, 9999, false, [], false, false)
    savePreset(preset)

    presetMinimal.boxes = distributePokemonInBoxes(allPokemon, gameSet, presetIdSuffix, 9999, true, [], false, false)
    savePreset(presetMinimal)
  }
}

function generateHomeBoxPresets(): void {
  const gameSet = 'home'
  const autoPresets: BoxPresetMode[] = ['fully-sorted', 'sorted-species']
  const manualPresets = ['grouped-region', 'species-first']
  const startsNewBox = ['chikorita', 'treecko', 'turtwig', 'victini', 'chespin', 'rowlet', 'grookey', 'sprigatito']

  // generate presets
  for (const presetIdSuffix of autoPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}`
    const presetIdMinimal = `${gameSet}-${presetIdSuffix}-minimal`
    const preset = boxPresetsMap.get(presetId)
    const presetMinimal = boxPresetsMap.get(presetIdMinimal)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    if (!presetMinimal) {
      throw new Error(`Preset ${presetIdMinimal} not found`)
    }

    preset.boxes = distributePokemonInBoxes(allPokemon, gameSet, presetIdSuffix, 30, false, startsNewBox, true, true)
    savePreset(preset)

    presetMinimal.boxes = distributePokemonInBoxes(
      allPokemon,
      gameSet,
      presetIdSuffix,
      30,
      true,
      startsNewBox,
      true,
      true,
    )
    savePreset(presetMinimal)
  }

  // verify manual presets
  for (const presetIdSuffix of manualPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}`
    const preset = boxPresetsMap.get(presetId)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    const errors = validatePresetBoxes(preset, false)

    if (errors.length > 0) {
      console.warn(`Preset ${presetId} has errors: \n - ${errors.join('\n - ')}`)
    }
  }
}

function generateLastGamesBoxPresets(): void {
  const gameSet = 'sv'
  const gameSetRegion = 'paldea'
  const autoPresets: BoxPresetMode[] = ['fully-sorted', 'sorted-species']
  const autoRegionalPresets: BoxPresetMode[] = ['fully-sorted']
  const manualPresets = ['fully-grouped-paldea']

  // generate national presets
  for (const presetIdSuffix of autoPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}`
    const preset = boxPresetsMap.get(presetId)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    preset.boxes = distributePokemonInBoxes(allPokemon, gameSet, presetIdSuffix, 30, false)
    savePreset(preset)
  }

  // generate regional presets
  const regionalDexPokemon = getLastGamePokemonSortedByRegionalDexes()

  for (const presetIdSuffix of autoRegionalPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}-${gameSetRegion}`
    const presetIdMinimal = `${gameSet}-${presetIdSuffix}-${gameSetRegion}-minimal`
    const preset = boxPresetsMap.get(presetId)
    const presetMinimal = boxPresetsMap.get(presetIdMinimal)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    if (!presetMinimal) {
      throw new Error(`Preset ${presetIdMinimal} not found`)
    }

    preset.boxes = distributePokemonInBoxes(regionalDexPokemon[0], gameSet, presetIdSuffix, 30, false).concat(
      distributePokemonInBoxes(regionalDexPokemon[1], gameSet, presetIdSuffix, 30, false),
    )
    savePreset(preset)

    presetMinimal.boxes = distributePokemonInBoxes(regionalDexPokemon[0], gameSet, presetIdSuffix, 30, true).concat(
      distributePokemonInBoxes(regionalDexPokemon[1], gameSet, presetIdSuffix, 30, true),
    )
    savePreset(presetMinimal)
  }

  // verify manual presets
  for (const presetIdSuffix of manualPresets) {
    const presetId = `${gameSet}-${presetIdSuffix}`
    const preset = boxPresetsMap.get(presetId)

    if (!preset) {
      throw new Error(`Preset ${presetId} not found`)
    }

    const errors = validatePresetBoxes(preset, true)

    if (errors.length > 0) {
      console.warn(`Preset ${presetId} has errors: \n - ${errors.join('\n - ')}`)
    }
  }
}

generateGoBoxPresets()
generateHomeBoxPresets()
generateLastGamesBoxPresets()
