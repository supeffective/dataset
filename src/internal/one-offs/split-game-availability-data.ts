import type { Game, Pokemon } from '../..'
import { getDataPath, readFileAsJson, writeFile } from '../utils/fs'

function runUpdateIndexFile() {
  const joinedGames = readFileAsJson<Game[]>(getDataPath('games.json'))
  const pokemon = readFileAsJson<Pokemon[]>(getDataPath('pokemon.json'))

  for (const game of joinedGames) {
    const destFile = getDataPath(`games/${game.id}.json`)
    game.obtainablePokemon = []
    game.storablePokemon = []
    game.eventPokemon = []
    // game.transferOnlyPokemon = []

    for (const pkmn of pokemon) {
      // const isInGame = pkmn.obtainableIn.includes(game.id) || pkmn.registrableIn.includes(game.id)

      if (pkmn.obtainableIn?.includes(game.id) || pkmn.versionExclusiveIn?.includes(game.id)) {
        game.obtainablePokemon.push(pkmn.id)
      }
      if (pkmn.storableIn?.includes(game.id)) {
        game.storablePokemon.push(pkmn.id)
      }
      if (pkmn.eventOnlyIn?.includes(game.id)) {
        game.eventPokemon.push(pkmn.id)
      }
      // if (pkmn.storableIn.includes(game.id) && !pkmn.registrableIn.includes(game.id)) {
      //   game.transferOnlyPokemon.push(pkmn.id)
      // }
    }

    writeFile(destFile, JSON.stringify(game, null, 2))
  }

  // delete fields from each pokemon entry
  for (const pkm of pokemon) {
    const destPokemonFile = getDataPath(`pokemon/${pkm.id}.json`)
    const { obtainableIn, storableIn, eventOnlyIn, versionExclusiveIn, registrableIn, ...newPkm } = pkm

    writeFile(destPokemonFile, JSON.stringify(newPkm, null, 2))
  }
}

runUpdateIndexFile()
