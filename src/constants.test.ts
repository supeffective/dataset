import { PKM_LATEST_GAMESET, PKM_LATEST_GENERATION, PKM_LATEST_POKEDEX, PKM_LATEST_REGION } from './constants'

it('has expected values', () => {
  expect([PKM_LATEST_GAMESET, PKM_LATEST_GENERATION, PKM_LATEST_POKEDEX, PKM_LATEST_REGION]).toEqual([
    'sv',
    9,
    'paldea',
    'paldea',
  ])
})
