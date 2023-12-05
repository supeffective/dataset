import fs from 'node:fs'
import { cors as corsPlugin } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { Elysia } from 'elysia'
import { resolveConfig } from './resolveConfig'

const { port, dataPath, distDataPath, assetsPath } = resolveConfig()

const server = new Elysia()
  .use(corsPlugin())
  .use(
    staticPlugin({
      assets: dataPath,
      prefix: '/data',
    }),
  )
  .use(
    staticPlugin({
      assets: distDataPath,
      prefix: '/dist/data',
    }),
  )

const serverWithMediaAssets = assetsPath
  ? server.use(
      staticPlugin({
        assets: assetsPath,
        prefix: '/assets',
      }),
    )
  : server

const htmlFile = `${distDataPath}/index.html`
if (!fs.existsSync(htmlFile)) {
  throw new Error(`File ${htmlFile} not found`)
}

serverWithMediaAssets
  .get('/', () => {
    return new Response(fs.readFileSync(htmlFile), {
      headers: {
        'content-type': 'text/html',
      },
    })
  })
  .listen(port, () => {
    console.log(`⚡️[static-dev-server]: Server is running at http://localhost:${port}`)
    console.log(`⚡️[static-dev-server]: Serving /assets from ${assetsPath}`)
    console.log(`⚡️[static-dev-server]: Serving /data from ${dataPath}`)
    console.log(`⚡️[static-dev-server]: Serving /dist/data from ${distDataPath}`)
  })
