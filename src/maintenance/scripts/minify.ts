import fs from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'

const inputDirArg = process.argv[2]
const outputDirArg = process.argv[3]

if (!inputDirArg || !outputDirArg) {
  console.error('Usage: node minify-json.ts <input-dir-or-glob> <output-dir>')
  process.exit(1)
}
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
  // const files = globSync(path.join(inputDir, '*.json'))

  files.forEach((file) => {
    if (file.endsWith('.min.json')) {
      return
    }

    const outputPath = createOutputPath(file)
    const data = fs.readFileSync(file, 'utf8')
    const minifiedData = minify(data)
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, minifiedData)
  })
})(path.resolve(inputDirArg), outputDirArg)
