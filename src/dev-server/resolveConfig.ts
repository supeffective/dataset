import fs from 'node:fs'
import path from 'node:path'
import { ZodError, z } from 'zod'

const repoRoot = process.cwd()

const envVarsSchema = z.object({
  STATIC_DEV_SERVER_PORT: z.string().default('4455'),
  STATIC_DEV_SERVER_DATA_PATH: z.string(),
  STATIC_DEV_SERVER_DATA_DIST_PATH: z.string(),
  STATIC_DEV_SERVER_ASSETS_PATH: z.string().optional(),
})

type EnvVars = z.infer<typeof envVarsSchema>

function ensureDirExists(dirPath: string, errorMsg?: string) {
  if (!dirPath) {
    throw new Error('static-dev-server: cannot use an empty path string')
  }
  if (!fs.existsSync(dirPath)) {
    throw new Error(`static-dev-server: ${errorMsg ?? `cannot use an non existing path: ${dirPath}`}`)
  }
}

function resolveConfig(): {
  port: string
  dataPath: string
  distDataPath: string
  assetsPath: string | null
} {
  let envVars: EnvVars

  try {
    envVars = envVarsSchema.parse(process.env)
  } catch (error) {
    if (!(error instanceof ZodError)) {
      throw error
    }
    throw new Error(`Invalid environment variables: ${JSON.stringify(error.format(), null, 2)}`)
  }

  const dataPath = path.resolve(repoRoot, envVars.STATIC_DEV_SERVER_DATA_PATH)
  const distDataPath = path.resolve(repoRoot, envVars.STATIC_DEV_SERVER_DATA_DIST_PATH)

  const assetsPath = envVars.STATIC_DEV_SERVER_ASSETS_PATH
    ? path.resolve(repoRoot, envVars.STATIC_DEV_SERVER_ASSETS_PATH)
    : null

  const port = envVars.STATIC_DEV_SERVER_PORT

  ensureDirExists(dataPath)
  ensureDirExists(distDataPath, 'cannot find the data dist folder, did you run pnpm build?')

  return {
    port,
    dataPath,
    distDataPath,
    assetsPath: assetsPath && fs.existsSync(assetsPath) ? assetsPath : null,
  }
}

export { resolveConfig }
