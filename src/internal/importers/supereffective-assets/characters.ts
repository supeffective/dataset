import fs from 'node:fs'
import { getDataPath } from '../../utils/fs'

const JSON_DATA_URL =
  'https://raw.githubusercontent.com/supeffective/assets/main/assets/images/characters/characters.json'
type ResponseItem = {
  id: number
  name: string
}

export async function importMastersEXCharacters(): Promise<Array<ResponseItem>> {
  const response = await fetch(JSON_DATA_URL).then((res) => res.json())
  const destFilename = getDataPath('characters.json')
  fs.writeFileSync(destFilename, JSON.stringify(response, null, 2))

  return response
}
