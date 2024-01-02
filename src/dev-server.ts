import fs from 'node:fs'
import path from 'node:path'

import bodyParser from 'body-parser'
import cors from 'cors'
import express, { type Express, type Request, type Response } from 'express'

const projectRoot = process.cwd()

const config = {
  port: process.env.PORT ?? '4455',
  dataPath: process.env.STATIC_DATA_PATH ?? path.join(projectRoot, 'data'),
  distPath: process.env.STATIC_DIST_PATH ?? path.join(projectRoot, 'dist'),
}

if (!fs.existsSync(config.dataPath) || !fs.lstatSync(config.dataPath).isDirectory()) {
  throw new Error(`Data path '${config.dataPath}' does not exist or is not a directory`)
}

if (!fs.existsSync(config.distPath) || !fs.lstatSync(config.distPath).isDirectory()) {
  throw new Error(`Dist path '${config.distPath}' does not exist or is not a directory`)
}

const app: Express = express()
const { port, dataPath, distPath } = config

app.use(cors())

// parse application/x-www-form-urlencoded requests
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json requests
app.use(bodyParser.json())

const htmlFile = `${distPath}/data/index.html`
if (!fs.existsSync(htmlFile)) {
  throw new Error(`HTML index file '${htmlFile}' not found`)
}

// serve static content under /data and /dist/data
app.use('/data', express.static(dataPath))
app.use('/dist', express.static(distPath))

// root endpoint
app.get('/', (_req: Request, res: Response) => {
  // Redirect to /dist/data
  res.redirect('/dist/data')
})

app.listen(port, () => {
  console.log(`⚡️[dataset-server]: Data path is ${dataPath}`)
  console.log(`⚡️[dataset-server]: Dist path is ${distPath}`)
  console.log(`⚡️[dataset-server]: Server is running at http://localhost:${port}`)
})
