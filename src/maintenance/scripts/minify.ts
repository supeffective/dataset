import fs from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
import { jsonStringifyRecords } from '../../utils'

const inputDirArg = process.argv[2]
const outputDirArg = process.argv[3]

if (!inputDirArg || !outputDirArg) {
  console.error('Usage: node minify-json.ts <input-dir-or-glob> <output-dir>')
  process.exit(1)
}
// Minify source JSON files, if they are an array of objects.
;((inputDir: string) => {
  function minify(data: string): string {
    const parsedData = JSON.parse(data)
    if (!Array.isArray(parsedData)) {
      return data
    }
    return jsonStringifyRecords(parsedData)
  }

  const files = globSync(path.join(inputDir, '**', '*.json'))

  for (const file of files) {
    if (file.endsWith('.min.json')) {
      return
    }

    const outputPath = file
    const data = fs.readFileSync(file, 'utf8')
    const minifiedData = minify(data)
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, minifiedData)
  }
})(path.resolve(inputDirArg))

// Create .min.json files.
;((inputDir: string, outputDir: string) => {
  function createOutputPath(inputPath: string): string {
    const relativePath = path.relative(inputDir, inputPath)
    const outputPath = path.join(outputDir, relativePath)
    return outputPath.replace(/\.json$/, '.min.json')
  }

  function minify(data: string): string {
    return JSON.stringify(JSON.parse(data))
  }

  const files = globSync(path.join(inputDir, '**', '*.json'))

  for (const file of files) {
    if (file.endsWith('.min.json')) {
      return
    }

    const outputPath = createOutputPath(file)
    const data = fs.readFileSync(file, 'utf8')
    const minifiedData = minify(data)
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, minifiedData)
  }
})(path.resolve(inputDirArg), outputDirArg)
